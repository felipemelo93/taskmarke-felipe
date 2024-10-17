import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const API_URL = 'http://127.0.0.1:8000/authentification/current-user/';
  const PASSWORD_API_URL = 'http://127.0.0.1:8000/authentification/change-password/';

  // Obtener datos del usuario actual
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data); // Guardamos los datos del usuario en el estado
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que la nueva contraseña y la confirmación coincidan
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');  // Obtener el token del localStorage

      await axios.put(PASSWORD_API_URL, {
        old_password: oldPassword,
        new_password: newPassword,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,  // Asegúrate de enviar el token de acceso
        },
      });

      setSuccess('Contraseña actualizada con éxito');
      setError('');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Redirigir al dashboard u otra ruta tras el éxito
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error.response);
      setError('No se pudo cambiar la contraseña. Verifica los datos e inténtalo de nuevo.');
      setSuccess('');
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="bg-white text-dark min-vh-100">
      {/* Barra de menú con los datos del usuario */}
      <Menu userInfo={userData} />
      
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header text-center">
                <h2>Cambiar Contraseña</h2>
              </div>
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Contraseña Antigua</label>
                    <input
                      type="password"
                      className="form-control"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nueva Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Cambiar Contraseña</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
