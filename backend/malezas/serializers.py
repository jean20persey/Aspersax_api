from rest_framework import serializers
from .models import Maleza, MalezaDetectada

class MalezaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maleza
        fields = ['id_maleza', 'nombre', 'nombre_cientifico', 'tipo',
                 'descripcion', 'temporada', 'resistencia_herbicida', 'activo']
        read_only_fields = ['id_maleza']

class MalezaDetectadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MalezaDetectada
        fields = '__all__'  