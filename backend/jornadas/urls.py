from django.urls import path
from .views import JornadaList, CrearJornada, JornadaDetail, JornadaPorFecha, JornadaUpdateView, JornadaDeleteView

urlpatterns = [
    path('', JornadaList.as_view(), name='jornada-list'),
    path('crear/', CrearJornada.as_view(), name='jornada-crear'),
    path('<int:pk>/', JornadaDetail.as_view(), name='jornada-detail'),
    path('buscar/', JornadaPorFecha.as_view(), name='jornada-por-fecha'),
    path('<int:id_jornada>/actualizar/', JornadaUpdateView.as_view(), name='jornada-update'),
    path('<int:id_jornada>/eliminar/', JornadaDeleteView.as_view(), name='jornada-delete'),
]