from rest_framework import serializers
from .models import Tanque

class TanqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tanque
        fields = ['id_tanque', 'nombre', 'capacidad', 'nivel_actual', 
                 'estado', 'ultima_recarga', 'activo']
        read_only_fields = ['id_tanque']      