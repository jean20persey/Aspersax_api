from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Tanque
User = get_user_model()


class TanqueTests(APITestCase):
    def setUp(self):
        # Crear usuario de prueba
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )

        # Autenticar el cliente
        self.client.force_authenticate(user=self.user)

        # Crear un tanque de prueba
        self.tanque = Tanque.objects.create(
            nombre='Tanque A',
            capacidad=100.0,
            nivel_actual=50.0,
            estado='Medio',
            activo=True
        )

    def test_crear_tanque(self):
        """Crear tanque vía ViewSet"""
        url = reverse('tanque-list')
        data = {
            'nombre': 'Tanque B',
            'capacidad': 200.0,
            'nivel_actual': 0.0,
            'estado': 'Vacío',
            'activo': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tanque.objects.filter(activo=True).count(), 2)

    def test_listar_tanques(self):
        """Listar tanques (paginado o no)"""
        url = reverse('tanque-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        items = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        self.assertGreaterEqual(len(items), 1)

    def test_detalle_tanque(self):
        """Detalle de un tanque"""
        url = reverse('tanque-detail', args=[self.tanque.id_tanque])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Tanque A')

    def test_actualizar_tanque(self):
        """Actualizar tanque"""
        url = reverse('tanque-detail', args=[self.tanque.id_tanque])
        data = {
            'nombre': 'Tanque A+',
            'capacidad': 150.0,
            'nivel_actual': 75.0,
            'estado': 'Medio',
            'activo': True
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.tanque.refresh_from_db()
        self.assertEqual(self.tanque.nombre, 'Tanque A+')
        self.assertEqual(self.tanque.capacidad, 150.0)
        self.assertEqual(self.tanque.nivel_actual, 75.0)

    def test_eliminar_tanque_soft_delete(self):
        """Eliminar (soft delete) tanque vía ViewSet"""
        url = reverse('tanque-detail', args=[self.tanque.id_tanque])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.tanque.refresh_from_db()
        self.assertFalse(self.tanque.activo)

    def test_recargar_tanque(self):
        """Acción personalizada recargar: actualiza nivel y estado"""
        url = reverse('tanque-recargar', args=[self.tanque.id_tanque])
        # Recargar 25, pasa de 50 a 75 (estado esperado: Medio)
        response = self.client.post(url, {'cantidad': 25}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.tanque.refresh_from_db()
        self.assertEqual(self.tanque.nivel_actual, 75.0)
        self.assertEqual(self.tanque.estado, 'Medio')

    def test_recargar_excede_capacidad(self):
        """No debe permitir exceder la capacidad"""
        url = reverse('tanque-recargar', args=[self.tanque.id_tanque])
        # Intentar cargar 100 cuando capacidad es 100 y nivel 50 => excede
        response = self.client.post(url, {'cantidad': 100}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_recargar_cantidad_invalida(self):
        """Validación de cantidad <= 0"""
        url = reverse('tanque-recargar', args=[self.tanque.id_tanque])
        response = self.client.post(url, {'cantidad': 0}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
