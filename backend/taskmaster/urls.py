from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EtiquetaViewSet, TareaViewSet

router = DefaultRouter()
router.register(r'tareas', TareaViewSet, basename='tarea')
router.register(r'etiquetas', EtiquetaViewSet, basename='etiqueta')

urlpatterns = [
    path('', include(router.urls)),
]