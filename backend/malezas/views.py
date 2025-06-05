from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from django.db.models import Q
from rest_framework.exceptions import NotFound, ValidationError
from .models import Maleza, MalezaDetectada
from .serializers import MalezaSerializer, MalezaDetectadaSerializer
from rest_framework.permissions import IsAuthenticated


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

class EliminarMaleza(generics.DestroyAPIView):  
    queryset = Maleza.objects.all()
    serializer_class = MalezaSerializer
    lookup_field = 'id_maleza'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.maleza_detectada.exists():
            raise ValidationError("No se puede eliminar la maleza porque tiene detecciones asociadas.")
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


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

class EliminarMalezaDetectada(generics.DestroyAPIView):  
    queryset = MalezaDetectada.objects.all()
    serializer_class = MalezaDetectadaSerializer
    lookup_field = 'id'

class MalezaViewSet(viewsets.ModelViewSet):
    queryset = Maleza.objects.filter(activo=True)
    serializer_class = MalezaSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        instance.activo = False
        instance.save()

    @action(detail=False, methods=['get'])
    def buscar(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response(
                {'error': 'Se requiere un término de búsqueda'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        malezas = self.queryset.filter(
            Q(nombre__icontains=query) |
            Q(nombre_cientifico__icontains=query) |
            Q(tipo__icontains=query) |
            Q(descripcion__icontains=query)
        )
        
        serializer = self.get_serializer(malezas, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def por_tipo(self, request):
        tipo = request.query_params.get('tipo', '')
        if not tipo:
            return Response(
                {'error': 'Se requiere especificar un tipo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        malezas = self.queryset.filter(tipo=tipo)
        serializer = self.get_serializer(malezas, many=True)
        return Response(serializer.data)

