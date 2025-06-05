from django.db import models

class Tanque(models.Model):
    id_tanque = models.AutoField(primary_key=True, editable=False, db_column='T003IdTanque')
    capacidad = models.DecimalField(max_digits=10, decimal_places=2, db_column='T003Capacidad')
    tipo = models.CharField(max_length=50, db_column='T003Tipo')
    estado = models.CharField(max_length=50, db_column='T003Estado')
    activo = models.BooleanField(default=True, db_column='T003Activo')
    
    def __str__(self):
        return f"{self.tipo} - {self.capacidad}L - {self.estado}"
    
    class Meta:
        db_table = 'T003Tanque'
        verbose_name = 'Tanque'
        verbose_name_plural = 'Tanques'