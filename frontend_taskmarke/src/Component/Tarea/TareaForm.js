import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Select from 'react-select';

const TareaForm = ({ onCreate, onUpdate, tareaExistente, token }) => {
    const [tarea, setTarea] = useState({
        name: '',
        description: '',
        fecha_vencimiento: '',
        estado: 'P',
        prioridad: 'M',
        etiquetas_ids: []
    });

    const [etiquetasDisponibles, setEtiquetasDisponibles] = useState([]);

    // Usar useCallback para que la función no cambie en cada renderizado
    const fetchEtiquetas = useCallback(async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/etiquetas/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const etiquetasMapeadas = response.data.map(etiqueta => ({
                value: etiqueta.id,
                label: etiqueta.name
            }));
            setEtiquetasDisponibles(etiquetasMapeadas);
        } catch (err) {
            console.error('Error fetching etiquetas:', err);
        }
    }, [token]);

    useEffect(() => {
        if (tareaExistente) {
            const etiquetasMapeadas = tareaExistente.etiquetas.map(etiqueta => ({
                value: etiqueta.id,
                label: etiqueta.name
            }));
            setTarea({ ...tareaExistente, etiquetas_ids: etiquetasMapeadas });
        }
        fetchEtiquetas();
    }, [tareaExistente, fetchEtiquetas]); // Ahora fetchEtiquetas es una dependencia estable

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name') {
            setTarea({ ...tarea, [name]: value.toUpperCase() });
        } else if (name === 'description') {
            setTarea({ ...tarea, [name]: formatDescription(value) });
        } else {
            setTarea({ ...tarea, [name]: value });
        }
    };

    const formatDescription = (desc) => {
        if (desc.length === 0) return '';
        return desc.charAt(0).toUpperCase() + desc.slice(1).toLowerCase();
    };

    const handleEtiquetasChange = (selectedOptions) => {
        setTarea({ ...tarea, etiquetas_ids: selectedOptions });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const etiquetasId = tarea.etiquetas_ids.map(etiqueta => etiqueta.value);
        const tareaConEtiquetas = { ...tarea, etiquetas_ids: etiquetasId };

        if (tareaExistente) {
            onUpdate(tarea.id, tareaConEtiquetas);
        } else {
            onCreate(tareaConEtiquetas);
        }

        setTarea({
            name: '',
            description: '',
            fecha_vencimiento: '',
            estado: 'P',
            prioridad: 'M',
            etiquetas_ids: []
        });
    };

    return (
        <form onSubmit={handleSubmit} className="border p-3 rounded bg-light">
            <h5 className="text-center">Gestión de Tareas</h5>
            <input
                type="text"
                name="name"
                placeholder="Nombre"
                value={tarea.name}
                onChange={handleChange}
                required
                className="form-control mb-2"
            />
            <textarea
                name="description"
                placeholder="Descripción"
                value={tarea.description}
                onChange={handleChange}
                required
                className="form-control mb-2"
                rows="2"
            />
            <input
                type="date"
                name="fecha_vencimiento"
                value={tarea.fecha_vencimiento}
                onChange={handleChange}
                required
                className="form-control mb-2"
            />
            <select name="estado" value={tarea.estado} onChange={handleChange} className="form-control mb-2">
                <option value="P">Pendiente</option>
                <option value="E">En progreso</option>
                <option value="C">Completado</option>
            </select>
            <select name="prioridad" value={tarea.prioridad} onChange={handleChange} className="form-control mb-2">
                <option value="B">Baja</option>
                <option value="M">Media</option>
                <option value="A">Alta</option>
            </select>
            <Select
                isMulti
                name="etiquetas"
                value={tarea.etiquetas_ids}
                onChange={handleEtiquetasChange}
                options={etiquetasDisponibles}
                className="basic-multi-select mb-2"
                classNamePrefix="select"
                placeholder="Selecciona etiquetas"
            />
            <button type="submit" className="btn btn-primary btn-block">
                {tareaExistente ? 'Actualizar Tarea' : 'Guardar Tarea'}
            </button>
        </form>
    );
};

export default TareaForm;
