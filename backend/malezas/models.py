# malezas/models.py
from django.db import models
from jornadas.models import Jornada

class Maleza(models.Model):
    id_maleza = models.AutoField(primary_key=True, editable=False, db_column='T004IdMaleza')
    nombre_comun = models.CharField(max_length=100, db_column='T004NombreComun')
    nombre_cientifico = models.CharField(max_length=150, blank=True, null=True, db_column='T004NombreCientifico')
    descripcion = models.TextField(blank=True, null=True, db_column='T004Descripcion')
    activo = models.BooleanField(default=True, db_column='T004Activo')
    
    def __str__(self):
        return self.nombre_comun
    
    class Meta:
        db_table = 'T004Maleza'
        verbose_name = 'Maleza'
        verbose_name_plural = 'Malezas'

class MalezaDetectada(models.Model):
    id = models.AutoField(primary_key=True, editable=False, db_column='T005IdMalezaDetectada')
    jornada = models.ForeignKey(Jornada, on_delete=models.CASCADE, 
                              related_name='malezas_detectadas', db_column='T005IdJornada')
    maleza = models.ForeignKey(Maleza, on_delete=models.CASCADE, 
                             related_name='maleza_detectada', db_column='T005IdMaleza')
    ubicacion = models.CharField(max_length=200, db_column='T005Ubicacion')  # Ejemplo: "Sector A - Sur"
    densidad = models.CharField(max_length=50, db_column='T005Densidad')    # Ejemplo: "Alta", "Media", "Baja"
    activo = models.BooleanField(default=True, db_column='T005Activo')
    
    def __str__(self):
        return f"{self.maleza.nombre_comun} detectada en jornada {self.jornada.id_jornada}"
    
    class Meta:
        db_table = 'T005MalezaDetectada'
        verbose_name = 'Maleza Detectada'
        verbose_name_plural = 'Malezas Detectadas'