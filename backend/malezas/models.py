# malezas/models.py
from django.db import models
from jornadas.models import Jornada

class Maleza(models.Model):
    id_maleza = models.AutoField(primary_key=True, editable=False, db_column='T004IdMaleza')
    finca = models.CharField(
        max_length=100,
        default='Finca La Riverita',
        editable=False,  # La finca está fija para este proyecto
        db_column='T004Finca',
        verbose_name='Finca'
    )
    nombre = models.CharField(
        max_length=100,
        db_column='T004Nombre',
        verbose_name='Área de Trabajo',
        help_text='Nombre del lote o sector de la Finca La Riverita (ej: Lote 1, Sector Norte)'
    )
    nombre_cientifico = models.CharField(
        max_length=200,
        default='Rumex crispus',
        blank=True,
        null=True,
        db_column='T004NombreCientifico',
        verbose_name='Nombre Científico de la Maleza'
    )
    cantidad_romaza = models.IntegerField(
        default=0,
        db_column='T004Cantidad',
        verbose_name='Cantidad de plantas Romaza detectadas'
    )
    descripcion = models.TextField(
        blank=True,
        null=True,
        db_column='T004Descripcion',
        verbose_name='Observaciones del área'
    )
    temporada = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_column='T004Temporada',
        verbose_name='Temporada de detección'
    )
    resistencia_herbicida = models.BooleanField(
        default=False,
        db_column='T004ResistenciaHerbicida',
        verbose_name='¿Romaza resistente al herbicida?'
    )
    activo = models.BooleanField(default=True, db_column='T004Activo')

    def __str__(self):
        return f"{self.finca} — {self.nombre}: {self.cantidad_romaza} plantas de Romaza"

    class Meta:
        db_table = 'T004Maleza'
        verbose_name = 'Registro de Romaza'
        verbose_name_plural = 'Registros de Romaza'
        ordering = ['-id_maleza']

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
        return f"{self.maleza.nombre} detectada en jornada {self.jornada.id_jornada}"
    
    class Meta:
        db_table = 'T005MalezaDetectada'
        verbose_name = 'Maleza Detectada'
        verbose_name_plural = 'Malezas Detectadas'

class InformacionTecnicaMaleza(models.Model):
    id = models.AutoField(primary_key=True, db_column='T007IdInfo')
    maleza = models.OneToOneField(Maleza, on_delete=models.CASCADE, related_name='informacion_tecnica', db_column='T007IdMaleza')
    imagen_url = models.URLField(max_length=500, blank=True, null=True, db_column='T007ImagenUrl')
    metodo_control = models.TextField(blank=True, null=True, db_column='T007MetodoControl')
    quimico_recomendado = models.CharField(max_length=200, blank=True, null=True, db_column='T007QuimicoRecomendado')
    nivel_peligro = models.CharField(max_length=20, choices=[('Bajo', 'Bajo'), ('Medio', 'Medio'), ('Alto', 'Alto')], default='Bajo', db_column='T007NivelPeligro')

    class Meta:
        db_table = 'T007InformacionTecnica'
        verbose_name = 'Información Técnica de Maleza'
        verbose_name_plural = 'Informaciones Técnicas de Malezas'