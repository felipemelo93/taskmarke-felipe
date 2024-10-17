import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserProfile.css'; // Archivo de estilos personalizado
import Menu from './Menu';

const UserProfile = () => {
  const [userData, setUserData] = useState({
    id: '',
    username: '',
    correo: '',
    nombre: '',
    apellido: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const API_URL = 'http://127.0.0.1:8000/authentification/current-user/';

  // Obtener datos del usuario logueado
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Enviar los datos editados
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const updatedData = {
        username: userData.username,
        correo: userData.correo,
        nombre: userData.nombre,
        apellido: userData.apellido,
      };

      await axios.put(`http://127.0.0.1:8000/authentification/users/${userData.id}/update/`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Información actualizada con éxito');
    } catch (error) {
      console.error('Error updating user data:', error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.detail || 'Error al actualizar la información';
      setMessage(errorMessage);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="bg-white text-dark min-vh-100">
      {/* Pasa userData como prop a Menu */}
      <Menu userInfo={userData} />
      <div className="container mt-1">
        <h1 className="text-center mb-3">Perfil de Usuario</h1>
        {message && <p className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>{message}</p>}
        <div className="card shadow p-2 rounded">
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label className="form-label"><FontAwesomeIcon icon={faEnvelope} /> Correo Electrónico</label>
              <input
                type="email"
                name="correo"
                className="form-control"
                value={userData.correo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label"><FontAwesomeIcon icon={faUser} /> Nombre de Usuario</label>
              <input
                type="text"
                name="username"
                className="form-control"
                value={userData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label"><FontAwesomeIcon icon={faUser} /> Nombre</label>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={userData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label"><FontAwesomeIcon icon={faUser} /> Apellido</label>
              <input
                type="text"
                name="apellido"
                className="form-control"
                value={userData.apellido}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Guardar Cambios</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
