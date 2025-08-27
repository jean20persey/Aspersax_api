from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Tanque
from decimal import Decimal

User = get_user_model()

class TanqueTests(APITestCase):
    def setUp(self):
        # Crear usuario de prueba
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        
        # Crear un tanque de prueba
        self.tanque = Tanque.objects.create(
            capacidad=Decimal('100.0'),
            tipo='Principal',
            estado='Operativo',
            activo=True
        )
        
        # Autenticar el cliente
        self.client.force_authenticate(user=self.user)

    def test_crear_tanque(self):
        """Prueba la creación de un nuevo tanque"""
        url = reverse('tanque:tanque_create')
        data = {
            'capacidad': '200.0',
            'tipo': 'Secundario',
            'estado': 'Operativo',
            'activo': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tanque.objects.count(), 2)
        self.assertEqual(Tanque.objects.get(tipo='Secundario').capacidad, Decimal('200.0'))

    def test_listar_tanques(self):
        """Prueba obtener la lista de tanques"""
        url = reverse('tanque:tanque_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_detalle_tanque(self):
        """Prueba obtener los detalles de un tanque específico"""
        url = reverse('tanque:tanque_detail', args=[self.tanque.id_tanque])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['tipo'], 'Principal')

    def test_actualizar_tanque(self):
        """Prueba actualizar un tanque existente"""
        url = reverse('tanque:tanque_update', args=[self.tanque.id_tanque])
        data = {
            'capacidad': '150.0',
            'tipo': 'Actualizado',
            'estado': 'Mantenimiento',
            'activo': True
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Tanque.objects.get(id_tanque=self.tanque.id_tanque).tipo, 'Actualizado')

    def test_eliminar_tanque(self):
        """Prueba eliminar un tanque"""
        url = reverse('tanque:tanque_delete', args=[self.tanque.id_tanque])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Tanque.objects.count(), 0)

    def test_filtrar_tanques_por_tipo(self):
        """Prueba filtrar tanques por tipo"""
        # Crear un tanque adicional con tipo diferente
        Tanque.objects.create(
            capacidad=Decimal('50.0'),
            tipo='Inactivo',
            estado='Fuera de servicio',
            activo=False
        )
        
        url = reverse('tanque:tanque_by_tipo', args=['Principal'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['tipo'], 'Principal')
