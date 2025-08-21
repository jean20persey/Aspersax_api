#!/usr/bin/env python
"""
Script completo para probar todos los endpoints del dashboard
"""
import requests
import json
from datetime import datetime, timedelta

BASE_URL = "http://127.0.0.1:8000"

def test_all_endpoints():
    print("🧪 Probando TODOS los endpoints del dashboard...")
    print("=" * 60)
    
    # Fechas para las pruebas
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)
    
    endpoints_to_test = [
        {
            "name": "Test de Conexión",
            "url": "/api/dashboard/test/",
            "params": {}
        },
        {
            "name": "Estadísticas Mejoradas",
            "url": "/api/dashboard/enhanced-stats/",
            "params": {
                'start_date': start_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d')
            }
        },
        {
            "name": "Datos de Actividad",
            "url": "/api/dashboard/stats/activity/",
            "params": {
                'start_date': start_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d')
            }
        },
        {
            "name": "Estadísticas de Robots",
            "url": "/api/dashboard/stats/robots/",
            "params": {}
        },
        {
            "name": "Estadísticas de Tanques",
            "url": "/api/dashboard/stats/tanks/",
            "params": {}
        },
        {
            "name": "Estadísticas de Malezas",
            "url": "/api/dashboard/stats/weeds/",
            "params": {}
        },
        {
            "name": "Datos en Tiempo Real",
            "url": "/api/dashboard/realtime/",
            "params": {}
        },
        {
            "name": "Métricas de Rendimiento",
            "url": "/api/dashboard/performance/",
            "params": {
                'start_date': start_date.strftime('%Y-%m-%d'),
                'end_date': end_date.strftime('%Y-%m-%d')
            }
        }
    ]
    
    results = {}
    
    for endpoint in endpoints_to_test:
        try:
            print(f"\n📡 Probando: {endpoint['name']}")
            print(f"   URL: {endpoint['url']}")
            
            url = f"{BASE_URL}{endpoint['url']}"
            response = requests.get(url, params=endpoint['params'])
            
            if response.status_code == 200:
                data = response.json()
                print(f"   ✅ Status: {response.status_code}")
                
                # Mostrar resumen de datos según el tipo
                if isinstance(data, dict):
                    if 'total_robots' in data:
                        print(f"   📊 Robots: {data.get('total_robots', 0)} total, {data.get('robots_activos', 0)} activos")
                        print(f"   📊 Tanques: {data.get('total_tanques', 0)} total, {data.get('tanques_en_uso', 0)} en uso")
                        print(f"   📊 Malezas: {data.get('total_malezas', 0)} total, {data.get('malezas_detectadas', 0)} detectadas")
                        print(f"   📊 Área: {data.get('area_cubierta', 0):.1f} m², Herbicida: {data.get('herbicida_usado', 0):.1f} L")
                        print(f"   📊 Eficiencia Robots: {data.get('eficiencia_robots', 0):.1f}%")
                        print(f"   📊 Eficiencia Tanques: {data.get('eficiencia_tanques', 0):.1f}%")
                        print(f"   📊 Eficiencia Herbicida: {data.get('eficiencia_herbicida', 0):.1f} m²/L")
                    elif 'message' in data:
                        print(f"   📊 Mensaje: {data['message']}")
                    else:
                        print(f"   📊 Claves: {list(data.keys())}")
                        
                elif isinstance(data, list):
                    print(f"   📊 Elementos: {len(data)}")
                    if data and isinstance(data[0], dict):
                        print(f"   📊 Primer elemento: {list(data[0].keys())}")
                        
                results[endpoint['name']] = {"status": "success", "data": data}
                
            else:
                print(f"   ❌ Status: {response.status_code}")
                print(f"   ❌ Error: {response.text}")
                results[endpoint['name']] = {"status": "error", "error": response.text}
                
        except requests.exceptions.ConnectionError:
            print(f"   ❌ No se pudo conectar")
            results[endpoint['name']] = {"status": "connection_error"}
        except Exception as e:
            print(f"   ❌ Error inesperado: {e}")
            results[endpoint['name']] = {"status": "exception", "error": str(e)}
    
    # Resumen final
    print("\n" + "=" * 60)
    print("📋 RESUMEN FINAL")
    print("=" * 60)
    
    successful = 0
    failed = 0
    
    for name, result in results.items():
        if result["status"] == "success":
            print(f"✅ {name}: EXITOSO")
            successful += 1
        else:
            print(f"❌ {name}: FALLÓ")
            failed += 1
    
    print(f"\n🎯 Total: {successful} exitosos, {failed} fallidos")
    
    if successful > 0:
        print("\n🎉 ¡El dashboard está funcionando correctamente!")
        print("🌐 Puedes acceder al frontend en: http://localhost:3000")
    else:
        print("\n⚠️ Hay problemas con los endpoints del dashboard")
        print("🔧 Verifica que el servidor Django esté ejecutándose")

if __name__ == '__main__':
    test_all_endpoints()



