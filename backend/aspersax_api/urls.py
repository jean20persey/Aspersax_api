from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include('robots.urls')),
    path('api/', include('tanques.urls')),
    path('api/', include('malezas.urls')),
    path('api/', include('reportes.urls')),
    path('api/dashboard/stats/', include('stats.urls')),
] 