from django.urls import path
from . import views

app_name = 'reportes'



urlpatterns = [
    path('reportes/', views.ReporteList.as_view(), name='reporte_list'),
    path('reportes/crear/', views.CrearReporte.as_view(), name='reporte_create'),
    path('reportes/actualizar/<int:id_reporte>/', views.ActualizarReporte.as_view(), name='reporte_update'),
    path('reportes/<int:id_reporte>/', views.ReporteDetail.as_view(), name='reporte_detail'),
    path('reportes/<int:id_reporte>/eliminar/', views.EliminarReporte.as_view(), name='reporte_delete'),
    path('reportes/jornada/<int:jornada_id>/', views.ReporteByJornada.as_view(), name='reporte_by_jornada'),
]   