# tanque/urls.py
from django.urls import path
from . import views

app_name = 'tanque'

urlpatterns = [
    path('', views.TanqueList.as_view(), name='tanque_list'),
    path('crear/', views.CrearTanque.as_view(), name='tanque_create'),
    path('actualizar/<int:id_tanque>/', views.ActualizarTanque.as_view(), name='tanque_update'),
    path('buscar/<str:tipo>/', views.TanqueByTipo.as_view(), name='tanque_by_tipo'),
    path('<int:id_tanque>/', views.TanqueDetail.as_view(), name='tanque_detail'),
]