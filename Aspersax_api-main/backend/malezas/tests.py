from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Maleza, MalezaDetectada
<<<<<<< HEAD
from jornadas.models import Jornada
from robots.models import Robot
from tanques.models import Tanque
from datetime import datetime, timedelta, date, time
from decimal import Decimal
=======
from robots.models import Robot
from tanques.models import Tanque
from jornadas.models import Jornada
from decimal import Decimal
from datetime import date, time, timedelta
>>>>>>> 30311b5 (Primer commit: API Aspersax)

User = get_user_model()

class MalezaTests(APITestCase):
    def setUp(self):
        # Crear usuario de prueba
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        
        # Crear una maleza de prueba
        self.maleza = Maleza.objects.create(
<<<<<<< HEAD
            nombre_comun='Maleza Test',
            nombre_cientifico='Testus malezus',
            descripcion='Descripción de prueba',
=======
            nombre='Maleza Test',
            nombre_cientifico='Testus malezus',
            tipo='Hoja Ancha',
            descripcion='Descripción de prueba',
            temporada='Verano',
            resistencia_herbicida=False,
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            activo=True
        )
        
        # Autenticar el cliente
        self.client.force_authenticate(user=self.user)

    def test_crear_maleza(self):
        """Prueba la creación de una nueva maleza"""
        url = reverse('malezas:maleza_create')
        data = {
<<<<<<< HEAD
            'nombre_comun': 'Nueva Maleza',
            'nombre_cientifico': 'Novus malezus',
            'descripcion': 'Nueva descripción',
=======
            'nombre': 'Nueva Maleza',
            'nombre_cientifico': 'Novus malezus',
            'tipo': 'Gramínea',
            'descripcion': 'Nueva descripción',
            'temporada': 'Invierno',
            'resistencia_herbicida': True,
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            'activo': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Maleza.objects.count(), 2)
<<<<<<< HEAD
        self.assertEqual(Maleza.objects.get(nombre_comun='Nueva Maleza').nombre_cientifico, 'Novus malezus')
=======
        self.assertEqual(Maleza.objects.get(nombre='Nueva Maleza').nombre_cientifico, 'Novus malezus')
