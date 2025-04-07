from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import generics, status
from django.db.models import Q
from rest_framework.exceptions import NotFound, ValidationError
from .models import Maleza, MalezaDetectada
from .serializers import MalezaSerializer, MalezaDetectadaSerializer


class MalezaList(generics.ListCreateAPIView):
    queryset = Maleza.objects.all()
    serializer_class = MalezaSerializer

class CrearMaleza(generics.CreateAPIView):
    queryset = Maleza.objects.all()
    serializer_class = MalezaSerializer

class ActualizarMaleza(generics.UpdateAPIView):
    queryset = Maleza.objects.all()
    serializer_class = MalezaSerializer
    lookup_field = 'id_maleza'

class MalezaByNombre(generics.ListAPIView):
    serializer_class = MalezaSerializer
    
    def get_queryset(self):
        nombre = self.kwargs.get('nombre', None)
        if nombre:
            return Maleza.objects.filter(nombre_comun__icontains=nombre)
        raise NotFound("Debe proporcionar un nombre válido")

class MalezaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Maleza.objects.all()
    serializer_class = MalezaSerializer
    lookup_field = 'id_maleza'


class MalezaDetectadaList(generics.ListCreateAPIView):
    queryset = MalezaDetectada.objects.all()
    serializer_class = MalezaDetectadaSerializer

class CrearMalezaDetectada(generics.CreateAPIView):
    queryset = MalezaDetectada.objects.all()
    serializer_class = MalezaDetectadaSerializer

class ActualizarMalezaDetectada(generics.UpdateAPIView):
    queryset = MalezaDetectada.objects.all()
    serializer_class = MalezaDetectadaSerializer
    lookup_field = 'id'

class MalezaDetectadaByJornada(generics.ListAPIView):
    serializer_class = MalezaDetectadaSerializer
    
    def get_queryset(self):
        jornada_id = self.kwargs.get('jornada_id', None)
        if jornada_id:
            return MalezaDetectada.objects.filter(jornada__id_jornada=jornada_id)
        raise NotFound("Debe proporcionar un ID de jornada válido")

class MalezaDetectadaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = MalezaDetectada.objects.all()
    serializer_class = MalezaDetectadaSerializer
    lookup_field = 'id'