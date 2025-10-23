from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Robot

User = get_user_model()

class RobotTests(APITestCase):
    def setUp(self):
        # Crear usuario de prueba y autenticar
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        self.client.force_authenticate(user=self.user)

        # Crear un robot inicial
        self.robot = Robot.objects.create(
            nombre='Robot Alpha',
            estado='Disponible',
            bateria=80,
            activo=True
        )

    def test_crear_robot(self):
        """Crear un nuevo robot con campos básicos"""
        url = reverse('crear-robot')
        data = {
            'nombre': 'Robot Beta',
            'estado': 'En Operación',
            'bateria': 55,
            'activo': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Robot.objects.count(), 2)
        nuevo = Robot.objects.get(nombre='Robot Beta')
        self.assertEqual(nuevo.estado, 'En Operación')
        self.assertEqual(nuevo.bateria, 55)
        self.assertTrue(nuevo.activo)

    def test_listar_robots(self):
        """Listar robots existentes"""
        url = reverse('robot-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        items = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        self.assertGreaterEqual(len(items), 1)

    def test_detalle_robot(self):
        """Obtener detalle de un robot por id_robot"""
        url = reverse('robot-detail', args=[self.robot.id_robot])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Robot Alpha')

    def test_actualizar_robot(self):
        """Actualizar un robot existente"""
        url = reverse('actualizar-robot', args=[self.robot.id_robot])
        data = {
            'nombre': 'Robot Alpha V2',
            'estado': 'En Mantenimiento',
            'bateria': 90,
            'activo': False
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.robot.refresh_from_db()
        self.assertEqual(self.robot.nombre, 'Robot Alpha V2')
        self.assertEqual(self.robot.estado, 'En Mantenimiento')
        self.assertEqual(self.robot.bateria, 90)
        self.assertFalse(self.robot.activo)

    def test_eliminar_robot(self):
        """Eliminar un robot"""
        url = reverse('eliminar-robot', args=[self.robot.id_robot])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Robot.objects.count(), 0)

    def test_filtrar_robots_por_estado(self):
        """Filtrar robots por estado (ruta con parámetro de path)"""
        # Crear otro robot en distinto estado
        Robot.objects.create(
            nombre='Robot Gamma',
            estado='Fuera de Servicio',
            bateria=10,
            activo=False
        )

        url = reverse('robots-por-estado', args=['Disponible'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Debe incluir al menos el robot inicial en 'Disponible'
        items = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        estados = [r['estado'] for r in items]
        self.assertTrue(all(e == 'Disponible' for e in estados))
