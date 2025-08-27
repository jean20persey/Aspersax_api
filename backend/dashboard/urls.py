from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.get_stats, name='dashboard_stats'),
    path('activity/', views.get_activity_data, name='dashboard_activity'),
    path('robots/', views.get_robot_stats, name='dashboard_robots'),
    path('tanks/', views.get_tank_stats, name='dashboard_tanks'),
    path('weeds/', views.get_weed_stats, name='dashboard_weeds'),
] 