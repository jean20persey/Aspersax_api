#!/usr/bin/env python
"""
Script para probar la gestión de datos (editar y eliminar)
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_data_management():
    print("🧪 Probando gestión de datos...")
    print("=" * 50)
    
    # Probar obtener robots
    print("\n📡 Obteniendo robots...")
    try:
        response = requests.get(f"{BASE_URL}/api/robots/")
        if response.status_code == 200:
            robots = response.json()
            print(f"✅ Robots encontrados: {len(robots)}")
            if robots:
                robot = robots[0]
                print(f"   - Robot: {robot['nombre']} (ID: {robot['id_robot']})")
                
                # Probar editar robot
                print(f"\n📝 Editando robot {robot['id_robot']}...")
                update_data = {
                    'nombre': f"{robot['nombre']} (Editado)",
                    'estado': 'En Mantenimiento',
                    'bateria': 75
                }
                
                update_response = requests.put(
                    f"{BASE_URL}/api/robots/{robot['id_robot']}/actualizar/",
                    json=update_data,
                    headers={'Content-Type': 'application/json'}
                )
                
                if update_response.status_code == 200:
                    print("✅ Robot actualizado correctamente")
                else:
                    print(f"❌ Error al actualizar: {update_response.status_code}")
                    print(f"   Respuesta: {update_response.text}")
        else:
            print(f"❌ Error al obtener robots: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Probar obtener tanques
    print("\n📡 Obteniendo tanques...")
    try:
        response = requests.get(f"{BASE_URL}/api/tanques/tanques/")
        if response.status_code == 200:
            tanques = response.json()
            print(f"✅ Tanques encontrados: {len(tanques)}")
            if tanques:
                tanque = tanques[0]
                print(f"   - Tanque: {tanque['nombre']} (ID: {tanque['id_tanque']})")
        else:
            print(f"❌ Error al obtener tanques: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Probar obtener malezas
    print("\n📡 Obteniendo malezas...")
    try:
        response = requests.get(f"{BASE_URL}/api/malezas/malezas/")
        if response.status_code == 200:
            malezas = response.json()
            print(f"✅ Malezas encontradas: {len(malezas)}")
            if malezas:
                maleza = malezas[0]
                print(f"   - Maleza: {maleza['nombre']} (ID: {maleza['id_maleza']})")
        else:
            print(f"❌ Error al obtener malezas: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n🎯 Pruebas completadas")

if __name__ == '__main__':
    test_data_management()

