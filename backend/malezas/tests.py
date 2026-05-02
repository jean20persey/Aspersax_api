from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Maleza, InformacionTecnicaMaleza

User = get_user_model()

class MalezaModelTests(TestCase):
    def test_creacion_maleza_default_finca(self):
        """Verifica que al crear una maleza, por defecto la finca sea La Riverita"""
        maleza = Maleza.objects.create(
            nombre="Lote Test",
            nombre_cientifico="Rumex crispus",
            descripcion="Test"
        )
        self.assertEqual(maleza.finca, "Finca La Riverita")
        self.assertEqual(maleza.nombre_cientifico, "Rumex crispus")

class MalezaAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='admin_test',
            password='password123',
            email='admin@test.com'
        )
        self.client.force_authenticate(user=self.user)
        
        self.maleza = Maleza.objects.create(
            nombre="Lote Inicial",
            nombre_cientifico="Rumex crispus",
            descripcion="Creado en setUp"
        )

    def test_listar_malezas(self):
        url = reverse('maleza-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify pagination or list structure
        data = response.data.get('results', response.data) if isinstance(response.data, dict) else response.data
        self.assertGreaterEqual(len(data), 1)
        self.assertEqual(data[0]['nombre'], "Lote Inicial")

    def test_crear_maleza(self):
        url = reverse('maleza-list')
        data = {
            "nombre": "Lote Nuevo",
            "nombre_cientifico": "Rumex crispus",
            "descripcion": "Lote creado via API"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Maleza.objects.count(), 2)

    def test_detalle_informacion_tecnica(self):
        url = reverse('maleza-detalle', args=[self.maleza.id_maleza])
        # Primero probamos POST para crear la información técnica
        data_info = {
            "metodo_control": "Químico selectivo",
            "quimico_recomendado": "Glifosato",
            "nivel_peligro": "Alto"
        }
        response_post = self.client.post(url, data_info, format='json')
        self.assertEqual(response_post.status_code, status.HTTP_200_OK)
        
        # Luego probamos GET para obtenerla
        response_get = self.client.get(url)
        self.assertEqual(response_get.status_code, status.HTTP_200_OK)
        self.assertEqual(response_get.data['quimico_recomendado'], "Glifosato")
