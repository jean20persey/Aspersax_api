<<<<<<< HEAD
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TanqueViewSet

router = DefaultRouter()
router.register(r'tanques', TanqueViewSet)

urlpatterns = [
    path('', include(router.urls)),
=======
from django.urls import path
from .views import TanqueViewSet

urlpatterns = [
    path('', TanqueViewSet.as_view({'get': 'list', 'post': 'create'}), name='tanque-list'),
    path('<int:pk>/', TanqueViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='tanque-detail'),
>>>>>>> 30311b5 (Primer commit: API Aspersax)
]