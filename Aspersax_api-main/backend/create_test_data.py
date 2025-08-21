#!/usr/bin/env python
"""
Script para crear datos de prueba para el dashboard
"""
import os
import sys
import django
from datetime import timedelta, datetime
from django.utils import timezone

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aspersax.settings')
django.setup()

from robots.models import Robot
from tanques.models import Tanque
from malezas.models import Maleza
from reportes.models import Reporte, DetalleMaleza
import random

def create_test_data():
    print("Creando datos de prueba para el dashboard...")
    
    # Crear robots si no existen
    if Robot.objects.count() == 0:
        robots_data = [
            {"nombre": "RoboFumigator 1000", "estado": "En Operación", "bateria": 85},
            {"nombre": "AgroBot X2", "estado": "Disponible", "bateria": 95},
            {"nombre": "SprayMaster Pro", "estado": "En Mantenimiento", "bateria": 45},
            {"nombre": "WeedHunter Elite", "estado": "En Operación", "bateria": 72},
            {"nombre": "CropGuardian 2000", "estado": "Disponible", "bateria": 100},
        ]
        
        for robot_data in robots_data:
            Robot.objects.create(**robot_data)
        print(f"✅ Creados {len(robots_data)} robots")
    
    # Crear tanques si no existen
    if Tanque.objects.count() == 0:
        tanques_data = [
            {"nombre": "Tanque Principal", "capacidad": 1000, "nivel_actual": 850, "estado": "Lleno"},
            {"nombre": "Tanque Auxiliar 1", "capacidad": 500, "nivel_actual": 200, "estado": "Medio"},
            {"nombre": "Tanque Reserva", "capacidad": 750, "nivel_actual": 100, "estado": "Bajo"},
            {"nombre": "Tanque Emergencia", "capacidad": 300, "nivel_actual": 300, "estado": "Lleno"},
            {"nombre": "Tanque Especial", "capacidad": 1200, "nivel_actual": 0, "estado": "Vacío"},
        ]
        
        for tanque_data in tanques_data:
            Tanque.objects.create(**tanque_data)
        print(f"✅ Creados {len(tanques_data)} tanques")
    
    # Crear malezas si no existen
    if Maleza.objects.count() == 0:
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
        
        for maleza_data in malezas_data:
            Maleza.objects.create(**maleza_data)
        print(f"✅ Creadas {len(malezas_data)} malezas")
    
    # Crear reportes de los últimos 7 días
    robots = list(Robot.objects.filter(activo=True))
    tanques = list(Tanque.objects.filter(activo=True))
    malezas = list(Maleza.objects.filter(activo=True))
    
    if robots and tanques and malezas:
        # Crear reportes de los últimos 7 días
        for i in range(7):
            fecha = timezone.now().date() - timedelta(days=i)
            
            # Crear 1-3 reportes por día
            for _ in range(random.randint(1, 3)):
                robot = random.choice(robots)
                tanque = random.choice(tanques)
                
                reporte = Reporte.objects.create(
                    fecha=fecha,
                    tipo='Jornada',
                    robot=robot,
                    tanque=tanque,
                    area_cubierta=random.uniform(50, 200),
                    herbicida_usado=random.uniform(5, 25),
                    duracion=timedelta(hours=random.randint(1, 4)),
                    observaciones=f"Jornada de fumigación en {fecha}",
                    activo=True
                )
                
                # Crear detalles de malezas para este reporte
                num_malezas = random.randint(1, 3)
                malezas_seleccionadas = random.sample(malezas, min(num_malezas, len(malezas)))
                
                for maleza in malezas_seleccionadas:
                    DetalleMaleza.objects.create(
                        reporte=reporte,
                        maleza=maleza,
                        cantidad=random.randint(1, 10),
                        ubicacion=f"Zona {random.randint(1, 5)}",
                        herbicida_aplicado=random.uniform(10, 50),
                        efectividad=random.randint(70, 95)
                    )
        
        print("✅ Creados reportes de los últimos 7 días")
    
    print("\n🎉 Datos de prueba creados exitosamente!")
    print(f"📊 Robots: {Robot.objects.count()}")
    print(f"📊 Tanques: {Tanque.objects.count()}")
    print(f"📊 Malezas: {Maleza.objects.count()}")
    print(f"📊 Reportes: {Reporte.objects.count()}")
    print(f"📊 Detalles de Malezas: {DetalleMaleza.objects.count()}")

if __name__ == '__main__':
    create_test_data()
