from django.db import models

class Robot(models.Model):
    ESTADOS = [
        ('Disponible', 'Disponible'),
        ('En Mantenimiento', 'En Mantenimiento'),
        ('En Operación', 'En Operación'),
        ('Fuera de Servicio', 'Fuera de Servicio'),
    ]

    id_robot = models.AutoField(primary_key=True, editable=False, db_column='T002IdRobot')
    finca = models.CharField(
        max_length=100,
        default='Finca La Riverita',
        editable=False,
        db_column='T002Finca',
        verbose_name='Finca asignada'
    )
    nombre = models.CharField(
        max_length=100,
        default='ASPERSAX-01',
        db_column='T002Nombre',
        verbose_name='Nombre del robot aspersor'
    )
    estado = models.CharField(max_length=50, choices=ESTADOS, default='Disponible', db_column='T002Estado')
    bateria = models.IntegerField(default=100, db_column='T002Bateria')
    ultima_actividad = models.DateTimeField(auto_now=True, db_column='T002UltimaActividad')
    activo = models.BooleanField(default=True, db_column='T002Activo')

    def __str__(self):
        return f"{self.nombre} — {self.finca} ({self.estado})"

    class Meta:
        db_table = 'T002Robot'
        verbose_name = 'Robot Aspersor'
        verbose_name_plural = 'Robots Aspersores'
        ordering = ['nombre']
