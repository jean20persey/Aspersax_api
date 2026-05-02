# malezas/models.py
from django.db import models
from jornadas.models import Jornada

class Maleza(models.Model):
    TIPOS = [
        ('Hoja Ancha', 'Hoja Ancha'),
        ('Hoja Angosta', 'Hoja Angosta'),
        ('Gramínea', 'Gramínea'),
        ('Otra', 'Otra'),
    ]

    id_maleza = models.AutoField(primary_key=True, editable=False, db_column='T004IdMaleza')
    nombre = models.CharField(max_length=100, default="Maleza sin nombre", db_column='T004Nombre')
    nombre_cientifico = models.CharField(max_length=200, blank=True, null=True, db_column='T004NombreCientifico')
    tipo = models.CharField(max_length=50, choices=TIPOS, default='Otra', db_column='T004Tipo')
    descripcion = models.TextField(blank=True, null=True, db_column='T004Descripcion')
    temporada = models.CharField(max_length=100, blank=True, null=True, db_column='T004Temporada')
    resistencia_herbicida = models.BooleanField(default=False, db_column='T004ResistenciaHerbicida')
    activo = models.BooleanField(default=True, db_column='T004Activo')
    
    def __str__(self):
        return f"{self.nombre} ({self.tipo})"
    
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
        return f"{self.maleza.nombre} ({self.maleza.tipo}) detectada en jornada {self.jornada.id_jornada}"
    
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