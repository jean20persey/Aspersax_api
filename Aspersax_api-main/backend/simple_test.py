#!/usr/bin/env python
"""
Script simple para probar la conexión al dashboard
"""
import requests

def test_dashboard():
    print("🧪 Probando conexión al dashboard...")
    
    try:
        # Probar endpoint de prueba
        response = requests.get("http://127.0.0.1:8000/api/dashboard/test/")
        print(f"✅ Test endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"   Respuesta: {response.json()}")
        
        # Probar endpoint de estadísticas
        response = requests.get("http://127.0.0.1:8000/api/dashboard/enhanced-stats/")
        print(f"✅ Enhanced stats: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Robots: {data.get('total_robots', 0)}")
            print(f"   Tanques: {data.get('total_tanques', 0)}")
            print(f"   Malezas: {data.get('total_malezas', 0)}")
        
        # Probar endpoint de robots
        response = requests.get("http://127.0.0.1:8000/api/dashboard/stats/robots/")
        print(f"✅ Robots: {response.status_code}")
        if response.status_code == 200:
            robots = response.json()
            print(f"   Robots encontrados: {len(robots)}")
        
        # Probar endpoint de tanques
        response = requests.get("http://127.0.0.1:8000/api/dashboard/stats/tanks/")
        print(f"✅ Tanques: {response.status_code}")
        if response.status_code == 200:
            tanques = response.json()
            print(f"   Tanques encontrados: {len(tanques)}")
            
    except requests.exceptions.ConnectionError:
        print("❌ No se pudo conectar al servidor")
        print("   Asegúrate de que el servidor Django esté ejecutándose")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    test_dashboard()


