from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Reporte
from robots.models import Robot
from tanques.models import Tanque
from malezas.models import Maleza
from datetime import datetime, timedelta, date, time

User = get_user_model()

class ReporteTests(APITestCase):
    def setUp(self):
        # Crear usuario de prueba
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        
        # Crear robot de prueba
        self.robot = Robot.objects.create(
            nombre='Robot Reportes',
            estado='Disponible',
            bateria=70,
            activo=True
        )
        
        # Crear tanque de prueba
        self.tanque = Tanque.objects.create(
            nombre='Tanque Reportes',
            capacidad=120.0,
            nivel_actual=100.0,
            estado='Lleno',
            activo=True
        )

        # Crear maleza de prueba
        self.maleza = Maleza.objects.create(
            nombre='Lote 1 - Sector Norte',
            nombre_cientifico='Rumex crispus',
            descripcion='Prueba',
            activo=True
        )
        
        # Crear un reporte de prueba
        self.reporte = Reporte.objects.create(
            tipo='Jornada',
            robot=self.robot,
            tanque=self.tanque,
            area_cubierta=200.0,
            herbicida_usado=2.5,
            duracion=timedelta(hours=1, minutes=30),
            observaciones='Reporte de prueba',
            activo=True
        )
        
        # Autenticar el cliente
        self.client.force_authenticate(user=self.user)

    def test_crear_reporte(self):
        """Prueba la creación de un nuevo reporte con malezas_detectadas"""
        url = reverse('reporte-list')
        data = {
            'tipo': 'Jornada',
            'robot_id': self.robot.id_robot,
            'tanque_id': self.tanque.id_tanque,
            'area_cubierta': 150.0,
            'herbicida_usado': 1.2,
            'duracion': str(timedelta(minutes=90)),
            'observaciones': 'Nuevo reporte de prueba',
            'activo': True,
            'malezas_detectadas': [
                {
                    'maleza_id': self.maleza.id_maleza,
                    'cantidad': 5,
                    'ubicacion': 'Sector A',
                    'herbicida_aplicado': 50.0,
                    'efectividad': 80
                }
            ]
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Como el ViewSet usa queryset con activo=True, conteo por filtro
        self.assertEqual(Reporte.objects.filter(activo=True).count(), 2)

    def test_listar_reportes(self):
        """Prueba obtener la lista de reportes (paginado o no)"""
        url = reverse('reporte-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        items = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        self.assertGreaterEqual(len(items), 1)

    def test_detalle_reporte(self):
        """Prueba obtener los detalles de un reporte específico"""
        url = reverse('reporte-detail', args=[self.reporte.id_reporte])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['robot']['nombre'], 'Robot Reportes')

    def test_actualizar_reporte(self):
        """Prueba actualizar un reporte existente"""
        url = reverse('reporte-detail', args=[self.reporte.id_reporte])
        data = {
            'tipo': 'Mantenimiento',
            'robot_id': self.robot.id_robot,
            'tanque_id': self.tanque.id_tanque,
            'area_cubierta': 300.0,
            'herbicida_usado': 0.0,
            'duracion': str(timedelta(minutes=30)),
            'observaciones': 'Actualizado',
            'activo': True
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Reporte.objects.get(id_reporte=self.reporte.id_reporte).area_cubierta, 300.0)

    def test_eliminar_reporte(self):
        """Prueba eliminación (soft delete) de un reporte"""
        url = reverse('reporte-detail', args=[self.reporte.id_reporte])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # Soft delete: activo=False
        self.reporte.refresh_from_db()
        self.assertFalse(self.reporte.activo)

    def test_reportes_por_robot(self):
        """Prueba la acción por_robot del ViewSet"""
        url = reverse('reporte-por-robot')
        response = self.client.get(f"{url}?robot_id={self.robot.id_robot}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        items = response.data
        self.assertTrue(all(item['robot']['id_robot'] == self.robot.id_robot for item in items))

    def test_reportes_por_periodo(self):
        """Prueba la acción por_periodo del ViewSet"""
        # Crear un reporte antiguo fuera del periodo "dia"
        viejo = Reporte.objects.create(
            tipo='Incidente',
            robot=self.robot,
            tanque=self.tanque,
            area_cubierta=0,
            herbicida_usado=0,
            duracion=timedelta(minutes=5),
            observaciones='Viejo',
            activo=True
        )
        # No manipulamos 'fecha' aquí; asumimos auto now y el filtro incluye el actual
        url = reverse('reporte-por-periodo')
        response = self.client.get(f"{url}?periodo=dia")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Debe devolver al menos el reporte creado en setUp
        self.assertTrue(any(item['id_reporte'] == self.reporte.id_reporte for item in response.data))

    def test_reportes_por_tipo(self):
        """Prueba la acción por_tipo del ViewSet"""
        url = reverse('reporte-por-tipo')
        response = self.client.get(f"{url}?tipo=Jornada")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(all(item['tipo'] == 'Jornada' for item in response.data))
