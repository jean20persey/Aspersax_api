from django.urls import path
from .views import JornadaList, CrearJornada, JornadaDetail, JornadaPorFecha, JornadaUpdateView, JornadaDeleteView

urlpatterns = [
    path('jornadas/', JornadaList.as_view(), name='jornada-list'),
    path('jornadas/crear/', CrearJornada.as_view(), name='jornada-crear'),
    path('jornadas/<int:pk>/', JornadaDetail.as_view(), name='jornada-detail'),
    path('jornadas/buscar/', JornadaPorFecha.as_view(), name='jornada-por-fecha'),
    path('jornadas/<int:id_jornada>/actualizar/', JornadaUpdateView.as_view(), name='jornada-update'),
    path('jornadas/<int:id_jornada>/eliminar/', JornadaDeleteView.as_view(), name='jornada-delete'),
]