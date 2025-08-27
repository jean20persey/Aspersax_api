from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework import generics, status
from django.db.models import Q
from rest_framework.exceptions import NotFound, ValidationError
from .models import Robot
from .serializers import RobotSerializer


class RobotList(generics.ListCreateAPIView):
    queryset = Robot.objects.all()
    serializer_class = RobotSerializer

class CrearRobot(generics.CreateAPIView):
    queryset = Robot.objects.all()
    serializer_class = RobotSerializer

class ActualizarRobot(generics.UpdateAPIView):
    queryset = Robot.objects.all()
    serializer_class = RobotSerializer
    lookup_field = 'id_robot'

class RobotById(generics.RetrieveAPIView):
    queryset = Robot.objects.all()
    serializer_class = RobotSerializer
    lookup_field = 'id_robot'

class RobotsByEstado(generics.ListAPIView):
    serializer_class = RobotSerializer
    
    def get_queryset(self):
        estado = self.kwargs.get('estado', None)
        if estado:
            return Robot.objects.filter(estado=estado)
        
        estado_query = self.request.query_params.get('estado', None)
        if estado_query:
            return Robot.objects.filter(estado=estado_query)
            
        raise NotFound(detail="No se proporcionó un estado válido")

class EliminarRobot(generics.DestroyAPIView):
    queryset = Robot.objects.all()
    serializer_class = RobotSerializer
    lookup_field = 'id_robot'