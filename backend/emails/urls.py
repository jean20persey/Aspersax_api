from django.urls import path
from .views import EnviarEmailView

urlpatterns = [
    path('enviar/', EnviarEmailView.as_view(), name='enviar_email'),
]
