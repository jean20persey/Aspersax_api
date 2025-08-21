#!/usr/bin/env python
"""
Archivo de prueba simple para verificar las importaciones del proyecto
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aspersax_api.settings')

try:
    django.setup()
    print("✅ Django configurado correctamente")
    
    # Probar importaciones básicas
    from django.conf import settings
    print("✅ Django settings importado correctamente")
    
    print(f"✅ Base de datos: {settings.DATABASES['default']['ENGINE']}")
    print(f"✅ Aplicaciones instaladas: {len(settings.INSTALLED_APPS)}")
    print(f"✅ Usuario personalizado: {settings.AUTH_USER_MODEL}")
    
    print("\n🎉 Configuración básica funcionando!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
