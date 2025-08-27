from django.db import models
from robots.models import Robot
from tanques.models import Tanque

class Jornada(models.Model):
    id_jornada = models.AutoField(primary_key=True, editable=False, db_column='T001IdJornada')
    fecha = models.DateField(db_column='T001Fecha')
    hora_inicio = models.TimeField(db_column='T001HoraInicio')
    hora_fin = models.TimeField(db_column='T001HoraFin')
    duracion = models.DurationField(db_column='T001Duracion')
    area_tratada = models.FloatField(db_column='T001AreaTratada')
    robot = models.ForeignKey(Robot, on_delete=models.CASCADE, db_column='T001Robot')
    tanque = models.ForeignKey(Tanque, on_delete=models.CASCADE, db_column='T001Tanque')
    activo = models.BooleanField(default=True, db_column='T001Activo')
    
    def __str__(self):
        return f"{self.fecha} - Robot: {self.robot}"
    
    class Meta:
        db_table = 'T001Jornada'
        verbose_name = 'Jornada'
        verbose_name_plural = 'Jornadas'