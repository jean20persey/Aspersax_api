from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
<<<<<<< HEAD
from .models import Reporte
from jornadas.models import Jornada
from robots.models import Robot
from tanques.models import Tanque
from datetime import datetime, timedelta, date, time
from decimal import Decimal
=======
from .models import Reporte, DetalleMaleza
from robots.models import Robot
from tanques.models import Tanque
from jornadas.models import Jornada
from malezas.models import Maleza
from decimal import Decimal
from datetime import datetime, timedelta, date, time
>>>>>>> 30311b5 (Primer commit: API Aspersax)

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
<<<<<<< HEAD
            modelo='Modelo Test',
            estado='Activo',
=======
            nombre='Robot Test',
            estado='Disponible',
            bateria=100,
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            activo=True
        )
        
        # Crear tanque de prueba
        self.tanque = Tanque.objects.create(
<<<<<<< HEAD
            capacidad=Decimal('100.0'),
            tipo='Principal',
            estado='Operativo',
=======
            nombre='Tanque Test',
            capacidad=100.0,
            nivel_actual=75.0,
            estado='Medio',
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            activo=True
        )
        
        # Crear jornada de prueba
        self.jornada = Jornada.objects.create(
<<<<<<< HEAD
            robot=self.robot,
            tanque=self.tanque,
=======
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            fecha=date.today(),
            hora_inicio=time(8, 0),
            hora_fin=time(10, 0),
            duracion=timedelta(hours=2),
            area_tratada=100.0,
<<<<<<< HEAD
=======
            robot=self.robot,
            tanque=self.tanque,
>>>>>>> 30311b5 (Primer commit: API Aspersax)
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
<<<<<<< HEAD
            robot=self.robot,
            tanque=self.tanque,
=======
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            fecha=date.today(),
            hora_inicio=time(14, 0),  # 2:00 PM
            hora_fin=time(16, 0),     # 4:00 PM
            duracion=timedelta(hours=2),
            area_tratada=150.0,
<<<<<<< HEAD
=======
            robot=self.robot,
            tanque=self.tanque,
>>>>>>> 30311b5 (Primer commit: API Aspersax)
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
<<<<<<< HEAD
        url = reverse('reportes:reporte_by_jornada', args=[self.jornada.id_jornada])
=======
        url = reverse('reportes:reporte_por_jornada', args=[self.jornada.id_jornada])
>>>>>>> 30311b5 (Primer commit: API Aspersax)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['jornada'], self.jornada.id_jornada)

    def test_validar_reporte_unico_por_jornada(self):
        """Prueba que no se puede crear más de un reporte por jornada"""
        url = reverse('reportes:reporte_create')
        data = {
<<<<<<< HEAD
            'jornada': self.jornada.id_jornada,
=======
            'jornada': self.jornada.id_jornada,  # Usar la misma jornada
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            'resumen': 'Reporte duplicado',
            'activo': True
        }
        response = self.client.post(url, data, format='json')
<<<<<<< HEAD
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
=======
        # Debería fallar porque ya existe un reporte para esta jornada
        self.assertNotEqual(response.status_code, status.HTTP_201_CREATED)

class DetalleMalezaTests(APITestCase):
    def setUp(self):
        # Crear usuario de prueba
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        
        # Crear robot y tanque de prueba
        self.robot = Robot.objects.create(
            nombre='Robot Test',
            estado='Disponible',
            bateria=100,
            activo=True
        )
        
        self.tanque = Tanque.objects.create(
            nombre='Tanque Test',
            capacidad=100.0,
            nivel_actual=75.0,
            estado='Medio',
            activo=True
        )
        
        # Crear jornada de prueba
        self.jornada = Jornada.objects.create(
            fecha=date.today(),
            hora_inicio=time(8, 0),
            hora_fin=time(10, 0),
            duracion=timedelta(hours=2),
            area_tratada=100.0,
            robot=self.robot,
            tanque=self.tanque,
            activo=True
        )
        
        # Crear reporte de prueba
        self.reporte = Reporte.objects.create(
            jornada=self.jornada,
            resumen='Reporte de prueba',
            activo=True
        )
        
        # Crear maleza de prueba
        self.maleza = Maleza.objects.create(
            nombre='Maleza Test',
            tipo='Hoja Ancha',
            activo=True
        )
        
        # Crear detalle de maleza de prueba
        self.detalle_maleza = DetalleMaleza.objects.create(
            reporte=self.reporte,
            maleza=self.maleza,
            cantidad=5,
            ubicacion='Sector A',
            activo=True
        )
        
        # Autenticar el cliente
        self.client.force_authenticate(user=self.user)

    def test_crear_detalle_maleza(self):
        """Prueba la creación de un nuevo detalle de maleza"""
        url = reverse('reportes:detalle_maleza_create')
        data = {
            'reporte': self.reporte.id_reporte,
            'maleza': self.maleza.id_maleza,
            'cantidad': 3,
            'ubicacion': 'Sector B',
            'activo': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(DetalleMaleza.objects.count(), 2)

    def test_listar_detalles_maleza(self):
        """Prueba obtener la lista de detalles de maleza"""
        url = reverse('reportes:detalle_maleza_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_detalle_maleza_por_reporte(self):
        """Prueba obtener los detalles de maleza de un reporte específico"""
        url = reverse('reportes:detalles_maleza_por_reporte', args=[self.reporte.id_reporte])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['maleza'], self.maleza.id_maleza)
>>>>>>> 30311b5 (Primer commit: API Aspersax)
