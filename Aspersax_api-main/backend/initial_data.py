from django.utils import timezone
from datetime import timedelta, datetime, time
from robots.models import Robot
from tanques.models import Tanque
from malezas.models import Maleza, MalezaDetectada
from jornadas.models import Jornada
import random

def create_initial_data():
    # Crear robots
    robots_data = [
        {"nombre": "RoboFumigator 1000", "estado": "Disponible", "bateria": 95},
        {"nombre": "AgroBot X2", "estado": "En Operación", "bateria": 75},
        {"nombre": "SprayMaster Pro", "estado": "Disponible", "bateria": 100},
        {"nombre": "WeedHunter Elite", "estado": "En Mantenimiento", "bateria": 45},
        {"nombre": "CropGuardian 2000", "estado": "En Operación", "bateria": 85}
    ]
    
    robots = []
    for robot_data in robots_data:
        robot = Robot.objects.create(**robot_data)
        robots.append(robot)
    
    # Crear tanques
    tanques_data = [
        {"nombre": "Tanque Principal", "capacidad": 1000, "nivel_actual": 850, "estado": "Lleno"},
        {"nombre": "Tanque Auxiliar 1", "capacidad": 500, "nivel_actual": 200, "estado": "Medio"},
        {"nombre": "Tanque Reserva", "capacidad": 750, "nivel_actual": 100, "estado": "Bajo"},
        {"nombre": "Tanque Emergencia", "capacidad": 300, "nivel_actual": 300, "estado": "Lleno"},
        {"nombre": "Tanque Especial", "capacidad": 1200, "nivel_actual": 0, "estado": "Vacío"}
    ]
    
    tanques = []
    for tanque_data in tanques_data:
        tanque = Tanque.objects.create(**tanque_data)
        tanques.append(tanque)
    
    # Crear malezas
    malezas_data = [
        {
            "nombre": "Diente de León",
            "nombre_cientifico": "Taraxacum officinale",
            "tipo": "Hoja Ancha",
            "descripcion": "Planta perenne común en campos",
            "temporada": "Primavera-Verano",
            "resistencia_herbicida": False
        },
        {
            "nombre": "Pasto Johnson",
            "nombre_cientifico": "Sorghum halepense",
            "tipo": "Gramínea",
            "descripcion": "Gramínea invasiva de rápido crecimiento",
            "temporada": "Verano",
            "resistencia_herbicida": True
        },
        {
            "nombre": "Cardo",
            "nombre_cientifico": "Cirsium vulgare",
            "tipo": "Hoja Ancha",
            "descripcion": "Maleza espinosa de gran tamaño",
            "temporada": "Todo el año",
            "resistencia_herbicida": False
        },
        {
            "nombre": "Cola de Zorro",
            "nombre_cientifico": "Setaria",
            "tipo": "Gramínea",
            "descripcion": "Gramínea anual común",
            "temporada": "Verano-Otoño",
            "resistencia_herbicida": False
        },
        {
            "nombre": "Ortiga",
            "nombre_cientifico": "Urtica dioica",
            "tipo": "Hoja Ancha",
            "descripcion": "Planta urticante perenne",
            "temporada": "Primavera-Verano",
            "resistencia_herbicida": False
        }
    ]
    
    malezas = []
    for maleza_data in malezas_data:
        maleza = Maleza.objects.create(**maleza_data)
        malezas.append(maleza)
    
    # Crear jornadas de los últimos 7 días
    for i in range(7):
        fecha = timezone.now().date() - timedelta(days=i)
        for _ in range(random.randint(1, 3)):  # 1-3 jornadas por día
            hora_inicio = time(
                hour=random.randint(6, 16),
                minute=random.randint(0, 59)
            )
            duracion = timedelta(hours=random.randint(1, 4))
            hora_fin = (datetime.combine(fecha, hora_inicio) + duracion).time()
            
            jornada = Jornada.objects.create(
                fecha=fecha,
                hora_inicio=hora_inicio,
                hora_fin=hora_fin,
                duracion=duracion,
                area_tratada=random.uniform(100, 500),
                robot=random.choice(robots),
                tanque=random.choice(tanques)
            )
            
            # Crear detecciones de malezas para cada jornada
            num_detecciones = random.randint(1, 4)
            for _ in range(num_detecciones):
                MalezaDetectada.objects.create(
                    jornada=jornada,
                    maleza=random.choice(malezas),
                    ubicacion=f"Sector {random.choice(['A', 'B', 'C', 'D'])} - {random.choice(['Norte', 'Sur', 'Este', 'Oeste'])}",
                    densidad=random.choice(['Alta', 'Media', 'Baja'])
                )

if __name__ == "__main__":
    create_initial_data() 