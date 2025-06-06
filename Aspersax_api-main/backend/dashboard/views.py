from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta
from robots.models import Robot
from tanques.models import Tanque
from malezas.models import Maleza
from reportes.models import Reporte, DetalleMaleza

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stats(request):
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')

    # Filtrar por fechas si se proporcionan
    reportes = Reporte.objects.filter(activo=True)
    if start_date and end_date:
        reportes = reportes.filter(fecha__range=[start_date, end_date])

    stats = {
        'total_robots': Robot.objects.filter(activo=True).count(),
        'robots_activos': Robot.objects.filter(activo=True, estado='Activo').count(),
        'total_tanques': Tanque.objects.filter(activo=True).count(),
        'tanques_en_uso': Tanque.objects.filter(activo=True, estado__in=['Lleno', 'Medio', 'Bajo']).count(),
        'total_malezas': Maleza.objects.filter(activo=True).count(),
        'malezas_detectadas': DetalleMaleza.objects.filter(reporte__in=reportes).aggregate(
            total=Sum('cantidad')
        )['total'] or 0,
        'area_cubierta': reportes.aggregate(total=Sum('area_cubierta'))['total'] or 0,
        'herbicida_usado': reportes.aggregate(total=Sum('herbicida_usado'))['total'] or 0,
    }

    return Response(stats)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_activity_data(request):
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')

    # Si no se proporcionan fechas, usar los últimos 7 días
    if not start_date:
        end_date = timezone.now()
        start_date = end_date - timedelta(days=7)

    reportes = Reporte.objects.filter(
        fecha__range=[start_date, end_date],
        activo=True
    ).values('fecha__date').annotate(
        robots=Count('robot', distinct=True),
        malezas=Sum('detallemaleza__cantidad')
    ).order_by('fecha__date')

    activity_data = []
    for reporte in reportes:
        activity_data.append({
            'fecha': reporte['fecha__date'].strftime('%Y-%m-%d'),
            'robots': reporte['robots'],
            'malezas': reporte['malezas'] or 0
        })

    return Response(activity_data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_robot_stats(request):
    robots = Robot.objects.filter(activo=True).values(
        'id', 'nombre', 'estado', 'bateria', 'ultima_actividad'
    )
    return Response(list(robots))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tank_stats(request):
    tanques = Tanque.objects.filter(activo=True).values(
        'id_tanque', 'nombre', 'capacidad', 'nivel_actual', 'estado'
    )
    return Response(list(tanques))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_weed_stats(request):
    malezas = DetalleMaleza.objects.values('maleza__nombre').annotate(
        total=Sum('cantidad')
    ).order_by('-total')[:5]
    return Response(list(malezas)) 