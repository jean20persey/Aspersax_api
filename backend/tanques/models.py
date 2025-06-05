from django.db import models

class Tanque(models.Model):
    ESTADOS = [
        ('Lleno', 'Lleno'),
        ('Medio', 'Medio'),
        ('Bajo', 'Bajo'),
        ('Vacío', 'Vacío'),
    ]

    id_tanque = models.AutoField(primary_key=True, editable=False, db_column='T003IdTanque')
    nombre = models.CharField(max_length=100, default="Tanque sin nombre", db_column='T003Nombre')
    capacidad = models.FloatField(default=0, db_column='T003Capacidad')  # en litros
    nivel_actual = models.FloatField(default=0, db_column='T003NivelActual')  # en litros
    estado = models.CharField(max_length=50, choices=ESTADOS, default='Vacío', db_column='T003Estado')
    ultima_recarga = models.DateTimeField(auto_now=True, db_column='T003UltimaRecarga')
    activo = models.BooleanField(default=True, db_column='T003Activo')
    
    def __str__(self):
        return f"{self.nombre} ({self.estado})"
    
    class Meta:
        db_table = 'T003Tanque'
        verbose_name = 'Tanque'
        verbose_name_plural = 'Tanques'