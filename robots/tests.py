from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Robot

User = get_user_model()

class RobotTests(APITestCase):
    def setUp(self):
        # Crear usuario de prueba
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        
        # Crear un robot de prueba
        self.robot = Robot.objects.create(
            modelo='Modelo Test',
            estado='Activo',
            activo=True
        )
        
        # Autenticar el cliente
        self.client.force_authenticate(user=self.user)

    def test_crear_robot(self):
        """Prueba la creación de un nuevo robot"""
        url = reverse('crear-robot')
        data = {
            'modelo': 'Modelo Nuevo',
            'estado': 'Inactivo',
            'activo': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Robot.objects.count(), 2)
        self.assertEqual(Robot.objects.get(modelo='Modelo Nuevo').estado, 'Inactivo')

    def test_listar_robots(self):
        """Prueba obtener la lista de robots"""
        url = reverse('robot-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_detalle_robot(self):
        """Prueba obtener los detalles de un robot específico"""
        url = reverse('robot-detail', args=[self.robot.id_robot])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['modelo'], 'Modelo Test')

    def test_actualizar_robot(self):
        """Prueba actualizar un robot existente"""
        url = reverse('actualizar-robot', args=[self.robot.id_robot])
        data = {
            'modelo': 'Modelo Actualizado',
            'estado': 'Mantenimiento',
            'activo': False
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Robot.objects.get(id_robot=self.robot.id_robot).modelo, 'Modelo Actualizado')

    def test_eliminar_robot(self):
        """Prueba eliminar un robot"""
        url = reverse('eliminar-robot', args=[self.robot.id_robot])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Robot.objects.count(), 0)

    def test_filtrar_robots_por_estado(self):
        """Prueba filtrar robots por estado"""
        # Crear un robot adicional con estado diferente
        Robot.objects.create(
            modelo='Robot Inactivo',
            estado='Inactivo',
            activo=False
        )
        
        url = reverse('robots-por-estado', args=['Activo'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['modelo'], 'Modelo Test')
