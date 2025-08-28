from django.contrib.auth import authenticate, get_user_model
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import permissions
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .serializers import RegistroUsuarioSerializer, UsuarioSerializer
from .models import CodigoRecuperacion, SolicitudAdministrador

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
            response = super().create(request, *args, **kwargs)
            
            # Enviar email de bienvenida después del registro exitoso
            if response.status_code == 201:
                user_data = response.data
                email = request.data.get('email')
                first_name = request.data.get('first_name', '')
                
                if email:
                    self.enviar_email_bienvenida(email, first_name)
            
            return response
        except Exception as e:
            print(f"Error en registro: {str(e)}")
            raise
    
    def enviar_email_bienvenida(self, email, nombre):
        """Envía email de bienvenida al nuevo usuario"""
        try:
            asunto = "¡Bienvenido a Aspersax! 🌱"
            
            mensaje = f"""
¡Hola {nombre}!

¡Bienvenido a Aspersax - Sistema de Gestión Agrícola Inteligente! 🌱

Tu cuenta ha sido creada exitosamente. Ahora puedes acceder a todas las funcionalidades de nuestro sistema:

🤖 Gestión de Robots Aspersores
🪣 Control de Tanques y Químicos  
🌿 Detección Automática de Malezas
📊 Reportes y Analytics Avanzados
📈 Dashboard en Tiempo Real
📅 Programación de Jornadas

Para comenzar, inicia sesión en: http://localhost:3001

¡Gracias por unirte a la revolución agrícola inteligente!

El equipo de Aspersax
aspersaxapi@gmail.com
            """
            
            send_mail(
                asunto,
                mensaje,
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            print(f"Email de bienvenida enviado a: {email}")
            
        except Exception as e:
            print(f"Error enviando email de bienvenida: {str(e)}")
            # No fallar el registro si el email falla

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def enviar_codigo_recuperacion(request):
    """Envía código de recuperación por email"""
    email = request.data.get('email')
    
    if not email:
        return Response(
            {'detail': 'Email es requerido'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        usuario = User.objects.get(email=email)
        
        # Invalidar códigos anteriores no usados
        CodigoRecuperacion.objects.filter(
            usuario=usuario, 
            usado=False
        ).update(usado=True)
        
        # Crear nuevo código
        codigo_recuperacion = CodigoRecuperacion.objects.create(usuario=usuario)
        
        # Enviar email con el código
        asunto = "Código de Recuperación - Aspersax 🌱"
        mensaje = f"""
¡Hola {usuario.first_name or usuario.username}!

Has solicitado recuperar tu contraseña en Aspersax.

Tu código de verificación es: {codigo_recuperacion.codigo}

Este código expirará en 10 minutos por seguridad.

Si no solicitaste este cambio, puedes ignorar este email.

El equipo de Aspersax
aspersaxapi@gmail.com
        """
        
        send_mail(
            asunto,
            mensaje,
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )
        
        return Response({
            'message': 'Código de recuperación enviado exitosamente'
        })
        
    except User.DoesNotExist:
        return Response(
            {'detail': 'Email no registrado en el sistema'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Error enviando código de recuperación: {str(e)}")
        return Response(
            {'detail': 'Error al enviar código de recuperación'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def verificar_codigo_recuperacion(request):
    """Verifica código de recuperación"""
    email = request.data.get('email')
    codigo = request.data.get('codigo')
    
    if not email or not codigo:
        return Response(
            {'detail': 'Email y código son requeridos'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        usuario = User.objects.get(email=email)
        codigo_recuperacion = CodigoRecuperacion.objects.get(
            usuario=usuario,
            codigo=codigo,
            usado=False
        )
        
        if codigo_recuperacion.is_expired():
            return Response(
                {'detail': 'El código ha expirado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return Response({
            'message': 'Código verificado correctamente'
        })
        
    except User.DoesNotExist:
        return Response(
            {'detail': 'Usuario no encontrado'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except CodigoRecuperacion.DoesNotExist:
        return Response(
            {'detail': 'Código incorrecto o ya utilizado'}, 
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def cambiar_password_con_codigo(request):
    """Cambia contraseña usando código de verificación"""
    email = request.data.get('email')
    codigo = request.data.get('codigo')
    nueva_password = request.data.get('nueva_password')
    
    if not email or not codigo or not nueva_password:
        return Response(
            {'detail': 'Email, código y nueva contraseña son requeridos'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        usuario = User.objects.get(email=email)
        codigo_recuperacion = CodigoRecuperacion.objects.get(
            usuario=usuario,
            codigo=codigo,
            usado=False
        )
        
        if codigo_recuperacion.is_expired():
            return Response(
                {'detail': 'El código ha expirado'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Cambiar contraseña
        usuario.set_password(nueva_password)
        usuario.save()
        
        # Marcar código como usado
        codigo_recuperacion.usado = True
        codigo_recuperacion.save()
        
        return Response({'message': 'Contraseña cambiada exitosamente'})

    except Exception as e:
        return Response({'detail': f'Error al verificar código: {str(e)}'}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def solicitar_permisos_administrador(request):
    """Solicitar permisos de administrador - envía código a aspersaxapi@gmail.com"""
    try:
        usuario = request.user
        motivo = request.data.get('motivo', '')
        
        # Verificar si ya es administrador
        if usuario.es_administrador():
            return Response({'detail': 'Ya tienes permisos de administrador'}, status=400)
        
        # Verificar si ya tiene una solicitud pendiente
        solicitud_existente = SolicitudAdministrador.objects.filter(
            usuario=usuario, 
            verificado=False
        ).first()
        
        if solicitud_existente and not solicitud_existente.is_expired():
            return Response({
                'detail': 'Ya tienes una solicitud pendiente',
                'codigo_enviado': True
            }, status=400)
        
        # Invalidar solicitudes anteriores
        SolicitudAdministrador.objects.filter(usuario=usuario, verificado=False).delete()
        
        # Crear nueva solicitud
        solicitud = SolicitudAdministrador.objects.create(
            usuario=usuario,
            motivo=motivo
        )
        
        # Enviar email a aspersaxapi@gmail.com
        asunto = f"🔐 Solicitud de Permisos de Administrador - {usuario.username}"
        mensaje = f"""
¡Nueva solicitud de permisos de administrador!

👤 Usuario: {usuario.username}
📧 Email: {usuario.email}
📅 Fecha: {solicitud.fecha_solicitud.strftime('%d/%m/%Y %H:%M')}
🔑 Código de verificación: {solicitud.codigo_verificacion}

📝 Motivo de la solicitud:
{motivo if motivo else 'No especificado'}

---
Para otorgar permisos de administrador:
1. El usuario debe ingresar el código: {solicitud.codigo_verificacion}
2. El código expira en 24 horas
3. Una vez verificado, el usuario tendrá permisos de administrador

Sistema Aspersax - Gestión de Aspersores Inteligentes 🌱
        """
        
        send_mail(
            asunto,
            mensaje,
            settings.EMAIL_HOST_USER,
            ['aspersaxapi@gmail.com'],
            fail_silently=False
        )
        
        return Response({
            'message': 'Solicitud enviada exitosamente. Revisa tu email para el código de verificación.',
            'expira_en': '24 horas'
        })
        
    except Exception as e:
        return Response({'detail': f'Error al procesar solicitud: {str(e)}'}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verificar_codigo_administrador(request):
    """Verificar código y otorgar permisos de administrador"""
    try:
        usuario = request.user
        codigo = request.data.get('codigo')
        
        if not codigo:
            return Response({'detail': 'Código requerido'}, status=400)
        
        # Buscar solicitud
        try:
            solicitud = SolicitudAdministrador.objects.get(
                usuario=usuario,
                codigo_verificacion=codigo.upper(),
                verificado=False
            )
        except SolicitudAdministrador.DoesNotExist:
            return Response({'detail': 'Código inválido'}, status=400)
        
        # Verificar expiración
        if solicitud.is_expired():
            return Response({'detail': 'El código ha expirado'}, status=400)
        
        # Otorgar permisos de administrador
        usuario.rol = 'admin'
        usuario.save()
        
        # Marcar solicitud como verificada
        solicitud.verificado = True
        solicitud.save()
        
        return Response({
            'message': '¡Felicidades! Ahora tienes permisos de administrador',
            'rol': 'admin'
        })
        
    except Exception as e:
        return Response({'detail': f'Error al verificar código: {str(e)}'}, status=500)

class PerfilUsuarioView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UsuarioSerializer

    def get_object(self):
        return self.request.user

class ListaUsuariosView(generics.ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer 