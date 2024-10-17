import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TareaList from './TareaList';
import TareaForm from './TareaForm';
import Menu from '../Menu';

const TareaCRUD = ({ token }) => {
    const [tareas, setTareas] = useState([]);
    const [error, setError] = useState(null);
    const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = 'http://127.0.0.1:8000/authentification/current-user/';

    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    const [prioridadFilter, setPrioridadFilter] = useState('');
    const [sortOrder, setSortOrder] = useState({ field: '', direction: 'asc' });

    // Encapsular fetchTareas en useCallback
    const fetchTareas = useCallback(async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/tareas/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTareas(response.data);
        } catch (err) {
            setError('Error al obtener las tareas');
            console.error('Error fetching tareas:', err);
        }
    }, [token]);

    // Encapsular fetchUserInfo en useCallback
    const fetchUserInfo = useCallback(async () => {
        try {
            const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserInfo(response.data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }, [token]);

    // Usar useEffect para llamar a ambas funciones encapsuladas
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                await Promise.all([fetchTareas(), fetchUserInfo()]);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [fetchTareas, fetchUserInfo]);

    const handleCreate = async (newTarea) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/tareas/', newTarea, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTareas([...tareas, response.data]);
        } catch (error) {
            console.error('Error creating tarea:', error);
            setError('Error al crear la tarea');
        }
    };

    const handleUpdate = async (id, updatedTarea) => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/tareas/${id}/`, updatedTarea, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTareas(tareas.map(tarea => tarea.id === id ? response.data : tarea));
            setTareaSeleccionada(null);
        } catch (error) {
            console.error('Error updating tarea:', error);
            setError('Error al actualizar la tarea');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/tareas/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTareas(tareas.filter(tarea => tarea.id !== id));
        } catch (error) {
            console.error('Error deleting tarea:', error);
            setError('Error al eliminar la tarea');
        }
    };

    const handleEdit = (tarea) => {
        setTareaSeleccionada(tarea);
    };

    const handleSort = (field) => {
        const direction = sortOrder.field === field && sortOrder.direction === 'asc' ? 'desc' : 'asc';
        setSortOrder({ field, direction });
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="bg-white text-dark min-vh-100">
            <Menu userInfo={userInfo} />

            <div className="container">
                <h1>Gestión de Tareas</h1>
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="row">
                    {/* Formulario de Tarea a la izquierda */}
                    <div className="col-md-6">
                        <TareaForm
                            onCreate={handleCreate}
                            onUpdate={handleUpdate}
                            tareaExistente={tareaSeleccionada}
                            token={token}
                        />
                    </div>

                    {/* Filtros y Listado de Tareas a la derecha */}
                    <div className="col-md-6">
                        <h5>Filtros</h5>
                        <div className="mb-4">
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Buscar tarea..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                className="form-select mb-2"
                                value={estadoFilter}
                                onChange={(e) => setEstadoFilter(e.target.value)}
                            >
                                <option value="">Todos los estados</option>
                                <option value="P">Pendiente</option>
                                <option value="E">En progreso</option>
                                <option value="C">Completado</option>
                            </select>
                            <select
                                className="form-select mb-2"
                                value={prioridadFilter}
                                onChange={(e) => setPrioridadFilter(e.target.value)}
                            >
                                <option value="">Todas las prioridades</option>
                                <option value="B">Baja</option>
                                <option value="M">Media</option>
                                <option value="A">Alta</option>
                            </select>
                            <div className="d-flex mb-2">
                                <button className="btn btn-primary me-2" onClick={() => handleSort('name')}>
                                    Ordenar por Nombre {sortOrder.field === 'name' && (sortOrder.direction === 'asc' ? '🔼' : '🔽')}
                                </button>
                                <button className="btn btn-primary" onClick={() => handleSort('fecha_vencimiento')}>
                                    Ordenar por Fecha de Vencimiento {sortOrder.field === 'fecha_vencimiento' && (sortOrder.direction === 'asc' ? '🔼' : '🔽')}
                                </button>
                            </div>
                        </div>

                        {/* Lista de tareas */}
                        <TareaList
                            tareas={tareas}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            searchTerm={searchTerm}
                            estadoFilter={estadoFilter}
                            prioridadFilter={prioridadFilter}
                            sortOrder={sortOrder}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TareaCRUD;
