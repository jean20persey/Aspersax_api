from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from django.core import mail

User = get_user_model()

class EmailAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='admin_emails', password='123')
        self.client.force_authenticate(user=self.user)

    def test_enviar_email_exitoso_string(self):
        url = '/api/emails/enviar/'
        data = {
            "destinatario": "test@test.com",
            "asunto": "Prueba",
            "mensaje": "Mensaje de prueba"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verificar que el email se "envió" a la bandeja de salida de pruebas de Django
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Prueba')

    def test_enviar_email_exitoso_lista(self):
        url = '/api/emails/enviar/'
        data = {
            "destinatarios": ["test1@test.com", "test2@test.com"],
            "asunto": "Prueba Multiple",
            "mensaje": "Mensaje de prueba"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("test1@test.com", mail.outbox[0].to)

    def test_enviar_email_fallido(self):
        url = '/api/emails/enviar/'
        data = {
            "asunto": "Prueba Sin Destinatario",
            "mensaje": "Mensaje de prueba"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(mail.outbox), 0)