>>>>>>> 30311b5 (Primer commit: API Aspersax)

    def test_listar_malezas(self):
        """Prueba obtener la lista de malezas"""
        url = reverse('malezas:maleza_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_detalle_maleza(self):
        """Prueba obtener los detalles de una maleza específica"""
        url = reverse('malezas:maleza_detail', args=[self.maleza.id_maleza])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
<<<<<<< HEAD
        self.assertEqual(response.data['nombre_comun'], 'Maleza Test')
=======
        self.assertEqual(response.data['nombre'], 'Maleza Test')
>>>>>>> 30311b5 (Primer commit: API Aspersax)

    def test_actualizar_maleza(self):
        """Prueba actualizar una maleza existente"""
        url = reverse('malezas:maleza_update', args=[self.maleza.id_maleza])
        data = {
<<<<<<< HEAD
            'nombre_comun': 'Maleza Actualizada',
            'nombre_cientifico': 'Updatus malezus',
            'descripcion': 'Descripción actualizada',
=======
            'nombre': 'Maleza Actualizada',
            'nombre_cientifico': 'Updatus malezus',
            'tipo': 'Hoja Angosta',
            'descripcion': 'Descripción actualizada',
            'temporada': 'Otoño',
            'resistencia_herbicida': True,
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            'activo': True
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
<<<<<<< HEAD
        self.assertEqual(Maleza.objects.get(id_maleza=self.maleza.id_maleza).nombre_comun, 'Maleza Actualizada')
=======
        self.assertEqual(Maleza.objects.get(id_maleza=self.maleza.id_maleza).nombre, 'Maleza Actualizada')
>>>>>>> 30311b5 (Primer commit: API Aspersax)

    def test_eliminar_maleza(self):
        """Prueba eliminar una maleza"""
        url = reverse('malezas:maleza_delete', args=[self.maleza.id_maleza])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Maleza.objects.count(), 0)

    def test_buscar_maleza_por_nombre(self):
        """Prueba buscar malezas por nombre"""
        url = reverse('malezas:maleza_by_nombre', args=['Test'])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
<<<<<<< HEAD
        self.assertEqual(response.data[0]['nombre_comun'], 'Maleza Test')
=======
        self.assertEqual(response.data[0]['nombre'], 'Maleza Test')
>>>>>>> 30311b5 (Primer commit: API Aspersax)

class MalezaDetectadaTests(APITestCase):
    def setUp(self):
        # Crear usuario de prueba
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            email='test@example.com'
        )
        
        # Crear una maleza de prueba
        self.maleza = Maleza.objects.create(
<<<<<<< HEAD
            nombre_comun='Maleza Test',
            nombre_cientifico='Testus malezus',
            descripcion='Descripción de prueba',
=======
            nombre='Maleza Test',
            nombre_cientifico='Testus malezus',
            tipo='Hoja Ancha',
            descripcion='Descripción de prueba',
            temporada='Verano',
            resistencia_herbicida=False,
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            activo=True
        )
        
        # Crear robot y tanque de prueba
        self.robot = Robot.objects.create(
<<<<<<< HEAD
            modelo='Modelo Test',
            estado='Activo',
=======
            nombre='Robot Test',
            estado='Disponible',
            bateria=100,
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            activo=True
        )
        
        self.tanque = Tanque.objects.create(
<<<<<<< HEAD
            capacidad=Decimal('100.0'),
            tipo='Principal',
            estado='Operativo',
            activo=True
        )
        
        # Crear una jornada de prueba
        self.jornada = Jornada.objects.create(
            robot=self.robot,
            tanque=self.tanque,
            fecha=date.today(),
            hora_inicio=time(8, 0),
            hora_fin=time(10, 0),
            duracion=timedelta(hours=2),
            area_tratada=100.0,
            activo=True
        )
        
        # Crear una maleza detectada de prueba
        self.maleza_detectada = MalezaDetectada.objects.create(
            jornada=self.jornada,
            maleza=self.maleza,
            ubicacion='Sector A',
=======
            nombre='Tanque Test',
            capacidad=100.0,
            nivel_actual=50.0,
            estado='Medio',
            activo=True
        )
        
        # Crear jornada de prueba
        self.jornada = Jornada.objects.create(
            fecha=date.today(),
            hora_inicio=time(8, 0),
            hora_fin=time(17, 0),
            duracion=timedelta(hours=9),
            area_tratada=100.0,
            robot=self.robot,
            tanque=self.tanque,
            activo=True
        )
        
        # Crear maleza detectada de prueba
        self.maleza_detectada = MalezaDetectada.objects.create(
            jornada=self.jornada,
            maleza=self.maleza,
            ubicacion='Sector A - Norte',
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            densidad='Alta',
            activo=True
        )
        
        # Autenticar el cliente
        self.client.force_authenticate(user=self.user)

    def test_crear_maleza_detectada(self):
        """Prueba la creación de una nueva maleza detectada"""
        url = reverse('malezas:maleza_detectada_create')
        data = {
            'jornada': self.jornada.id_jornada,
            'maleza': self.maleza.id_maleza,
<<<<<<< HEAD
            'ubicacion': 'Sector B',
=======
            'ubicacion': 'Sector B - Sur',
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            'densidad': 'Media',
            'activo': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(MalezaDetectada.objects.count(), 2)

    def test_listar_malezas_detectadas(self):
        """Prueba obtener la lista de malezas detectadas"""
        url = reverse('malezas:maleza_detectada_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_detalle_maleza_detectada(self):
        """Prueba obtener los detalles de una maleza detectada específica"""
        url = reverse('malezas:maleza_detectada_detail', args=[self.maleza_detectada.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
<<<<<<< HEAD
        self.assertEqual(response.data['ubicacion'], 'Sector A')
=======
        self.assertEqual(response.data['ubicacion'], 'Sector A - Norte')
>>>>>>> 30311b5 (Primer commit: API Aspersax)

    def test_actualizar_maleza_detectada(self):
        """Prueba actualizar una maleza detectada existente"""
        url = reverse('malezas:maleza_detectada_update', args=[self.maleza_detectada.id])
        data = {
            'jornada': self.jornada.id_jornada,
            'maleza': self.maleza.id_maleza,
<<<<<<< HEAD
            'ubicacion': 'Sector C',
=======
            'ubicacion': 'Sector A - Sur',
>>>>>>> 30311b5 (Primer commit: API Aspersax)
            'densidad': 'Baja',
            'activo': True
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
<<<<<<< HEAD
        self.assertEqual(MalezaDetectada.objects.get(id=self.maleza_detectada.id).ubicacion, 'Sector C')
=======
        self.assertEqual(MalezaDetectada.objects.get(id=self.maleza_detectada.id).densidad, 'Baja')
>>>>>>> 30311b5 (Primer commit: API Aspersax)

    def test_eliminar_maleza_detectada(self):
        """Prueba eliminar una maleza detectada"""
        url = reverse('malezas:maleza_detectada_delete', args=[self.maleza_detectada.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(MalezaDetectada.objects.count(), 0)

    def test_malezas_detectadas_por_jornada(self):
        """Prueba obtener las malezas detectadas de una jornada específica"""
<<<<<<< HEAD
        url = reverse('malezas:maleza_detectada_by_jornada', args=[self.jornada.id_jornada])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['ubicacion'], 'Sector A')
=======
        url = reverse('malezas:malezas_por_jornada', args=[self.jornada.id_jornada])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['maleza'], self.maleza.id_maleza)
>>>>>>> 30311b5 (Primer commit: API Aspersax)
