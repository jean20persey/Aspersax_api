from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import generics, status, viewsets
from django.db.models import Q
from rest_framework.exceptions import NotFound, ValidationError
from .models import Tanque
from .serializers import TanqueSerializer
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated


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

class TanqueViewSet(viewsets.ModelViewSet):
    queryset = Tanque.objects.filter(activo=True)
    serializer_class = TanqueSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        instance.activo = False
        instance.save()

    @action(detail=True, methods=['post'])
    def recargar(self, request, pk=None):
        tanque = self.get_object()
        cantidad = float(request.data.get('cantidad', 0))
        
        if cantidad <= 0:
            return Response(
                {'error': 'La cantidad debe ser mayor que 0'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        nueva_cantidad = tanque.nivel_actual + cantidad
        if nueva_cantidad > tanque.capacidad:
            return Response(
                {'error': 'La cantidad excede la capacidad del tanque'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        tanque.nivel_actual = nueva_cantidad
        if nueva_cantidad >= tanque.capacidad:
            tanque.estado = 'Lleno'
        elif nueva_cantidad >= tanque.capacidad * 0.5:
            tanque.estado = 'Medio'
        elif nueva_cantidad > 0:
            tanque.estado = 'Bajo'
        else:
            tanque.estado = 'Vacío'
        
        tanque.save()
        return Response(TanqueSerializer(tanque).data)