from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import models
from django.utils import timezone
from datetime import timedelta
from robots.models import Robot
from tanques.models import Tanque
from malezas.models import Maleza, MalezaDetectada
from jornadas.models import Jornada
import logging

logger = logging.getLogger(__name__)

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stats(request):
    try:
        logger.info('Iniciando get_stats')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        logger.info(f'Fechas recibidas: start_date={start_date}, end_date={end_date}')

        # Estadísticas generales
        robots_activos = Robot.objects.filter(activo=True).count()
        robots_operacion = Robot.objects.filter(activo=True, estado='En Operación').count()
        tanques_activos = Tanque.objects.filter(activo=True).count()
        tanques_uso = Tanque.objects.filter(activo=True).exclude(estado='Vacío').count()
        
        # Malezas detectadas en el período
        malezas_periodo = MalezaDetectada.objects.filter(
            jornada__fecha__range=[start_date, end_date]
        ).count()
        
        # Área cubierta en el período
        area_total = Jornada.objects.filter(
            fecha__range=[start_date, end_date]
        ).aggregate(total_area=models.Sum('area_tratada'))['total_area'] or 0
        
        stats = {
            'robots_activos': f"{robots_operacion}/{robots_activos}",
            'tanques_uso': f"{tanques_uso}/{tanques_activos}",
            'malezas_detectadas': malezas_periodo,
            'area_cubierta': area_total
        }

        logger.info(f'Stats generados: {stats}')
        return Response(stats)
    except Exception as e:
        logger.error(f'Error en get_stats: {str(e)}')
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_activity_data(request):
    try:
        logger.info('Iniciando get_activity_data')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        logger.info(f'Fechas recibidas: start_date={start_date}, end_date={end_date}')

        jornadas = Jornada.objects.filter(
            fecha__range=[start_date, end_date]
        ).values('fecha').annotate(
            total_area=models.Sum('area_tratada'),
            total_malezas=models.Count('malezas_detectadas'),
            total_jornadas=models.Count('id')
        ).order_by('fecha')

        activity_data = []
        for jornada in jornadas:
            activity_data.append({
                'fecha': jornada['fecha'].strftime('%Y-%m-%d'),
                'total_area': jornada['total_area'] or 0,
                'total_malezas': jornada['total_malezas'] or 0,
                'total_jornadas': jornada['total_jornadas'] or 0
            })

        logger.info(f'Activity data generado: {activity_data}')
        return Response(activity_data)
    except Exception as e:
        logger.error(f'Error en get_activity_data: {str(e)}')
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_robot_stats(request):
    try:
        logger.info('Iniciando get_robot_stats')
        robots = Robot.objects.filter(activo=True).values(
            'nombre', 'estado', 'bateria'
        )
        logger.info(f'Robot stats generados: {list(robots)}')
        return Response(list(robots))
    except Exception as e:
        logger.error(f'Error en get_robot_stats: {str(e)}')
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tank_stats(request):
    try:
        logger.info('Iniciando get_tank_stats')
        tanques = Tanque.objects.filter(activo=True).values(
            'nombre', 'capacidad', 'nivel_actual', 'estado'
        )
        logger.info(f'Tank stats generados: {list(tanques)}')
        return Response(list(tanques))
    except Exception as e:
        logger.error(f'Error en get_tank_stats: {str(e)}')
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_weed_stats(request):
    try:
        logger.info('Iniciando get_weed_stats')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        malezas = MalezaDetectada.objects.filter(
            jornada__fecha__range=[start_date, end_date]
        ).values(
            'maleza__nombre',
            'maleza__tipo'
        ).annotate(
            total=models.Count('id'),
            alta_densidad=models.Count('id', filter=models.Q(densidad='Alta')),
            media_densidad=models.Count('id', filter=models.Q(densidad='Media')),
            baja_densidad=models.Count('id', filter=models.Q(densidad='Baja'))
        )
        
        logger.info(f'Weed stats generados: {list(malezas)}')
        return Response(list(malezas))
    except Exception as e:
        logger.error(f'Error en get_weed_stats: {str(e)}')
        return Response({'error': str(e)}, status=500)
