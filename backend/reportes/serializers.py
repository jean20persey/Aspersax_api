from rest_framework import serializers
from .models import Reporte, DetalleMaleza
from robots.models import Robot
from tanques.models import Tanque
from malezas.models import Maleza
from robots.serializers import RobotSerializer
from tanques.serializers import TanqueSerializer
from malezas.serializers import MalezaSerializer

class DetalleMalezaSerializer(serializers.ModelSerializer):
    maleza = MalezaSerializer(read_only=True)
    maleza_id = serializers.PrimaryKeyRelatedField(
        source='maleza',
        queryset=Maleza.objects.all(),
        write_only=True
    )

    class Meta:
        model = DetalleMaleza
        fields = ['id_detalle', 'maleza', 'maleza_id', 'cantidad', 
                 'ubicacion', 'herbicida_aplicado', 'efectividad']
        read_only_fields = ['id_detalle']

class ReporteSerializer(serializers.ModelSerializer):
    robot = RobotSerializer(read_only=True)
    robot_id = serializers.PrimaryKeyRelatedField(
        source='robot',
        queryset=Robot.objects.all(),
        write_only=True
    )
    tanque = TanqueSerializer(read_only=True)
    tanque_id = serializers.PrimaryKeyRelatedField(
        source='tanque',
        queryset=Tanque.objects.all(),
        write_only=True,
        required=False
    )
    malezas_detectadas = DetalleMalezaSerializer(
        source='detallemaleza_set',
        many=True,
        read_only=True
    )

    class Meta:
        model = Reporte
        fields = ['id_reporte', 'fecha', 'tipo', 'robot', 'robot_id',
                 'tanque', 'tanque_id', 'malezas_detectadas', 'area_cubierta',
                 'herbicida_usado', 'duracion', 'observaciones', 'activo']
        read_only_fields = ['id_reporte', 'fecha']

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