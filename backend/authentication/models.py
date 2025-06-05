from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuariopropio(AbstractUser):
    # Campos adicionales para el usuario
    telefono = models.CharField(max_length=15, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        
    def __str__(self):
        return self.username 