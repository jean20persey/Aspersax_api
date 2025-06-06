from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Reporte
from jornadas.models import Jornada
from robots.models import Robot
from tanques.models import Tanque
from datetime import datetime, timedelta, date, time
from decimal import Decimal

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
            modelo='Modelo Test',
            estado='Activo',
            activo=True
        )
        
        # Crear tanque de prueba
        self.tanque = Tanque.objects.create(
            capacidad=Decimal('100.0'),
            tipo='Principal',
            estado='Operativo',
            activo=True
        )
        
        # Crear jornada de prueba
        self.jornada = Jornada.objects.create(
            robot=self.robot,
            tanque=self.tanque,
            fecha=date.today(),
            hora_inicio=time(8, 0),
            hora_fin=time(10, 0),
            duracion=timedelta(hours=2),
            area_tratada=100.0,
            activo=True
        )
        
        # Crear un reporte de prueba
        self.reporte = Reporte.objects.create(
            jornada=self.jornada,
            resumen='Reporte de prueba',
            activo=True
        )
        
        # Autenticar el cliente
        self.client.force_authenticate(user=self.user)

    def test_crear_reporte(self):
        """Prueba la creación de un nuevo reporte"""
        # Crear una nueva jornada para el nuevo reporte
        nueva_jornada = Jornada.objects.create(
            robot=self.robot,
            tanque=self.tanque,
            fecha=date.today(),
            hora_inicio=time(14, 0),  # 2:00 PM
            hora_fin=time(16, 0),     # 4:00 PM
            duracion=timedelta(hours=2),
            area_tratada=150.0,
            activo=True
        )
        
        url = reverse('reportes:reporte_create')
        data = {
            'jornada': nueva_jornada.id_jornada,
            'resumen': 'Nuevo reporte de prueba',
            'activo': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Reporte.objects.count(), 2)

    def test_listar_reportes(self):
        """Prueba obtener la lista de reportes"""
        url = reverse('reportes:reporte_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_detalle_reporte(self):
        """Prueba obtener los detalles de un reporte específico"""
        url = reverse('reportes:reporte_detail', args=[self.reporte.id_reporte])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['resumen'], 'Reporte de prueba')

    def test_actualizar_reporte(self):
        """Prueba actualizar un reporte existente"""
        url = reverse('reportes:reporte_update', args=[self.reporte.id_reporte])
        data = {
            'jornada': self.jornada.id_jornada,
            'resumen': 'Resumen actualizado',
            'activo': True
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Reporte.objects.get(id_reporte=self.reporte.id_reporte).resumen, 'Resumen actualizado')

    def test_eliminar_reporte(self):
        """Prueba eliminar un reporte"""
        url = reverse('reportes:reporte_delete', args=[self.reporte.id_reporte])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Reporte.objects.count(), 0)

    def test_reporte_por_jornada(self):
        """Prueba obtener un reporte por su jornada asociada"""
        url = reverse('reportes:reporte_by_jornada', args=[self.jornada.id_jornada])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['jornada'], self.jornada.id_jornada)

    def test_validar_reporte_unico_por_jornada(self):
        """Prueba que no se puede crear más de un reporte por jornada"""
        url = reverse('reportes:reporte_create')
        data = {
            'jornada': self.jornada.id_jornada,
            'resumen': 'Reporte duplicado',
            'activo': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
