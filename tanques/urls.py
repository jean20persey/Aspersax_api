from django.urls import path
from . import views

app_name = 'tanque'

urlpatterns = [
    path('tanques/', views.TanqueList.as_view(), name='tanque_list'),
    path('tanques/crear/', views.CrearTanque.as_view(), name='tanque_create'),
    path('tanques/<int:id_tanque>/actualizar/', views.ActualizarTanque.as_view(), name='tanque_update'),
    path('tanques/buscar/<str:tipo>/', views.TanqueByTipo.as_view(), name='tanque_by_tipo'),
    path('tanques/<int:id_tanque>/eliminar/', views.EliminarTanque.as_view(), name='tanque_delete'),
    path('tanques/<int:id_tanque>/', views.TanqueDetail.as_view(), name='tanque_detail'),
]