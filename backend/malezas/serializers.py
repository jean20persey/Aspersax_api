from rest_framework import serializers
from .models import Maleza, MalezaDetectada, InformacionTecnicaMaleza

class InformacionTecnicaMalezaSerializer(serializers.ModelSerializer):
    class Meta:
        model = InformacionTecnicaMaleza
        fields = ['id', 'imagen_url', 'metodo_control', 'quimico_recomendado', 'nivel_peligro']

class MalezaSerializer(serializers.ModelSerializer):
    informacion_tecnica = InformacionTecnicaMalezaSerializer(read_only=True)

    class Meta:
        model = Maleza
        fields = [
            'id_maleza',
            'finca',          # Finca La Riverita (solo lectura)
            'nombre',         # Área de trabajo / lote / sector
            'nombre_cientifico',
            'cantidad_romaza',
            'descripcion',
            'temporada',
            'resistencia_herbicida',
            'activo',
            'informacion_tecnica',
        ]
        read_only_fields = ['id_maleza', 'finca']

class MalezaDetectadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MalezaDetectada
        fields = '__all__'  