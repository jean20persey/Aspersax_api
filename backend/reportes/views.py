from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import generics, status, viewsets
from django.db.models import Q
from rest_framework.exceptions import NotFound, ValidationError
from .models import Reporte, DetalleMaleza
from .serializers import ReporteSerializer, DetalleMalezaSerializer
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta


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

class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.filter(activo=True)
    serializer_class = ReporteSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        instance.activo = False
        instance.save()

    def create(self, request, *args, **kwargs):
        malezas_data = request.data.pop('malezas_detectadas', [])
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reporte = serializer.save()

        for maleza_data in malezas_data:
            maleza_data['reporte'] = reporte.id_reporte
            detalle_serializer = DetalleMalezaSerializer(data=maleza_data)
            detalle_serializer.is_valid(raise_exception=True)
            detalle_serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def por_periodo(self, request):
        periodo = request.query_params.get('periodo', 'dia')
        fecha_inicio = timezone.now()
        
        if periodo == 'dia':
            fecha_inicio = fecha_inicio - timedelta(days=1)
        elif periodo == 'semana':
            fecha_inicio = fecha_inicio - timedelta(weeks=1)
        elif periodo == 'mes':
            fecha_inicio = fecha_inicio - timedelta(days=30)
        else:
            return Response(
                {'error': 'Periodo inválido. Use: dia, semana o mes'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reportes = self.queryset.filter(fecha__gte=fecha_inicio)
        serializer = self.get_serializer(reportes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def por_robot(self, request):
        robot_id = request.query_params.get('robot_id')
        if not robot_id:
            return Response(
                {'error': 'Se requiere el ID del robot'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reportes = self.queryset.filter(robot_id=robot_id)
        serializer = self.get_serializer(reportes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def por_tipo(self, request):
        tipo = request.query_params.get('tipo')
        if not tipo:
            return Response(
                {'error': 'Se requiere especificar el tipo de reporte'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reportes = self.queryset.filter(tipo=tipo)
        serializer = self.get_serializer(reportes, many=True)
        return Response(serializer.data)

