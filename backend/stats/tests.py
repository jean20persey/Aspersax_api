from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from robots.models import Robot
from tanques.models import Tanque
from malezas.models import Maleza
from reportes.models import Reporte, DetalleMaleza
from datetime import timedelta

User = get_user_model()


class StatsEndpointsTests(APITestCase):
    def setUp(self):
        # Usuario y autenticación
        self.user = User.objects.create_user(
            username='tester', password='testpass123', email='tester@example.com'
        )
        self.client.force_authenticate(user=self.user)

        # Datos base
        self.robot = Robot.objects.create(nombre='R1', estado='En Operación', bateria=80, activo=True)
        self.tanque = Tanque.objects.create(nombre='T1', capacidad=100, nivel_actual=50, estado='Medio', activo=True)
        self.maleza = Maleza.objects.create(nombre='Weed', tipo='Otra', activo=True)

        self.reporte = Reporte.objects.create(
            tipo='Jornada', robot=self.robot, tanque=self.tanque,
            area_cubierta=123.4, herbicida_usado=1.5, duracion=timedelta(minutes=45), activo=True
        )
        DetalleMaleza.objects.create(
            reporte=self.reporte, maleza=self.maleza, cantidad=3, ubicacion='A1', herbicida_aplicado=10, efectividad=70
        )

    def test_stats(self):
        url = reverse('stats')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        body = resp.data
        # Estructura esperada
        for key in ['total_robots', 'robots_activos', 'total_tanques', 'tanques_en_uso', 'total_malezas', 'malezas_detectadas', 'area_cubierta', 'herbicida_usado']:
            self.assertIn(key, body)

    def test_activity(self):
        url = reverse('activity')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIsInstance(resp.data, list)

    def test_robot_stats(self):
        url = reverse('robot_stats')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(any(item['id_robot'] == self.robot.id_robot for item in resp.data))

    def test_tank_stats(self):
        url = reverse('tank_stats')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(any(item['id_tanque'] == self.tanque.id_tanque for item in resp.data))

    def test_weed_stats(self):
        url = reverse('weed_stats')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(any(item['maleza__nombre'] == self.maleza.nombre for item in resp.data))
from django.test import TestCase

# Create your tests here.
