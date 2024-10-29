from django.db import models
from authentification.models import User

class Etiqueta(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class Estado(models.TextChoices):
    PENDIENTE = 'P', 'Pendiente'
    EN_PROGRESO = 'E', 'En progreso'
    COMPLETADO = 'C', 'Completado'

class Prioridad(models.TextChoices):
    BAJA = 'B', 'Baja'
    MEDIA = 'M', 'Media'
    ALTA = 'A', 'Alta'
    

class Tarea(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=300)
    fecha_creacion = models.DateField(auto_now_add=True)
    fecha_vencimiento = models.DateField()
    estado = models.CharField(
        max_length=1,
        choices=Estado.choices,
        default=Estado.PENDIENTE
    )
    prioridad = models.CharField(
        max_length=1,
        choices=Prioridad.choices,
        default=Prioridad.MEDIA
    )
    etiquetas = models.ManyToManyField(Etiqueta, related_name='tareas', blank=True)

    def __str__(self):
        return self.name