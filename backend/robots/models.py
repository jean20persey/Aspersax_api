from django.db import models

class Robot(models.Model):
    id_robot = models.AutoField(primary_key=True, editable=False, db_column='T002IdRobot')
    modelo = models.CharField(max_length=100, db_column='T002Modelo')
    estado = models.CharField(max_length=50, db_column='T002Estado')
    activo = models.BooleanField(default=True, db_column='T002Activo')
    
    def __str__(self):
        return f"{self.modelo} ({self.estado})"
    
    class Meta:
        db_table = 'T002Robot'
        verbose_name = 'Robot'
        verbose_name_plural = 'Robots'