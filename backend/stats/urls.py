from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_stats, name='stats'),
    path('activity/', views.get_activity_data, name='activity'),
    path('robots/', views.get_robot_stats, name='robot_stats'),
    path('tanks/', views.get_tank_stats, name='tank_stats'),
    path('weeds/', views.get_weed_stats, name='weed_stats'),
] 