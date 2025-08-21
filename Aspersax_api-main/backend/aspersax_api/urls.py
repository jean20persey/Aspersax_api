from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
<<<<<<< HEAD
    path('api/', include('robots.urls')),
    path('api/', include('tanques.urls')),
    path('api/', include('malezas.urls')),
    path('api/', include('reportes.urls')),
=======
    path('api/auth/', include('authentication.urls')),
    path('api/jornadas/', include('jornadas.urls')),
    path('api/robots/', include('robots.urls')),
    path('api/tanques/', include('tanques.urls')),
    path('api/malezas/', include('malezas.urls')),
    path('api/reportes/', include('reportes.urls')),
    path('api/dashboard/', include('dashboard.urls')),
>>>>>>> 30311b5 (Primer commit: API Aspersax)
    path('api/dashboard/stats/', include('stats.urls')),
] 