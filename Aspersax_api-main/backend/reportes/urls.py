<<<<<<< HEAD
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReporteViewSet

router = DefaultRouter()
router.register(r'reportes', ReporteViewSet)

urlpatterns = [
    path('', include(router.urls)),
=======
from django.urls import path
from .views import ReporteViewSet

urlpatterns = [
    path('', ReporteViewSet.as_view({'get': 'list', 'post': 'create'}), name='reporte-list'),
    path('<int:pk>/', ReporteViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='reporte-detail'),
>>>>>>> 30311b5 (Primer commit: API Aspersax)
]   