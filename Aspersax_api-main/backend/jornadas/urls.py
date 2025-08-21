from django.urls import path
from .views import JornadaList, CrearJornada, JornadaDetail, JornadaPorFecha, JornadaUpdateView, JornadaDeleteView

urlpatterns = [
<<<<<<< HEAD
    path('jornadas/', JornadaList.as_view(), name='jornada-list'),
    path('jornadas/crear/', CrearJornada.as_view(), name='jornada-crear'),
    path('jornadas/<int:pk>/', JornadaDetail.as_view(), name='jornada-detail'),
    path('jornadas/buscar/', JornadaPorFecha.as_view(), name='jornada-por-fecha'),
    path('jornadas/<int:id_jornada>/actualizar/', JornadaUpdateView.as_view(), name='jornada-update'),
    path('jornadas/<int:id_jornada>/eliminar/', JornadaDeleteView.as_view(), name='jornada-delete'),
=======
    path('', JornadaList.as_view(), name='jornada-list'),
    path('crear/', CrearJornada.as_view(), name='jornada-crear'),
    path('<int:pk>/', JornadaDetail.as_view(), name='jornada-detail'),
    path('buscar/', JornadaPorFecha.as_view(), name='jornada-por-fecha'),
    path('<int:id_jornada>/actualizar/', JornadaUpdateView.as_view(), name='jornada-update'),
    path('<int:id_jornada>/eliminar/', JornadaDeleteView.as_view(), name='jornada-delete'),
>>>>>>> 30311b5 (Primer commit: API Aspersax)
]