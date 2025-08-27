from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

urlpatterns = [
    path('test/', views.test_auth, name='test_auth'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('registro/', views.RegistroUsuarioView.as_view(), name='registro'),
    path('perfil/', views.PerfilUsuarioView.as_view(), name='perfil'),
    path('enviar-codigo-recuperacion/', views.enviar_codigo_recuperacion, name='enviar_codigo_recuperacion'),
    path('verificar-codigo-recuperacion/', views.verificar_codigo_recuperacion, name='verificar_codigo_recuperacion'),
    path('cambiar-password-codigo/', views.cambiar_password_con_codigo, name='cambiar_password_codigo'),
]