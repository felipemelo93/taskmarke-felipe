import React, { useState } from "react";
import axios from 'axios';

const RecuperarContrasena = () => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState('');

  const manejarRecuperacion = async () => {
    try {
      // Eliminamos la variable 'respuesta' ya que no se utiliza
      await axios.post('http://127.0.0.1:8000/authentification/password-reset/', { correo });
      setMensaje('Se ha enviado un enlace de recuperación a tu correo.');
      setErrores('');
    } catch (error) {
      console.error('Error en la solicitud:', error.response || error.message);
      setErrores('Error al enviar el enlace de recuperación, intenta de nuevo.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mt-4">
        <div className="card-body">
          <h2 className="card-title">Recuperación de Contraseña</h2>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Escriba su correo"
              required
            />
          </div>
          <button className="btn btn-primary w-100" onClick={manejarRecuperacion}>
            Enviar enlace de recuperación
          </button>
          {mensaje && <div className="alert alert-success mt-3">{mensaje}</div>}
          {errores && <div className="alert alert-danger mt-3">{errores}</div>}
        </div>
      </div>
    </div>
  );
};

export default RecuperarContrasena;
