from django.urls import path
from . import views

app_name = 'malezas'

urlpatterns = [
    path('malezas/', views.MalezaList.as_view(), name='maleza_list'),
    path('malezas/crear/', views.CrearMaleza.as_view(), name='maleza_create'),
    path('malezas/actualizar/<int:id_maleza>/', views.ActualizarMaleza.as_view(), name='maleza_update'),
    path('malezas/buscar/<str:nombre>/', views.MalezaByNombre.as_view(), name='maleza_by_nombre'),
    path('malezas/<int:id_maleza>/', views.MalezaDetail.as_view(), name='maleza_detail'),
    path('malezas/<int:id_maleza>/eliminar/', views.EliminarMaleza.as_view(), name='maleza_delete'),

    path('detectadas/', views.MalezaDetectadaList.as_view(), name='maleza_detectada_list'),
    path('detectadas/crear/', views.CrearMalezaDetectada.as_view(), name='maleza_detectada_create'),
    path('detectadas/actualizar/<int:id>/', views.ActualizarMalezaDetectada.as_view(), name='maleza_detectada_update'),
    path('detectadas/jornada/<int:jornada_id>/', views.MalezaDetectadaByJornada.as_view(), name='maleza_detectada_by_jornada'),
    path('detectadas/<int:id>/', views.MalezaDetectadaDetail.as_view(), name='maleza_detectada_detail'),
    path('detectadas/<int:id>/eliminar/', views.EliminarMalezaDetectada.as_view(), name='maleza_detectada_delete'),
]