#!/usr/bin/env python
"""
Script para probar los endpoints del dashboard
"""
import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://127.0.0.1:8000"

def test_dashboard_endpoints():
    print("🧪 Probando endpoints del dashboard...")
    
    # Endpoints a probar
    endpoints = [
        "/api/dashboard/enhanced-stats/",
        "/api/dashboard/stats/activity/",
        "/api/dashboard/stats/robots/",
        "/api/dashboard/stats/tanks/",
        "/api/dashboard/stats/weeds/",
    ]
    
    # Fechas para las pruebas
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)
    
    for endpoint in endpoints:
        try:
            url = f"{BASE_URL}{endpoint}"
            
            # Agregar parámetros de fecha si es necesario
            params = {}
            if "enhanced-stats" in endpoint or "activity" in endpoint:
                params = {
                    'start_date': start_date.strftime('%Y-%m-%d'),
                    'end_date': end_date.strftime('%Y-%m-%d')
                }
            
            print(f"\n📡 Probando: {endpoint}")
            response = requests.get(url, params=params)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Status: {response.status_code}")
                print(f"📊 Datos recibidos: {len(str(data))} caracteres")
                
                # Mostrar un resumen de los datos
                if isinstance(data, dict):
                    print(f"   Claves: {list(data.keys())}")
                elif isinstance(data, list):
                    print(f"   Elementos: {len(data)}")
                    
            else:
                print(f"❌ Status: {response.status_code}")
                print(f"❌ Error: {response.text}")
                
        except requests.exceptions.ConnectionError:
            print(f"❌ No se pudo conectar a {endpoint}")
            print("   Asegúrate de que el servidor Django esté ejecutándose en http://127.0.0.1:8000")
        except Exception as e:
            print(f"❌ Error inesperado: {e}")

if __name__ == '__main__':
    test_dashboard_endpoints()

