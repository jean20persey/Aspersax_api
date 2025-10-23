from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Maleza

User = get_user_model()


class MalezaViewSetTests(APITestCase):
    def setUp(self):
        # Usuario y autenticación
        self.user = User.objects.create_user(
            username='testuser', password='testpass123', email='test@example.com'
        )
        self.client.force_authenticate(user=self.user)

        # Maleza inicial
        self.maleza = Maleza.objects.create(
            nombre='Maleza Test',
            nombre_cientifico='Testus malezus',
            tipo='Otra',
            descripcion='Descripción de prueba',
            temporada='Verano',
            resistencia_herbicida=False,
            activo=True,
        )

    def test_crear_maleza(self):
        url = reverse('maleza-list')
        data = {
            'nombre': 'Nueva Maleza',
            'nombre_cientifico': 'Novus malezus',
            'tipo': 'Hoja Ancha',
            'descripcion': 'Nueva descripción',
            'temporada': 'Invierno',
            'resistencia_herbicida': True,
            'activo': True,
        }
        resp = self.client.post(url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Maleza.objects.filter(activo=True).count(), 2)

    def test_listar_malezas(self):
        url = reverse('maleza-list')
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        items = resp.data.get('results', resp.data) if isinstance(resp.data, dict) else resp.data
        self.assertGreaterEqual(len(items), 1)

    def test_detalle_maleza(self):
        url = reverse('maleza-detail', args=[self.maleza.id_maleza])
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['nombre'], 'Maleza Test')

    def test_actualizar_maleza(self):
        url = reverse('maleza-detail', args=[self.maleza.id_maleza])
        data = {
            'nombre': 'Maleza Actualizada',
            'nombre_cientifico': 'Updatus malezus',
            'tipo': 'Hoja Angosta',
            'descripcion': 'Descripción actualizada',
            'temporada': 'Primavera',
            'resistencia_herbicida': False,
            'activo': True,
        }
        resp = self.client.put(url, data, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.maleza.refresh_from_db()
        self.assertEqual(self.maleza.nombre, 'Maleza Actualizada')

    def test_eliminar_maleza_soft_delete(self):
        url = reverse('maleza-detail', args=[self.maleza.id_maleza])
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.maleza.refresh_from_db()
        self.assertFalse(self.maleza.activo)

    def test_buscar_accion(self):
        url = reverse('maleza-buscar')
        resp = self.client.get(f"{url}?q=Test")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(any(item['id_maleza'] == self.maleza.id_maleza for item in resp.data))

    def test_por_tipo_accion(self):
        url = reverse('maleza-por-tipo')
        # Asegurar que existe una maleza de tipo Hoja Ancha
        Maleza.objects.create(nombre='Otra', tipo='Hoja Ancha', activo=True)
        resp = self.client.get(f"{url}?tipo=Hoja Ancha")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(all(item['tipo'] == 'Hoja Ancha' for item in resp.data))
