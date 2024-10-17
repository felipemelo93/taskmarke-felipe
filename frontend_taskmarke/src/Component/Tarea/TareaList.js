import React from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const TareaList = ({ tareas, onDelete, onEdit, searchTerm, estadoFilter, prioridadFilter, sortOrder }) => {
    // Función para filtrar tareas
    const filteredTareas = tareas
        .filter(tarea => 
            tarea.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            tarea.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(tarea => !estadoFilter || tarea.estado === estadoFilter)
        .filter(tarea => !prioridadFilter || tarea.prioridad === prioridadFilter);

    // Función para ordenar las tareas
    const sortedTareas = filteredTareas.sort((a, b) => {
        if (sortOrder.field === 'name') {
            return sortOrder.direction === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        } else if (sortOrder.field === 'fecha_vencimiento') {
            return sortOrder.direction === 'asc'
                ? new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento)
                : new Date(b.fecha_vencimiento) - new Date(a.fecha_vencimiento);
        }
        return 0; // Sin ordenar
    });

    return (
        <div className="border p-4 rounded">
            <h2>Lista de Tareas</h2>
            <ul className="list-group">
                {sortedTareas.map(tarea => (
                    <li key={tarea.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{tarea.name}</strong> - {tarea.description || tarea.descripcion}
                            <div><small><strong>Fecha de vencimiento:</strong> {tarea.fecha_vencimiento}</small></div>
                            <div><small><strong>Estado:</strong> {tarea.estado === 'P' ? 'Pendiente' : tarea.estado === 'E' ? 'En progreso' : 'Completado'}</small></div>
                            <div><small><strong>Prioridad:</strong> {tarea.prioridad === 'B' ? 'Baja' : tarea.prioridad === 'M' ? 'Media' : 'Alta'}</small></div>
                            <div>
                                <small><strong>Etiquetas:</strong> {tarea.etiquetas.map(etiqueta => etiqueta.name).join(', ')}</small>
                            </div>
                        </div>
                        <div>
                            <button className="btn btn-info mr-2" onClick={() => onEdit(tarea)}>
                                <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button className="btn btn-danger" onClick={() => onDelete(tarea.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TareaList;
