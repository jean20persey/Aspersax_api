from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import generics, status
from django.db.models import Q
from rest_framework.exceptions import NotFound, ValidationError
from .models import Jornada
from .serializers import JornadaSerializer

class JornadaList(generics.ListAPIView):
    queryset = Jornada.objects.all()
    serializer_class = JornadaSerializer

class CrearJornada(generics.CreateAPIView):
    queryset = Jornada.objects.all()
    serializer_class = JornadaSerializer

class JornadaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Jornada.objects.all()
    serializer_class = JornadaSerializer

class JornadaPorFecha(generics.ListAPIView):
    serializer_class = JornadaSerializer

    def get_queryset(self):
        fecha = self.request.query_params.get('fecha', None)
        desde = self.request.query_params.get('desde', None)
        hasta = self.request.query_params.get('hasta', None)

        if fecha:
            return Jornada.objects.filter(fecha=fecha)
        elif desde and hasta:
            return Jornada.objects.filter(fecha__range=(desde, hasta))
        else:
            raise ValidationError("Debe proporcionar una fecha exacta o un rango de fechas (desde, hasta).")

class JornadaUpdateView(generics.UpdateAPIView):
    queryset = Jornada.objects.all()
    serializer_class = JornadaSerializer
    lookup_field = 'id_jornada'


class JornadaDeleteView(generics.DestroyAPIView):
    queryset = Jornada.objects.all()    
    serializer_class = JornadaSerializer
    lookup_field = 'id_jornada'
    