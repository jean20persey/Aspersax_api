from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from . import views

urlpatterns = [
    path('test/', views.test_auth, name='test_auth'),
    path('registro/', views.RegistroUsuarioView.as_view(), name='registro_usuario'),
    path('perfil/', views.PerfilUsuarioView.as_view(), name='perfil_usuario'),
    path('usuarios/', views.ListaUsuariosView.as_view(), name='lista_usuarios'),
    
    # Recuperación de contraseña
    path('enviar-codigo-recuperacion/', views.enviar_codigo_recuperacion, name='enviar_codigo_recuperacion'),
    path('verificar-codigo-recuperacion/', views.verificar_codigo_recuperacion, name='verificar_codigo_recuperacion'),
    path('cambiar-password-con-codigo/', views.cambiar_password_con_codigo, name='cambiar_password_con_codigo'),
    
    # Permisos de administrador
    path('solicitar-admin/', views.solicitar_permisos_administrador, name='solicitar_admin'),
    path('verificar-admin/', views.verificar_codigo_administrador, name='verificar_admin'),
]