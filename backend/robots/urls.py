from django.urls import path
from . import views

urlpatterns = [
    path('robots/', views.RobotList.as_view(), name='robot-list'),
    path('robots/crear/', views.CrearRobot.as_view(), name='crear-robot'),
    path('robots/<int:id_robot>/', views.RobotById.as_view(), name='robot-detail'),
    path('robots/<int:id_robot>/actualizar/', views.ActualizarRobot.as_view(), name='actualizar-robot'),
    path('robots/<int:id_robot>/eliminar/', views.EliminarRobot.as_view(), name='eliminar-robot'),
    path('robots/estado/<str:estado>/', views.RobotsByEstado.as_view(), name='robots-por-estado'),
]