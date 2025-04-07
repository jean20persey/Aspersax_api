from django.db import models
from jornadas.models import Jornada

class Reporte(models.Model):
    id_reporte = models.AutoField(primary_key=True, editable=False, db_column='T006IdReporte')
    jornada = models.OneToOneField(Jornada, on_delete=models.CASCADE, 
                                  related_name='reporte', db_column='T006IdJornada')
    fecha_creacion = models.DateTimeField(auto_now_add=True, db_column='T006FechaCreacion')
    resumen = models.TextField(blank=True, db_column='T006Resumen')
    activo = models.BooleanField(default=True, db_column='T006Activo')
    
    def __str__(self):
        return f"Reporte de Jornada {self.jornada.id_jornada}"
    
    class Meta:
        db_table = 'T006Reporte'
        verbose_name = 'Reporte'
        verbose_name_plural = 'Reportes'