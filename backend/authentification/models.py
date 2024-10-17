from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User (AbstractUser):

    nombre = models.CharField(max_length=100, blank=True, null=True)
    apellido = models.CharField(max_length=100, blank=True, null=True)
    correo = models.EmailField(max_length=100, unique=True)
    estado = models.BooleanField(default=True)

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.correo