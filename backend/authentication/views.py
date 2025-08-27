from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import RegistroUsuarioSerializer, UsuarioSerializer

User = get_user_model()

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def test_auth(request):
    """Endpoint de prueba para verificar que la autenticación funcione"""
    return Response({
        'message': 'Endpoint de prueba funcionando',
        'user_authenticated': request.user.is_authenticated,
        'user': str(request.user) if request.user.is_authenticated else 'Anónimo'
    })

class RegistroUsuarioView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegistroUsuarioSerializer
    
    def create(self, request, *args, **kwargs):
        print(f"Datos recibidos en registro: {request.data}")
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            print(f"Error en registro: {str(e)}")
            raise

class PerfilUsuarioView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UsuarioSerializer

    def get_object(self):
        return self.request.user

class ListaUsuariosView(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer 