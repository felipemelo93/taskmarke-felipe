from django.contrib import admin

# Register your models here.

from django.contrib.auth.admin import UserAdmin

from .models import User

class Usercustom(UserAdmin):
    model = User
    
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('correo', 'nombre', 'apellido', 'estado')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('correo', 'nombre', 'apellido', 'estado')}),
    )
    list_display = ('correo', 'nombre', 'apellido',  'estado', 'is_staff', 'is_active')
    search_fields = ('correo', 'nombre', 'apellido')
    ordering = ('correo',)

admin.site.register(User,Usercustom)



