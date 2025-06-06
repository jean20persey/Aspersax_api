from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TanqueViewSet

router = DefaultRouter()
router.register(r'tanques', TanqueViewSet)

urlpatterns = [
    path('', include(router.urls)),
]