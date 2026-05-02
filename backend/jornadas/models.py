from django.db import models
from robots.models import Robot
from tanques.models import Tanque

class Jornada(models.Model):
    id_jornada = models.AutoField(primary_key=True, editable=False, db_column='T001IdJornada')
    finca = models.CharField(
        max_length=100,
        default='Finca La Riverita',
        editable=False,
        db_column='T001Finca',
        verbose_name='Finca'
    )
    fecha = models.DateField(db_column='T001Fecha')
    hora_inicio = models.TimeField(db_column='T001HoraInicio')
    hora_fin = models.TimeField(db_column='T001HoraFin')
    duracion = models.DurationField(db_column='T001Duracion')
    area_tratada = models.FloatField(
        db_column='T001AreaTratada',
        verbose_name='Área tratada en Finca La Riverita (ha)'
    )
    robot = models.ForeignKey(Robot, on_delete=models.CASCADE, db_column='T001Robot')
    tanque = models.ForeignKey(Tanque, on_delete=models.CASCADE, db_column='T001Tanque')
    activo = models.BooleanField(default=True, db_column='T001Activo')

    def __str__(self):
        return f"Jornada {self.fecha} — {self.finca} — Robot: {self.robot}"

    class Meta:
        db_table = 'T001Jornada'
        verbose_name = 'Jornada de Aspersión'
        verbose_name_plural = 'Jornadas de Aspersión'
        ordering = ['-fecha']