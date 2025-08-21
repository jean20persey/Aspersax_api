<<<<<<< HEAD
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MalezaViewSet

router = DefaultRouter()
router.register(r'malezas', MalezaViewSet)

urlpatterns = [
    path('', include(router.urls)),
=======
from django.urls import path
from .views import MalezaViewSet

urlpatterns = [
    path('', MalezaViewSet.as_view({'get': 'list', 'post': 'create'}), name='maleza-list'),
    path('<int:pk>/', MalezaViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='maleza-detail'),
>>>>>>> 30311b5 (Primer commit: API Aspersax)
]