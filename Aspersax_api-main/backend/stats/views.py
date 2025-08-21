<<<<<<< HEAD
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import models
=======
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Sum
>>>>>>> 30311b5 (Primer commit: API Aspersax)
from django.utils import timezone
from datetime import timedelta
from robots.models import Robot
from tanques.models import Tanque
<<<<<<< HEAD
from malezas.models import Maleza, MalezaDetectada
from jornadas.models import Jornada
=======
from malezas.models import Maleza
from reportes.models import Reporte, DetalleMaleza
>>>>>>> 30311b5 (Primer commit: API Aspersax)
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

<<<<<<< HEAD
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
=======
        # Filtrar por fechas si se proporcionan
        reportes = Reporte.objects.filter(activo=True)
        if start_date and end_date:
            reportes = reportes.filter(jornada__fecha__range=[start_date, end_date])

        stats = {
            'total_robots': Robot.objects.filter(activo=True).count(),
            'robots_activos': Robot.objects.filter(activo=True, estado='Disponible').count(),
            'total_tanques': Tanque.objects.filter(activo=True).count(),
            'tanques_en_uso': Tanque.objects.filter(activo=True, estado__in=['Lleno', 'Medio', 'Bajo']).count(),
            'total_malezas': Maleza.objects.filter(activo=True).count(),
            'malezas_detectadas': DetalleMaleza.objects.filter(reporte__in=reportes).aggregate(
                total=Sum('cantidad')
            )['total'] or 0,
            'area_cubierta': sum([r.jornada.area_tratada for r in reportes]),
            'herbicida_usado': sum([r.jornada.area_tratada * 0.1 for r in reportes]),  # Estimación
>>>>>>> 30311b5 (Primer commit: API Aspersax)
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

<<<<<<< HEAD
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
=======
        # Si no se proporcionan fechas, usar los últimos 7 días
        if not start_date:
            end_date = timezone.now()
            start_date = end_date - timedelta(days=7)

        reportes = Reporte.objects.filter(
            jornada__fecha__range=[start_date, end_date],
            activo=True
        ).values('jornada__fecha__date').annotate(
            robots=Count('jornada__robot', distinct=True),
            malezas=Sum('detallemaleza__cantidad')
        ).order_by('jornada__fecha__date')

        activity_data = []
        for reporte in reportes:
            activity_data.append({
                'fecha': reporte['jornada__fecha__date'].strftime('%Y-%m-%d'),
                'robots': reporte['robots'],
                'malezas': reporte['malezas'] or 0
>>>>>>> 30311b5 (Primer commit: API Aspersax)
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
<<<<<<< HEAD
            'nombre', 'estado', 'bateria'
=======
            'id_robot', 'nombre', 'estado', 'bateria', 'ultima_actividad'
>>>>>>> 30311b5 (Primer commit: API Aspersax)
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
<<<<<<< HEAD
            'nombre', 'capacidad', 'nivel_actual', 'estado'
=======
            'id_tanque', 'nombre', 'capacidad', 'nivel_actual', 'estado'
>>>>>>> 30311b5 (Primer commit: API Aspersax)
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
<<<<<<< HEAD
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
        
=======
        malezas = DetalleMaleza.objects.values('maleza__nombre').annotate(
            total=Sum('cantidad')
        ).order_by('-total')[:5]
>>>>>>> 30311b5 (Primer commit: API Aspersax)
        logger.info(f'Weed stats generados: {list(malezas)}')
        return Response(list(malezas))
    except Exception as e:
        logger.error(f'Error en get_weed_stats: {str(e)}')
        return Response({'error': str(e)}, status=500)
