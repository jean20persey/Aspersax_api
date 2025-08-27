from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import random
import string

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

class CodigoRecuperacion(models.Model):
    usuario = models.ForeignKey(Usuariopropio, on_delete=models.CASCADE)
    codigo = models.CharField(max_length=6)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    usado = models.BooleanField(default=False)
    fecha_expiracion = models.DateTimeField()
    
    class Meta:
        verbose_name = 'Código de Recuperación'
        verbose_name_plural = 'Códigos de Recuperación'
    
    def save(self, *args, **kwargs):
        if not self.codigo:
            self.codigo = self.generar_codigo()
        if not self.fecha_expiracion:
            # Expira en 10 minutos
            self.fecha_expiracion = timezone.now() + timezone.timedelta(minutes=10)
        super().save(*args, **kwargs)
    
    def generar_codigo(self):
        return ''.join(random.choices(string.digits, k=6))
    
    def is_expired(self):
        return timezone.now() > self.fecha_expiracion
    
    def __str__(self):
        return f"Código {self.codigo} para {self.usuario.email}" 