from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import CodigoRecuperacion

User = get_user_model()

class AuthAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='auth_user',
            password='auth_password',
            email='auth@user.com'
        )

    def test_login(self):
        url = '/api/token/'
        data = {
            'username': 'auth_user',
            'password': 'auth_password'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_registro(self):
        url = '/api/auth/registro/'
        data = {
            'username': 'new_user',
            'password': 'new_password123',
            'email': 'new@user.com'
        }
        response = self.client.post(url, data, format='json')
        # Dependiendo del serializer puede ser 201
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_perfil(self):
        self.client.force_authenticate(user=self.user)
        url = '/api/auth/perfil/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'auth_user')

    def test_enviar_codigo_recuperacion(self):
        url = '/api/auth/enviar-codigo-recuperacion/'
        data = {'email': 'auth@user.com'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CodigoRecuperacion.objects.filter(usuario=self.user).count(), 1)

    def test_cambiar_password_con_codigo(self):
        # Crear código
        codigo_obj = CodigoRecuperacion.objects.create(usuario=self.user)
        
        url = '/api/auth/cambiar-password-con-codigo/'
        data = {
            'email': 'auth@user.com',
            'codigo': codigo_obj.codigo,
            'new_password': 'new_password123' # Usamos la nueva clave que soportamos
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que la clave cambió
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('new_password123'))