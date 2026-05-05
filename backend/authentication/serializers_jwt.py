from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añadir claims personalizados
        token['username'] = user.username
        token['rol'] = user.rol
        token['is_superuser'] = user.is_superuser
        token['full_name'] = f"{user.first_name} {user.last_name}"

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Añadir datos extra a la respuesta del login
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'rol': self.user.rol,
            'is_superuser': self.user.is_superuser,
            'full_name': f"{self.user.first_name} {self.user.last_name}".strip()
        }
        
        return data
