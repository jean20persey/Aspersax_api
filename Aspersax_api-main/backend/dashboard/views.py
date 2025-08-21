from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
<<<<<<< HEAD
from django.db.models import Count, Sum
=======
from django.db.models import Count, Sum, F, ExpressionWrapper, FloatField
>>>>>>> 30311b5 (Primer commit: API Aspersax)
from django.utils import timezone
from datetime import timedelta
from robots.models import Robot
from tanques.models import Tanque
from malezas.models import Maleza
from reportes.models import Reporte, DetalleMaleza

@api_view(['GET'])
<<<<<<< HEAD
@permission_classes([IsAuthenticated])
=======
>>>>>>> 30311b5 (Primer commit: API Aspersax)
def get_stats(request):
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')

    # Filtrar por fechas si se proporcionan
    reportes = Reporte.objects.filter(activo=True)
    if start_date and end_date:
        reportes = reportes.filter(fecha__range=[start_date, end_date])

    stats = {
        'total_robots': Robot.objects.filter(activo=True).count(),
<<<<<<< HEAD
        'robots_activos': Robot.objects.filter(activo=True, estado='Activo').count(),
=======
        'robots_activos': Robot.objects.filter(activo=True, estado='Disponible').count(),
>>>>>>> 30311b5 (Primer commit: API Aspersax)
        'total_tanques': Tanque.objects.filter(activo=True).count(),
        'tanques_en_uso': Tanque.objects.filter(activo=True, estado__in=['Lleno', 'Medio', 'Bajo']).count(),
        'total_malezas': Maleza.objects.filter(activo=True).count(),
        'malezas_detectadas': DetalleMaleza.objects.filter(reporte__in=reportes).aggregate(
            total=Sum('cantidad')
        )['total'] or 0,
<<<<<<< HEAD
        'area_cubierta': reportes.aggregate(total=Sum('area_cubierta'))['total'] or 0,
        'herbicida_usado': reportes.aggregate(total=Sum('herbicida_usado'))['total'] or 0,
=======
        'area_cubierta': sum([r.area_cubierta for r in reportes]),
        'herbicida_usado': sum([r.herbicida_usado for r in reportes]),
>>>>>>> 30311b5 (Primer commit: API Aspersax)
    }

    return Response(stats)

