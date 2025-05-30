from rest_framework import serializers
from .models import Maleza, MalezaDetectada

class MalezaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Maleza
        fields = '__all__'

class MalezaDetectadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MalezaDetectada
        fields = '__all__'  