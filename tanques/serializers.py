from rest_framework import serializers
from .models import Tanque

class TanqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tanque
        fields = '__all__'      