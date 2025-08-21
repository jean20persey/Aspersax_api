#!/usr/bin/env python
"""
Script para verificar los datos existentes en la base de datos
"""
import os
import django
from django.utils import timezone

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aspersax.settings')
django.setup()

from robots.models import Robot
from tanques.models import Tanque
from malezas.models import Maleza
from reportes.models import Reporte, DetalleMaleza

def check_data():
    print("🔍 Verificando datos en la base de datos...")
    
    # Verificar robots
    robots = Robot.objects.all()
    print(f"\n🤖 Robots ({robots.count()}):")
    for robot in robots:
        print(f"   - {robot.nombre}: {robot.estado}, Batería: {robot.bateria}%")
    
    # Verificar tanques
    tanques = Tanque.objects.all()
    print(f"\n🛢️ Tanques ({tanques.count()}):")
    for tanque in tanques:
        print(f"   - {tanque.nombre}: {tanque.nivel_actual}L/{tanque.capacidad}L ({tanque.estado})")
    
    # Verificar malezas
    malezas = Maleza.objects.all()
    print(f"\n🌿 Malezas ({malezas.count()}):")
    for maleza in malezas:
        print(f"   - {maleza.nombre} ({maleza.tipo})")
    
    # Verificar reportes
    reportes = Reporte.objects.all()
    print(f"\n📊 Reportes ({reportes.count()}):")
    for reporte in reportes[:5]:  # Mostrar solo los primeros 5
        print(f"   - {reporte.fecha}: {reporte.tipo}, Área: {reporte.area_cubierta}m², Herbicida: {reporte.herbicida_usado}L")
    
    # Verificar detalles de malezas
    detalles = DetalleMaleza.objects.all()
    print(f"\n🌱 Detalles de Malezas ({detalles.count()}):")
    for detalle in detalles[:5]:  # Mostrar solo los primeros 5
        print(f"   - {detalle.maleza.nombre}: {detalle.cantidad} unidades en {detalle.ubicacion}")
    
    print(f"\n✅ Resumen:")
    print(f"   Robots: {robots.count()}")
    print(f"   Tanques: {tanques.count()}")
    print(f"   Malezas: {malezas.count()}")
    print(f"   Reportes: {reportes.count()}")
    print(f"   Detalles: {detalles.count()}")

if __name__ == '__main__':
    check_data()

