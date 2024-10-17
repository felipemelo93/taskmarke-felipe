import React, { useState } from 'react';
import { useParams } from 'react-router-dom'; // Elimina useNavigate
import axios from 'axios';

const PasswordResetConfirm = () => {
  const { uidb64, token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  // const navigate = useNavigate(); // Elimina esta línea

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }
    try {
      console.log(uidb64, token);
      const response = await axios.post(`http://127.0.0.1:8000/authentification/password-reset-confirm/${uidb64}/${token}/`, {
        new_password: newPassword,
        confirm_password: confirmPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setMessage('Contraseña restablecida con éxito. ' + (response.data.message || ''));
    } catch (error) {
      console.log(error);
      setMessage('El enlace de restablecimiento es inválido o ha expirado.');
    }
  };

  return (
    <div>
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <label>Nueva Contraseña:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <label>Confirmar Contraseña:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Restablecer Contraseña</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PasswordResetConfirm;
