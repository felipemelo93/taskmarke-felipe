
import React, { useState } from "react"; 
import { useNavigate } from 'react-router-dom';
import MensajeError from './MensajeError'; 
import axios from 'axios';

const Login = ({ setToken }) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setError] = useState('');
  const navegar = useNavigate();
  const API_URL = 'http://127.0.0.1:8000/authentification/token/';

  const validarDatos = async () => {
    if (!correo || !contrasena) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      const respuesta = await axios.post(API_URL, {
        "correo": correo,
        "password": contrasena
      });
      console.log(respuesta.data);
      localStorage.setItem('access_token', respuesta.data.access);
      setToken(respuesta.data.access);
      navegar('/dashboard');
    } catch (error) {
      console.error('Error en la solicitud:', error.response || error.message);
      setError('Credenciales incorrectas, intente de nuevo');
    }
  };

  const manejarRecuperacionContrasena = () => {
    navegar('/recuperar-contraseña');
  };

  const manejarRegistro = () => {
    navegar('/register');
  };

  return (
    <div className="container mt-0">
      <div className="row justify-content-center">
        <div className="text-center mb-2">
          <h1 className="display-4 fw-bold text-primary">TaskMarker</h1>
          <p className="lead text-muted">Gestión de tareas de manera eficiente</p>
        </div>
        <div className="col-md-4"> {/* Cambié de col-md-6 a col-md-4 */}
          <div className="card">
            <div className="card-header text-center">
              <h2>Iniciar Sesión</h2>
            </div>
            <div className="card-body">
              <div className="mb-8">
                <label className="form-label">Correo</label>
                <input
                  placeholder="Escriba su correo"
                  type="correo" 
                  className="form-control"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  placeholder="Escriba su contraseña"
                  className="form-control"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                />
              </div>
              {errores && <MensajeError message={errores} />}
              <div className="d-grid">
                <button className="btn btn-primary" onClick={validarDatos}>
                  Iniciar Sesión
                </button>
              </div>
            </div>
            <div className="card-footer text-muted text-center">
              <p>¿No tienes cuenta? <button className="btn btn-link" onClick={manejarRegistro}>Regístrate aquí</button></p>
              
              <div className="mt-0">
                <button className="btn btn-link" onClick={manejarRecuperacionContrasena}>¿Olvidaste tu contraseña?</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;