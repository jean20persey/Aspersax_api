from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Tanque

User = get_user_model()

class TanqueModelTests(TestCase):
    def test_creacion_tanque(self):
        tanque = Tanque.objects.create(
            nombre="Tanque Norte",
            capacidad=200,
            nivel_actual=150,
            estado="Medio"
        )
        self.assertEqual(tanque.nombre, "Tanque Norte")
        self.assertEqual(tanque.nivel_actual, 150)
        self.assertEqual(tanque.estado, "Medio")

class TanqueAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='admin_tanques',
            password='password123',
            email='admin@tanques.com'
        )
        self.client.force_authenticate(user=self.user)
        self.tanque = Tanque.objects.create(
            nombre="Tanque Principal",
            capacidad=1000,
            nivel_actual=1000,
            estado="Lleno"
        )

    def test_listar_tanques(self):
        url = reverse('tanque-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        self.assertGreaterEqual(len(data), 1)

    def test_crear_tanque(self):
        url = reverse('tanque-list')
        data = {
            "nombre": "Tanque Reserva",
            "capacidad": 500,
            "nivel_actual": 0,
            "estado": "Vacío"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_actualizar_tanque(self):
        url = reverse('tanque-detail', args=[self.tanque.id_tanque])
        data = {
            "nivel_actual": 500,
            "estado": "Medio"
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.tanque.refresh_from_db()
        self.assertEqual(self.tanque.nivel_actual, 500)
