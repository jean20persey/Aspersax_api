from django.urls import path
from . import views

app_name = 'reportes'

urlpatterns = [
    path('', views.ReporteList.as_view(), name='reporte_list'),
    path('crear/', views.CrearReporte.as_view(), name='reporte_create'),
    path('actualizar/<int:id_reporte>/', views.ActualizarReporte.as_view(), name='reporte_update'),
    path('<int:id_reporte>/', views.ReporteDetail.as_view(), name='reporte_detail'),
]   