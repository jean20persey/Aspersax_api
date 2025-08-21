from django.urls import path
from . import views

urlpatterns = [
<<<<<<< HEAD
    path('stats/', views.get_stats, name='dashboard_stats'),
    path('activity/', views.get_activity_data, name='dashboard_activity'),
    path('robots/', views.get_robot_stats, name='dashboard_robots'),
    path('tanks/', views.get_tank_stats, name='dashboard_tanks'),
    path('weeds/', views.get_weed_stats, name='dashboard_weeds'),
=======
    path('test/', views.test_connection, name='dashboard_test'),
    path('stats/', views.get_stats, name='dashboard_stats'),
    path('stats/activity/', views.get_activity_data, name='dashboard_activity'),
    path('stats/robots/', views.get_robot_stats, name='dashboard_robots'),
    path('stats/tanks/', views.get_tank_stats, name='dashboard_tanks'),
    path('stats/weeds/', views.get_weed_stats, name='dashboard_weeds'),
    path('enhanced-stats/', views.get_enhanced_stats, name='dashboard_enhanced_stats'),
    path('realtime/', views.get_realtime_data, name='dashboard_realtime'),
    path('performance/', views.get_performance_metrics, name='dashboard_performance'),
>>>>>>> 30311b5 (Primer commit: API Aspersax)
] 