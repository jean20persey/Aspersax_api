from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Robot

User = get_user_model()

class RobotModelTests(TestCase):
    def test_creacion_robot_defaults(self):
        """Verifica que el robot tome los defaults de finca y nombre si no se proveen"""
        robot = Robot.objects.create(
            bateria=100
        )
        self.assertEqual(robot.finca, "Finca La Riverita")
        self.assertEqual(robot.nombre, "ASPERSAX-01")
        self.assertEqual(robot.estado, "Disponible")

class RobotAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='admin_robot',
            password='password123',
            email='robot@test.com'
        )
        self.client.force_authenticate(user=self.user)
        
        self.robot = Robot.objects.create(
            nombre="ASPERSAX-TEST",
            estado="Disponible",
            bateria=80
        )

    def test_listar_robots(self):
        url = reverse('robot-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        self.assertGreaterEqual(len(data), 1)

    # Eliminado test_crear_robot usando reverse, se usará test_crear_robot_direct

    def test_crear_robot_direct(self):
        url = '/api/robots/crear/'
        data = {
            "nombre": "ASPERSAX-02",
            "estado": "En Operación",
            "bateria": 50
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Robot.objects.count(), 2)

    def test_actualizar_robot(self):
        url = f'/api/robots/{self.robot.id_robot}/actualizar/'
        data = {
            "estado": "En Mantenimiento",
            "bateria": 20
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.robot.refresh_from_db()
        self.assertEqual(self.robot.estado, "En Mantenimiento")
        self.assertEqual(self.robot.bateria, 20)
