from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
import random
import string

class Usuariopropio(AbstractUser):
    ROLES = (
        ('admin', 'Administrador'),
        ('viewer', 'Visualizador'),
    )
    
    # Campos adicionales para el usuario
    telefono = models.CharField(max_length=15, blank=True, null=True)
    codigo_pais = models.CharField(max_length=5, default='CO', help_text='Código del país para el teléfono (ej: CO, US, MX)')
    direccion = models.TextField(blank=True, null=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    rol = models.CharField(max_length=10, choices=ROLES, default='viewer')
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        
    def __str__(self):
        return self.username
    
    def es_administrador(self):
        return self.rol == 'admin' or self.is_superuser
    
    def puede_modificar(self):
        return self.es_administrador()
    
    def puede_visualizar(self):
        return True  # Todos pueden visualizar

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

class SolicitudAdministrador(models.Model):
    usuario = models.ForeignKey(Usuariopropio, on_delete=models.CASCADE)
    codigo_verificacion = models.CharField(max_length=8)
    fecha_solicitud = models.DateTimeField(auto_now_add=True)
    verificado = models.BooleanField(default=False)
    fecha_expiracion = models.DateTimeField()
    motivo = models.TextField(blank=True, null=True)
    
    class Meta:
        verbose_name = 'Solicitud de Administrador'
        verbose_name_plural = 'Solicitudes de Administrador'
    
    def save(self, *args, **kwargs):
        if not self.codigo_verificacion:
            self.codigo_verificacion = self.generar_codigo()
        if not self.fecha_expiracion:
            # Expira en 24 horas
            self.fecha_expiracion = timezone.now() + timezone.timedelta(hours=24)
        super().save(*args, **kwargs)
    
    def generar_codigo(self):
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    
    def is_expired(self):
        return timezone.now() > self.fecha_expiracion
    
    def __str__(self):
        return f"Solicitud de {self.usuario.username} - Código: {self.codigo_verificacion}"