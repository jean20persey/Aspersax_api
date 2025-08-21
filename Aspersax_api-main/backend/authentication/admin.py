from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuariopropio

<<<<<<< HEAD
admin.site.register(Usuariopropio, UserAdmin) 
=======
@admin.register(Usuariopropio)
class UsuarioPropioAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'telefono', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'groups')
    fieldsets = UserAdmin.fieldsets + (
        ('Información adicional', {'fields': ('telefono', 'direccion', 'fecha_creacion')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información adicional', {'fields': ('telefono', 'direccion')}),
    )
    readonly_fields = ('fecha_creacion',) 
>>>>>>> 30311b5 (Primer commit: API Aspersax)