@api_view(['GET'])
<<<<<<< HEAD
@permission_classes([IsAuthenticated])
=======
>>>>>>> 30311b5 (Primer commit: API Aspersax)
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
<<<<<<< HEAD
@permission_classes([IsAuthenticated])
def get_robot_stats(request):
    robots = Robot.objects.filter(activo=True).values(
        'id', 'nombre', 'estado', 'bateria', 'ultima_actividad'
=======
def get_robot_stats(request):
    robots = Robot.objects.filter(activo=True).values(
        'id_robot', 'nombre', 'estado', 'bateria', 'ultima_actividad'
>>>>>>> 30311b5 (Primer commit: API Aspersax)
    )
    return Response(list(robots))

@api_view(['GET'])
<<<<<<< HEAD
@permission_classes([IsAuthenticated])
=======
>>>>>>> 30311b5 (Primer commit: API Aspersax)
def get_tank_stats(request):
    tanques = Tanque.objects.filter(activo=True).values(
        'id_tanque', 'nombre', 'capacidad', 'nivel_actual', 'estado'
    )
    return Response(list(tanques))

@api_view(['GET'])
<<<<<<< HEAD
@permission_classes([IsAuthenticated])
=======
>>>>>>> 30311b5 (Primer commit: API Aspersax)
def get_weed_stats(request):
    malezas = DetalleMaleza.objects.values('maleza__nombre').annotate(
        total=Sum('cantidad')
    ).order_by('-total')[:5]
<<<<<<< HEAD
    return Response(list(malezas)) 
=======
    return Response(list(malezas))

@api_view(['GET'])
def get_enhanced_stats(request):
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')

    # Filtrar por fechas si se proporcionan
    reportes = Reporte.objects.filter(activo=True)
    if start_date and end_date:
        reportes = reportes.filter(fecha__range=[start_date, end_date])

    # Calcular métricas mejoradas
    total_robots = Robot.objects.filter(activo=True).count()
    robots_activos = Robot.objects.filter(activo=True, estado='Disponible').count()
    total_tanques = Tanque.objects.filter(activo=True).count()
    tanques_en_uso = Tanque.objects.filter(activo=True, estado__in=['Lleno', 'Medio', 'Bajo']).count()
    
    # Calcular eficiencias
    eficiencia_robots = (robots_activos / total_robots * 100) if total_robots > 0 else 0
    eficiencia_tanques = (tanques_en_uso / total_tanques * 100) if total_tanques > 0 else 0
    
    # Calcular métricas de rendimiento usando campos correctos del modelo Reporte
    area_total = sum([r.area_cubierta for r in reportes])
    herbicida_total = sum([r.herbicida_usado for r in reportes])
    eficiencia_herbicida = (area_total / herbicida_total) if herbicida_total > 0 else 0

    enhanced_stats = {
        'total_robots': total_robots,
        'robots_activos': robots_activos,
        'total_tanques': total_tanques,
        'tanques_en_uso': tanques_en_uso,
        'total_malezas': Maleza.objects.filter(activo=True).count(),
        'malezas_detectadas': DetalleMaleza.objects.filter(reporte__in=reportes).aggregate(
            total=Sum('cantidad')
        )['total'] or 0,
        'area_cubierta': area_total,
        'herbicida_usado': herbicida_total,
        'eficiencia_robots': round(eficiencia_robots, 2),
        'eficiencia_tanques': round(eficiencia_tanques, 2),
        'eficiencia_herbicida': round(eficiencia_herbicida, 2),
        'productividad_general': round((eficiencia_robots + eficiencia_tanques) / 2, 2),
    }

    return Response(enhanced_stats)

@api_view(['GET'])
def get_realtime_data(request):
    # Obtener datos en tiempo real
    robots = Robot.objects.filter(activo=True).values(
        'id_robot', 'nombre', 'estado', 'bateria', 'ultima_actividad'
    )
    
    tanques = Tanque.objects.filter(activo=True).values(
        'id_tanque', 'nombre', 'capacidad', 'nivel_actual', 'estado'
    )
    
    # Calcular alertas
    alertas = []
    
    # Alertas de robots
    robots_baja_bateria = robots.filter(bateria__lt=30).count()
    if robots_baja_bateria > 0:
        alertas.append({
            'tipo': 'warning',
            'mensaje': f'{robots_baja_bateria} robots con batería baja',
            'icono': 'battery_alert'
        })
    
    # Alertas de tanques
    tanques_criticos = tanques.filter(nivel_actual__lt=F('capacidad') * 0.3).count()
    if tanques_criticos > 0:
        alertas.append({
            'tipo': 'error',
            'mensaje': f'{tanques_criticos} tanques con nivel crítico',
            'icono': 'water_drop'
        })
    
    realtime_data = {
        'robots': list(robots),
        'tanques': list(tanques),
        'alertas': alertas,
        'timestamp': timezone.now().isoformat(),
    }

    return Response(realtime_data)

@api_view(['GET'])
def get_performance_metrics(request):
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')

    # Si no se proporcionan fechas, usar los últimos 30 días
    if not start_date:
        end_date = timezone.now()
        start_date = end_date - timedelta(days=30)

    # Calcular métricas de rendimiento por día
    reportes_diarios = Reporte.objects.filter(
        fecha__range=[start_date, end_date],
        activo=True
    ).values('fecha__date').annotate(
        robots_activos=Count('robot', distinct=True),
        area_cubierta=Sum('area_cubierta'),
        herbicida_usado=Sum('herbicida_usado'),
        malezas_detectadas=Sum('detallemaleza__cantidad'),
    ).order_by('fecha__date')

    performance_data = []
    for reporte in reportes_diarios:
        area = reporte['area_cubierta'] or 0
        herbicida = reporte['herbicida_usado'] or 0
        eficiencia = (area / herbicida) if herbicida > 0 else 0
        
        performance_data.append({
            'fecha': reporte['fecha__date'].strftime('%Y-%m-%d'),
            'robots_activos': reporte['robots_activos'],
            'area_cubierta': area,
            'herbicida_usado': herbicida,
            'malezas_detectadas': reporte['malezas_detectadas'] or 0,
            'eficiencia': round(eficiencia, 2),
        })

    return Response(performance_data)

@api_view(['GET'])
def test_connection(request):
    """Endpoint de prueba para verificar la conexión"""
    return Response({
        'message': 'Conexión exitosa al dashboard',
        'timestamp': timezone.now().isoformat(),
        'status': 'ok'
    }) 
>>>>>>> 30311b5 (Primer commit: API Aspersax)
