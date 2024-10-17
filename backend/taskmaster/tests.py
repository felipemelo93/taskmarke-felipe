from rest_framework.test import APITestCase
from django.urls import reverse
from rest_framework import status
from authentification.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Tarea, Etiqueta, Estado, Prioridad
from datetime import date, timedelta

class TareaAPITestCase(APITestCase):
    def setUp(self):
        # Crear un usuario para las pruebas
        self.user = User.objects.create_user(
            username='testuser',
            correo='testuser@example.com',
            password='testpassword',
            nombre='prueba',
            apellido='prueba2'
        )
        
        # Crear token para autenticación
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        # Crear una etiqueta de prueba
        self.etiqueta = Etiqueta.objects.create(name='Etiqueta de prueba')
        
        # Definir URLs
        self.tareas_url = reverse('tarea-list')  # Asegúrate de que coincide con el nombre correcto
        self.tarea_detalle_url = lambda pk: reverse('tarea-detail', args=[pk])

    def test_crear_tarea(self):
        # Prueba de creación de una tarea
        data = {
            "name": "Tarea de prueba",
            "description": "Descripción de la tarea de prueba",
            "fecha_vencimiento": (date.today() + timedelta(days=7)).isoformat(),
            "estado": Estado.PENDIENTE,
            "prioridad": Prioridad.MEDIA,
            "etiquetas": [self.etiqueta.id]
        }
        response = self.client.post(self.tareas_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], data['name'])

    def test_obtener_tarea(self):
        # Prueba de obtención de una tarea existente
        tarea = Tarea.objects.create(
            user=self.user,
            name="Tarea obtenible",
            description="Descripción",
            fecha_vencimiento=date.today() + timedelta(days=7),
            estado=Estado.PENDIENTE,
            prioridad=Prioridad.ALTA
        )
        tarea.etiquetas.add(self.etiqueta)
        
        response = self.client.get(self.tarea_detalle_url(tarea.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], tarea.name)

    def test_actualizar_tarea(self):
        # Prueba de actualización de una tarea existente
        tarea = Tarea.objects.create(
            user=self.user,
            name="Tarea a actualizar",
            description="Descripción inicial",
            fecha_vencimiento=date.today() + timedelta(days=7),
            estado=Estado.PENDIENTE,
            prioridad=Prioridad.MEDIA
        )
        
        data = {
            "name": "Tarea actualizada",
            "description": "Descripción actualizada",
            "fecha_vencimiento": (date.today() + timedelta(days=10)).isoformat(),
            "estado": Estado.EN_PROGRESO,
            "prioridad": Prioridad.ALTA,
            "etiquetas": [self.etiqueta.id]
        }
        
        response = self.client.put(self.tarea_detalle_url(tarea.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], data['name'])

    def test_eliminar_tarea(self):
        # Prueba de eliminación de una tarea existente
        tarea = Tarea.objects.create(
            user=self.user,
            name="Tarea a eliminar",
            description="Descripción",
            fecha_vencimiento=date.today() + timedelta(days=7),
            estado=Estado.PENDIENTE,
            prioridad=Prioridad.BAJA
        )
        
        response = self.client.delete(self.tarea_detalle_url(tarea.id))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Tarea.objects.filter(id=tarea.id).exists())
