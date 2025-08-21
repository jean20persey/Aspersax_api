"""
URL configuration for aspersax project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/robots/', include('robots.urls')),
    path('api/tanques/', include('tanques.urls')),
    path('api/jornadas/', include('jornadas.urls')),
    path('api/malezas/', include('malezas.urls')),
    path('api/reportes/', include('reportes.urls')),
<<<<<<< HEAD
=======
    path('api/dashboard/', include('dashboard.urls')),
>>>>>>> 30311b5 (Primer commit: API Aspersax)
]
