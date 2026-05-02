from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from robots.models import Robot
from reportes.models import Reporte, DetalleMaleza
from malezas.models import Maleza

User = get_user_model()

class DashboardAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='admin_dashboard', password='123')
        self.client.force_authenticate(user=self.user)
        
        self.robot = Robot.objects.create(nombre="Robot Dashboard")
        self.maleza = Maleza.objects.create(nombre="Lote 1", nombre_cientifico="Rumex crispus")
        
        self.reporte = Reporte.objects.create(
            robot=self.robot,
            area_cubierta=500,
            herbicida_usado=10
        )
        DetalleMaleza.objects.create(
            reporte=self.reporte,
            maleza=self.maleza,
            cantidad=20
        )

    def test_get_stats(self):
        url = '/api/dashboard/stats/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_robots'], 1)
        self.assertEqual(response.data['area_cubierta'], 500)

    def test_get_activity(self):
        url = '/api/dashboard/activity/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(response.data, list))

    def test_get_robots(self):
        url = '/api/dashboard/robots/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(response.data, list))
