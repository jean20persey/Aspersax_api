from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.core.mail import EmailMessage
from django.conf import settings
from django.http import JsonResponse
import json
import base64
from io import BytesIO

class EnviarEmailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            data = request.data
            
            # Extraer datos del request
            destinatarios = data.get('destinatarios', [])
            asunto = data.get('asunto', '')
            mensaje = data.get('mensaje', '')
            adjuntos = data.get('adjuntos', [])
            
            if not destinatarios:
                return Response(
                    {'error': 'Se requiere al menos un destinatario'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Crear el email
            email = EmailMessage(
                subject=asunto,
                body=mensaje,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=destinatarios,
            )
            
            # Procesar adjuntos si existen
            for adjunto in adjuntos:
                try:
                    # Decodificar el contenido base64
                    contenido_base64 = adjunto.get('contenido', '')
                    if contenido_base64.startswith('data:'):
                        # Remover el prefijo data:mime/type;base64,
                        contenido_base64 = contenido_base64.split(',')[1]
                    
                    contenido_bytes = base64.b64decode(contenido_base64)
                    
                    # Adjuntar el archivo
                    email.attach(
                        adjunto.get('nombre', 'archivo'),
                        contenido_bytes,
                        adjunto.get('tipo', 'application/octet-stream')
                    )
                except Exception as e:
                    print(f"Error procesando adjunto {adjunto.get('nombre', 'desconocido')}: {e}")
            
            # Enviar el email
            email.send()
            
            return Response({
                'success': True,
                'message': f'Email enviado exitosamente a {len(destinatarios)} destinatario(s)'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': f'Error al enviar email: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
