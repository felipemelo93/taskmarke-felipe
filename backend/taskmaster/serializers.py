from rest_framework import serializers
from .models import Tarea, Etiqueta

class EtiquetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etiqueta
        fields = ['id', 'name']
        read_only_fields = ['user']

class TareaSerializer(serializers.ModelSerializer):
    etiquetas = EtiquetaSerializer(many=True, read_only=True)  # Mostrar etiquetas con detalles completos en la respuesta
    etiquetas_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Etiqueta.objects.all(), write_only=True, required=False
    )
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    prioridad_display = serializers.CharField(source='get_prioridad_display', read_only=True)

    class Meta:
        model = Tarea
        fields = [
            'id', 'name', 'description', 'fecha_creacion', 'fecha_vencimiento', 'estado',
            'estado_display', 'prioridad', 'prioridad_display', 'etiquetas', 'etiquetas_ids'
        ]

    def create(self, validated_data):
        etiquetas_ids = validated_data.pop('etiquetas_ids', [])
        tarea = Tarea.objects.create(**validated_data)
        tarea.etiquetas.set(etiquetas_ids)  # Asignar etiquetas seleccionadas
        return tarea

    def update(self, instance, validated_data):
        etiquetas_ids = validated_data.pop('etiquetas_ids', [])
        instance = super().update(instance, validated_data)
        if etiquetas_ids:
            instance.etiquetas.set(etiquetas_ids)  # Actualizar etiquetas seleccionadas
        return instance