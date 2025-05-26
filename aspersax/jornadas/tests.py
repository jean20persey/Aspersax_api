from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Jornada
from robots.models import Robot
from tanques.models import Tanque
from datetime import datetime, timedelta, date, time
from decimal import Decimal

User = get_user_model()

class JornadaTests(APITestCase):
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
        
        # Crear una jornada de prueba
        self.fecha = date.today()
        self.hora_inicio = time(8, 0)  # 8:00 AM
        self.hora_fin = time(10, 0)    # 10:00 AM
        self.duracion = timedelta(hours=2)
        
        self.jornada = Jornada.objects.create(
            robot=self.robot,
            tanque=self.tanque,
            fecha=self.fecha,
            hora_inicio=self.hora_inicio,
            hora_fin=self.hora_fin,
            duracion=self.duracion,
            area_tratada=100.0,
            activo=True
        )
        
        # Autenticar el cliente
        self.client.force_authenticate(user=self.user)

    def test_crear_jornada(self):
        """Prueba la creación de una nueva jornada"""
        url = reverse('jornada-crear')
        data = {
            'robot': self.robot.id_robot,
            'tanque': self.tanque.id_tanque,
            'fecha': date.today().isoformat(),
            'hora_inicio': '09:00:00',
            'hora_fin': '11:00:00',
            'duracion': str(timedelta(hours=2)),
            'area_tratada': 50.0,
            'activo': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Jornada.objects.count(), 2)

    def test_listar_jornadas(self):
        """Prueba obtener la lista de jornadas"""
        url = reverse('jornada-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_detalle_jornada(self):
        """Prueba obtener los detalles de una jornada específica"""
        url = reverse('jornada-detail', args=[self.jornada.id_jornada])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['robot'], self.robot.id_robot)

    def test_actualizar_jornada(self):
        """Prueba actualizar una jornada existente"""
        url = reverse('jornada-update', args=[self.jornada.id_jornada])
        data = {
            'robot': self.robot.id_robot,
            'tanque': self.tanque.id_tanque,
            'fecha': self.fecha.isoformat(),
            'hora_inicio': '08:30:00',
            'hora_fin': '10:30:00',
            'duracion': str(timedelta(hours=2)),
            'area_tratada': 150.0,
            'activo': True
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Jornada.objects.get(id_jornada=self.jornada.id_jornada).area_tratada, 150.0)

    def test_eliminar_jornada(self):
        """Prueba eliminar una jornada"""
        url = reverse('jornada-delete', args=[self.jornada.id_jornada])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Jornada.objects.count(), 0)

    def test_filtrar_jornadas_por_fecha(self):
        """Prueba filtrar jornadas por fecha"""
        # Crear una jornada adicional con fecha diferente
        fecha_diferente = date.today() - timedelta(days=1)
        Jornada.objects.create(
            robot=self.robot,
            tanque=self.tanque,
            fecha=fecha_diferente,
            hora_inicio=time(9, 0),
            hora_fin=time(11, 0),
            duracion=timedelta(hours=2),
            area_tratada=75.0,
            activo=True
        )
        
        url = reverse('jornada-por-fecha')
        response = self.client.get(f'{url}?fecha={self.fecha.isoformat()}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['fecha'], self.fecha.isoformat())

    def test_validacion_horas(self):
        """Prueba que la hora de fin no puede ser anterior a la hora de inicio"""
        url = reverse('jornada-crear')
        data = {
            'robot': self.robot.id_robot,
            'tanque': self.tanque.id_tanque,
            'fecha': date.today().isoformat(),
            'hora_inicio': '11:00:00',
            'hora_fin': '09:00:00',  # Hora anterior a la hora de inicio
            'duracion': str(timedelta(hours=2)),
            'area_tratada': 50.0,
            'activo': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
