import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaEye, FaEdit, FaSearch } from 'react-icons/fa';
import { Modal, Button } from 'react-bootstrap';
import '../KanbanBoard.css';

const KanbanBoard = ({ token }) => {
  const [tasks, setTasks] = useState({
    pendientes: [],
    enProgreso: [],
    completadas: []
  });
  const [availableEtiquetas, setAvailableEtiquetas] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false); // Estado de carga

  const [filterEstado, setFilterEstado] = useState('');
  const [filterPrioridad, setFilterPrioridad] = useState('');
  const [filterEtiqueta, setFilterEtiqueta] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [sortType, setSortType] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true); // Comenzar la carga
    setError(null); // Reiniciar errores
    try {
      const response = await axios.get('http://localhost:8000/api/tareas/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const allTasks = response.data;

      const filteredTasks = allTasks.filter(task => 
        (filterEstado ? task.estado === filterEstado : true) &&
        (filterPrioridad ? task.prioridad === filterPrioridad : true) &&
        (filterEtiqueta ? task.etiquetas.some(etiqueta => etiqueta.name === filterEtiqueta) : true) &&
        (searchTerm ? task.name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
      );

      const sortedTasks = filteredTasks.sort((a, b) => {
        if (sortType === 'prioridad') {
          return a.prioridad.localeCompare(b.prioridad);
        } else if (sortType === 'fecha') {
          return new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento);
        }
        return 0;
      });

      const pendientes = sortedTasks.filter(task => task.estado === 'P');
      const enProgreso = sortedTasks.filter(task => task.estado === 'E');
      const completadas = sortedTasks.filter(task => task.estado === 'C');

      setTasks({ pendientes, enProgreso, completadas });
    } catch (err) {
      handleFetchError(err);
    } finally {
      setLoading(false); // Finalizar carga
    }
  }, [token, filterEstado, filterPrioridad, filterEtiqueta, searchTerm, sortType]);

  const handleFetchError = (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        setError('No autorizado. Por favor, inicie sesión nuevamente.');
      } else if (err.response.status === 404) {
        setError('No se encontraron tareas.');
      } else {
        setError('Error al obtener las tareas.');
      }
    } else {
      setError('Error de conexión. Inténtalo de nuevo más tarde.');
    }
  };

  const fetchEtiquetas = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/etiquetas/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAvailableEtiquetas(response.data);
    } catch (err) {
      setError('Error al obtener las etiquetas.');
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
    fetchEtiquetas();
  }, [fetchTasks, fetchEtiquetas]);

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleEditTask = (id) => {
    window.location.href = `/editar-tarea/${id}`;
  };

  const updateTaskStatus = async (task, newStatus) => {
    try {
      await axios.patch(`http://localhost:8000/api/tareas/${task.id}/`, {
        estado: newStatus,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      setError('Error al actualizar el estado de la tarea.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTask(null);
  };

  const isTaskExpired = (task) => {
    const today = new Date();
    const dueDate = new Date(task.fecha_vencimiento);
    return dueDate <= today;
  };

  return (
    <div className="container my-3">
      <h2 className="text-center mb-5">Tablero de Kanban</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-info">Cargando tareas...</div>} {/* Indicador de carga */}

      <div className="d-flex justify-content-between mb-3">
        <div className="input-group" style={{ width: '300px' }}>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Buscar tarea..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="input-group-text">
            <FaSearch />
          </span>
        </div>

        <div className="filter-container d-flex">
          <h3 className="me-3">Filtros</h3>
          <select
            className="form-select form-select-sm mx-1"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            style={{ width: '120px' }}
          >
            <option value="">Estado</option>
            <option value="P">Pendientes</option>
            <option value="E">En Progreso</option>
            <option value="C">Completadas</option>
          </select>
          <select
            className="form-select form-select-sm mx-1"
            value={filterPrioridad}
            onChange={(e) => setFilterPrioridad(e.target.value)}
            style={{ width: '120px' }}
          >
            <option value="">Prioridad</option>
            <option value="A">Alta</option>
            <option value="M">Media</option>
            <option value="B">Baja</option>
          </select>
          <select
            className="form-select form-select-sm mx-1"
            value={filterEtiqueta}
            onChange={(e) => setFilterEtiqueta(e.target.value)}
            style={{ width: '120px' }}
          >
            <option value="">Etiqueta</option>
            {availableEtiquetas.map(etiqueta => (
              <option key={etiqueta.id} value={etiqueta.name}>{etiqueta.name}</option>
            ))}
          </select>
          
          <select
            className="form-select form-select-sm mx-1"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            style={{ width: '120px' }}
          >
            <option value="">Ordenar por</option>
            <option value="prioridad">Prioridad</option>
            <option value="fecha">Fecha de Vencimiento</option>
          </select>
        </div>
      </div>

      <div className="row justify-content-center">
        {/* Columna de tareas pendientes */}
        <div className="col-md-3">
          <h4 className="text-center">Pendientes</h4>
          <div className="kanban-column bg-light border p-3 rounded shadow-sm">
            {tasks.pendientes.length > 0 ? (
              tasks.pendientes.map(task => (
                <div
                  key={task.id}
                  className={`task-card p-3 mb-3 rounded shadow-sm border ${isTaskExpired(task) ? 'bg-danger text-white' : 'bg-white'}`}
                >
                  <h5>{task.name}</h5>
                  <div className="task-icons">
                    <button className="btn btn-sm btn-info me-1" onClick={() => handleViewTask(task)}><FaEye /></button>
                    <button className="btn btn-sm btn-secondary me-1" onClick={() => handleEditTask(task.id)}><FaEdit /></button>
                    <button className="btn btn-sm btn-success" onClick={() => updateTaskStatus(task, 'E')}>Empezar</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay tareas pendientes.</p>
            )}
          </div>
        </div>

        {/* Columna de tareas en progreso */}
        <div className="col-md-3">
          <h4 className="text-center">En Progreso</h4>
          <div className="kanban-column bg-light border p-3 rounded shadow-sm">
            {tasks.enProgreso.length > 0 ? (
              tasks.enProgreso.map(task => (
                <div
                  key={task.id}
                  className={`task-card p-3 mb-3 rounded shadow-sm border ${isTaskExpired(task) ? 'bg-danger text-white' : 'bg-white'}`}
                >
                  <h5>{task.name}</h5>
                  <div className="task-icons">
                    <button className="btn btn-sm btn-info me-1" onClick={() => handleViewTask(task)}><FaEye /></button>
                    <button className="btn btn-sm btn-secondary me-1" onClick={() => handleEditTask(task.id)}><FaEdit /></button>
                    <button className="btn btn-sm btn-success" onClick={() => updateTaskStatus(task, 'C')}>Completar</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay tareas en progreso.</p>
            )}
          </div>
        </div>

        {/* Columna de tareas completadas */}
        <div className="col-md-3">
          <h4 className="text-center">Completadas</h4>
          <div className="kanban-column bg-light border p-3 rounded shadow-sm">
            {tasks.completadas.length > 0 ? (
              tasks.completadas.map(task => (
                <div
                  key={task.id}
                  className={`task-card p-3 mb-3 rounded shadow-sm border ${isTaskExpired(task) ? 'bg-danger text-white' : 'bg-white'}`}
                >
                  <h5>{task.name}</h5>
                  <div className="task-icons">
                    <button className="btn btn-sm btn-info me-1" onClick={() => handleViewTask(task)}><FaEye /></button>
                    <button className="btn btn-sm btn-secondary me-1" onClick={() => handleEditTask(task.id)}><FaEdit /></button>
                    <button className="btn btn-sm btn-warning" onClick={() => updateTaskStatus(task, 'E')}>Reabrir</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay tareas completadas.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal para ver detalles de la tarea */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <>
              <h5>{selectedTask.name}</h5>
              <p><strong>Descripción:</strong> {selectedTask.description}</p>
              <p><strong>Fecha de vencimiento:</strong> {selectedTask.fecha_vencimiento}</p>
              <p><strong>Estado:</strong> {selectedTask.estado_display}</p>
              <p><strong>Prioridad:</strong> {selectedTask.prioridad_display}</p>
              <p><strong>Etiquetas:</strong> {selectedTask.etiquetas.map(etiqueta => etiqueta.name).join(', ')}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => handleEditTask(selectedTask.id)}>
            Editar
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default KanbanBoard;
