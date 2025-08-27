from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MalezaViewSet

router = DefaultRouter()
router.register(r'malezas', MalezaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]