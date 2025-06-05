from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import generics, status
from django.db.models import Q
from rest_framework.exceptions import NotFound, ValidationError
from .models import Reporte
from .serializers import ReporteSerializer


class ReporteList(generics.ListCreateAPIView):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer



class CrearReporte(generics.CreateAPIView):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer

class ActualizarReporte(generics.UpdateAPIView):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    lookup_field = 'id_reporte'

class ReporteByJornada(generics.RetrieveAPIView):
    serializer_class = ReporteSerializer
    
    def get_object(self):
        jornada_id = self.kwargs.get('jornada_id', None)
        if jornada_id:
            return get_object_or_404(Reporte, jornada__id_jornada=jornada_id)
        raise NotFound("Debe proporcionar un ID de jornada válido")

class ReporteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    lookup_field = 'id_reporte'

class EliminarReporte(generics.DestroyAPIView):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer
    lookup_field = 'id_reporte'

