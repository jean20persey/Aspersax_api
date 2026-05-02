from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import time, timedelta
from .models import Jornada
from robots.models import Robot
from tanques.models import Tanque

User = get_user_model()

class JornadaModelTests(TestCase):
    def test_creacion_jornada_defaults(self):
        robot = Robot.objects.create(nombre="Robot 1")
        tanque = Tanque.objects.create(nombre="Tanque 1")
        jornada = Jornada.objects.create(
            fecha=timezone.now().date(),
            hora_inicio=time(8, 0),
            hora_fin=time(10, 0),
            duracion=timedelta(hours=2),
            area_tratada=50.0,
            robot=robot,
            tanque=tanque
        )
        self.assertEqual(jornada.finca, "Finca La Riverita")

class JornadaAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='admin_jornadas', password='123')
        self.client.force_authenticate(user=self.user)
        
        self.robot = Robot.objects.create(nombre="Robot 1")
        self.tanque = Tanque.objects.create(nombre="Tanque 1")
        
        self.jornada = Jornada.objects.create(
            fecha=timezone.now().date(),
            hora_inicio=time(8, 0),
            hora_fin=time(10, 0),
            duracion=timedelta(hours=2),
            area_tratada=50.0,
            robot=self.robot,
            tanque=self.tanque
        )

    def test_listar_jornadas(self):
        url = reverse('jornada-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        self.assertGreaterEqual(len(data), 1)

    def test_actualizar_jornada(self):
        url = reverse('jornada-detail', args=[self.jornada.id_jornada])
        data = {
            "area_tratada": 100.0
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.jornada.refresh_from_db()
        self.assertEqual(self.jornada.area_tratada, 100.0)
