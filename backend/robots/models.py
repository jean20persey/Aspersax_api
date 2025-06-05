from django.db import models

class Robot(models.Model):
    ESTADOS = [
        ('Disponible', 'Disponible'),
        ('En Mantenimiento', 'En Mantenimiento'),
        ('En Operación', 'En Operación'),
        ('Fuera de Servicio', 'Fuera de Servicio'),
    ]

    id_robot = models.AutoField(primary_key=True, editable=False, db_column='T002IdRobot')
    nombre = models.CharField(max_length=100, default="Robot sin nombre", db_column='T002Nombre')  # ✅ default agregado
    estado = models.CharField(max_length=50, choices=ESTADOS, default='Disponible', db_column='T002Estado')
    bateria = models.IntegerField(default=100, db_column='T002Bateria')
    ultima_actividad = models.DateTimeField(auto_now=True, db_column='T002UltimaActividad')
    activo = models.BooleanField(default=True, db_column='T002Activo')
    
    def __str__(self):
        return f"{self.nombre} ({self.estado})"
    
    class Meta:
        db_table = 'T002Robot'
        verbose_name = 'Robot'
        verbose_name_plural = 'Robots'
