from rest_framework import serializers
from .models import Reporte

class ReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = '__all__'
        
    def validate_jornada(self, value):
        # Obtener la instancia actual si estamos actualizando
        instance = getattr(self, 'instance', None)
        
        # Si estamos actualizando y la jornada no ha cambiado, permitir la actualización
        if instance and instance.jornada == value:
            return value
            
        # Si es una nueva jornada, verificar que no tenga reporte
        if Reporte.objects.filter(jornada=value).exists():
            raise serializers.ValidationError("Ya existe un reporte para esta jornada")
        return value  