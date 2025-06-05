from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class AuthenticationTests(APITestCase):
    def setUp(self):
        # Crear un usuario para las pruebas
        self.user_data = {
            'username': 'testuser',
            'password': 'testpass123',
            'email': 'test@example.com',
            'telefono': '1234567890',
            'direccion': 'Test Address'
        }
        self.user = User.objects.create_user(
            username=self.user_data['username'],
            password=self.user_data['password'],
            email=self.user_data['email']
        )
        
        # Crear un superusuario para las pruebas
        self.admin_data = {
            'username': 'admin',
            'password': 'admin123',
            'email': 'admin@example.com'
        }
        self.admin = User.objects.create_superuser(
            username=self.admin_data['username'],
            password=self.admin_data['password'],
            email=self.admin_data['email']
        )

    def test_registro_usuario(self):
        """Prueba el registro de un nuevo usuario"""
        url = reverse('registro')
        data = {
            'username': 'newuser',
            'password': 'newpass123',
            'password2': 'newpass123',
            'email': 'new@example.com',
            'telefono': '0987654321',
            'direccion': 'New Address'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_login_usuario(self):
        """Prueba el inicio de sesión de un usuario"""
        url = reverse('token_obtain_pair')
        data = {
            'username': self.user_data['username'],
            'password': self.user_data['password']
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_refresh_token(self):
        """Prueba la renovación del token de acceso"""
        refresh = RefreshToken.for_user(self.user)
        url = reverse('token_refresh')
        data = {'refresh': str(refresh)}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_perfil_usuario(self):
        """Prueba la vista del perfil de usuario"""
        url = reverse('perfil')
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user_data['username'])

    def test_actualizar_perfil(self):
        """Prueba la actualización del perfil de usuario"""
        url = reverse('perfil')
        self.client.force_authenticate(user=self.user)
        data = {
            'telefono': '1111111111',
            'direccion': 'Updated Address'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['telefono'], data['telefono'])
        self.assertEqual(response.data['direccion'], data['direccion'])

    def test_lista_usuarios_admin(self):
        """Prueba que solo los administradores pueden ver la lista de usuarios"""
        url = reverse('lista_usuarios')
        
        # Intento con usuario normal
        self.client.force_authenticate(user=self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Intento con administrador
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_registro_password_no_coincide(self):
        """Prueba que el registro falla cuando las contraseñas no coinciden"""
        url = reverse('registro')
        data = {
            'username': 'newuser',
            'password': 'pass123',
            'password2': 'pass456',
            'email': 'new@example.com'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 