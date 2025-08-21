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
<<<<<<< HEAD
            capacidad=Decimal('100.0'),
            tipo='Principal',
            estado='Operativo',
=======
            nombre='Tanque Test',
            capacidad=100.0,
            nivel_actual=75.0,
            estado='Medio',
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            activo=True
        )
        
        # Autenticar el cliente
        self.client.force_authenticate(user=self.user)

    def test_crear_tanque(self):
        """Prueba la creación de un nuevo tanque"""
        url = reverse('tanque:tanque_create')
        data = {
<<<<<<< HEAD
            'capacidad': '200.0',
            'tipo': 'Secundario',
            'estado': 'Operativo',
=======
            'nombre': 'Tanque Nuevo',
            'capacidad': '200.0',
            'nivel_actual': '150.0',
            'estado': 'Lleno',
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            'activo': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Tanque.objects.count(), 2)
<<<<<<< HEAD
        self.assertEqual(Tanque.objects.get(tipo='Secundario').capacidad, Decimal('200.0'))
=======
        self.assertEqual(Tanque.objects.get(nombre='Tanque Nuevo').estado, 'Lleno')
>>>>>>> 30311b5 (Primer commit: API Aspersax)

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
<<<<<<< HEAD
        self.assertEqual(response.data['tipo'], 'Principal')
=======
        self.assertEqual(response.data['nombre'], 'Tanque Test')
>>>>>>> 30311b5 (Primer commit: API Aspersax)

    def test_actualizar_tanque(self):
        """Prueba actualizar un tanque existente"""
        url = reverse('tanque:tanque_update', args=[self.tanque.id_tanque])
        data = {
<<<<<<< HEAD
            'capacidad': '150.0',
            'tipo': 'Actualizado',
            'estado': 'Mantenimiento',
=======
            'nombre': 'Tanque Actualizado',
            'capacidad': '150.0',
            'nivel_actual': '100.0',
            'estado': 'Bajo',
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            'activo': True
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
<<<<<<< HEAD
        self.assertEqual(Tanque.objects.get(id_tanque=self.tanque.id_tanque).tipo, 'Actualizado')
=======
        self.assertEqual(Tanque.objects.get(id_tanque=self.tanque.id_tanque).nombre, 'Tanque Actualizado')
>>>>>>> 30311b5 (Primer commit: API Aspersax)

    def test_eliminar_tanque(self):
        """Prueba eliminar un tanque"""
        url = reverse('tanque:tanque_delete', args=[self.tanque.id_tanque])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Tanque.objects.count(), 0)

<<<<<<< HEAD
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
=======
    def test_filtrar_tanques_por_estado(self):
        """Prueba filtrar tanques por estado"""
        # Crear un tanque adicional con estado diferente
        Tanque.objects.create(
            nombre='Tanque Inactivo',
            capacidad=50.0,
            nivel_actual=0.0,
            estado='Vacío',
            activo=False
        )
        
        url = reverse('tanque:tanque_by_estado', args=['Medio'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['nombre'], 'Tanque Test')
>>>>>>> 30311b5 (Primer commit: API Aspersax)
