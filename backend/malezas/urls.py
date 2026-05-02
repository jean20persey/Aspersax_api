from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MalezaViewSet, MalezaDetectadaList, MalezaDetectadaDetail, MalezaDetectadaByJornada, CrearMalezaDetectada

router = DefaultRouter()
router.register(r'', MalezaViewSet, basename='maleza')

urlpatterns = [
    path('detectadas/', MalezaDetectadaList.as_view(), name='maleza-detectada-list'),
    path('detectadas/crear/', CrearMalezaDetectada.as_view(), name='maleza-detectada-crear'),
    path('detectadas/<int:id>/', MalezaDetectadaDetail.as_view(), name='maleza-detectada-detail'),
    path('detectadas/jornada/<int:jornada_id>/', MalezaDetectadaByJornada.as_view(), name='maleza-detectada-por-jornada'),
    path('', include(router.urls)),
]