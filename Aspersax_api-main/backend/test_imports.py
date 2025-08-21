#!/usr/bin/env python
"""
Archivo de prueba para verificar las importaciones del proyecto
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aspersax_api.settings')
django.setup()

def test_imports():
    """Prueba todas las importaciones importantes"""
    try:
        print("✅ Probando importaciones...")
        
        # Probar importaciones de Django
        from django.conf import settings
        print("✅ Django settings importado correctamente")
        
        # Probar importaciones de aplicaciones
        from robots.models import Robot
        print("✅ Modelo Robot importado correctamente")
        
        from tanques.models import Tanque
        print("✅ Modelo Tanque importado correctamente")
        
        from malezas.models import Maleza
        print("✅ Modelo Maleza importado correctamente")
        
        from reportes.models import Reporte
        print("✅ Modelo Reporte importado correctamente")
        
        from jornadas.models import Jornada
        print("✅ Modelo Jornada importado correctamente")
        
        from authentication.models import Usuariopropio
        print("✅ Modelo Usuariopropio importado correctamente")
        
        # Probar configuración
        print(f"✅ Base de datos: {settings.DATABASES['default']['ENGINE']}")
        print(f"✅ Aplicaciones instaladas: {len(settings.INSTALLED_APPS)}")
        print(f"✅ Usuario personalizado: {settings.AUTH_USER_MODEL}")
        
        print("\n🎉 Todas las importaciones funcionan correctamente!")
        return True
        
    except Exception as e:
        print(f"❌ Error en importación: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    test_imports()
