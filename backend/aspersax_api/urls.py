from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/robots/', include('robots.urls')),
    path('api/tanques/', include('tanques.urls')),
    path('api/malezas/', include('malezas.urls')),
    path('api/reportes/', include('reportes.urls')),
    path('api/jornadas/', include('jornadas.urls')),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/stats/', include('stats.urls')),
    path('api/emails/', include('emails.urls')),
] 