from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import generics, status
from django.db.models import Q
from rest_framework.exceptions import NotFound, ValidationError
from .models import Tanque
from .serializers import TanqueSerializer


class TanqueList(generics.ListCreateAPIView):
    queryset = Tanque.objects.all()
    serializer_class = TanqueSerializer

class CrearTanque(generics.CreateAPIView):
    queryset = Tanque.objects.all()
    serializer_class = TanqueSerializer

class ActualizarTanque(generics.UpdateAPIView):
    queryset = Tanque.objects.all()
    serializer_class = TanqueSerializer
    lookup_field = 'id_tanque'

class TanqueByTipo(generics.ListAPIView):
    serializer_class = TanqueSerializer
    
    def get_queryset(self):
        tipo = self.kwargs.get('tipo', None)
        if tipo:
            return Tanque.objects.filter(tipo=tipo)
        raise NotFound("Debe proporcionar un tipo válido")

class TanqueDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tanque.objects.all()
    serializer_class = TanqueSerializer
    lookup_field = 'id_tanque'

class EliminarTanque(generics.DestroyAPIView):
    queryset = Tanque.objects.all()
    serializer_class = TanqueSerializer
    lookup_field = 'id_tanque'