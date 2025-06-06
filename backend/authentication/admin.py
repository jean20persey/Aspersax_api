from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuariopropio

admin.site.register(Usuariopropio, UserAdmin) 