from django.db import models
from robots.models import Robot
from tanques.models import Tanque
from malezas.models import Maleza
from datetime import timedelta
from django.utils import timezone

class Reporte(models.Model):
    TIPOS = [
        ('Jornada', 'Jornada'),
        ('Mantenimiento', 'Mantenimiento'),
        ('Incidente', 'Incidente'),
        ('Recarga', 'Recarga'),
    ]

    id_reporte = models.AutoField(primary_key=True, editable=False, db_column='T005IdReporte')
    fecha = models.DateTimeField(default=timezone.now, db_column='T005Fecha')
    tipo = models.CharField(max_length=50, choices=TIPOS, default='Jornada', db_column='T005Tipo')
    robot = models.ForeignKey(Robot, on_delete=models.CASCADE, null=True, db_column='T005IdRobot')
    tanque = models.ForeignKey(Tanque, on_delete=models.SET_NULL, null=True, blank=True, db_column='T005IdTanque')
    malezas_detectadas = models.ManyToManyField(Maleza, through='DetalleMaleza', db_column='T005MalezasDetectadas')
    area_cubierta = models.FloatField(default=0, db_column='T005AreaCubierta')  # en metros cuadrados
    herbicida_usado = models.FloatField(default=0, db_column='T005HerbicidaUsado')  # en litros
    duracion = models.DurationField(default=timedelta(minutes=0), db_column='T005Duracion')
    observaciones = models.TextField(blank=True, null=True, db_column='T005Observaciones')
    activo = models.BooleanField(default=True, db_column='T005Activo')

    def __str__(self):
        return f"Reporte {self.tipo} - Robot {self.robot.nombre if self.robot else 'Sin robot'} - {self.fecha.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        db_table = 'T005Reporte'
        verbose_name = 'Reporte'
        verbose_name_plural = 'Reportes'

class DetalleMaleza(models.Model):
    id_detalle = models.AutoField(primary_key=True, editable=False, db_column='T006IdDetalle')
    reporte = models.ForeignKey(Reporte, on_delete=models.CASCADE, db_column='T006IdReporte')
    maleza = models.ForeignKey(Maleza, on_delete=models.CASCADE, db_column='T006IdMaleza')
    cantidad = models.IntegerField(default=1, db_column='T006Cantidad')
    ubicacion = models.CharField(max_length=200, blank=True, null=True, db_column='T006Ubicacion')
    herbicida_aplicado = models.FloatField(default=0, db_column='T006HerbicidaAplicado')  # en ml
    efectividad = models.IntegerField(default=0, db_column='T006Efectividad')  # porcentaje 0-100
    
    def __str__(self):
        return f"{self.maleza.nombre} en {self.reporte}"

    class Meta:
        db_table = 'T006DetalleMaleza'
        verbose_name = 'Detalle de Maleza'
        verbose_name_plural = 'Detalles de Malezas'