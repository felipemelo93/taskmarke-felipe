import React, { useState } from 'react';
import axios from 'axios';
import MensajeError from './MensajeError';  // Asegúrate de que esta ruta sea correcta

const Register = () => {
    const [nombre, setNombre] = useState(''); // Nuevo estado para nombre
    const [apellido, setApellido] = useState(''); // Nuevo estado para apellido
    const [username, setUsername] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [errores, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');

    const handleRegister = async () => {
        if (!nombre || !apellido || !username || !correo || !contrasena) {
            setError('Por favor, complete todos los campos.');
            setMensajeExito('');  // Limpiar mensaje de éxito si hay error
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/authentification/register/', {
                nombre,
                apellido,
                username,
                correo,
                password: contrasena,
            });
            setMensajeExito('Registro exitoso. Puedes iniciar sesión ahora.');
            setError('');  // Limpiar errores
            setNombre('');  // Limpiar campo de nombre
            setApellido('');  // Limpiar campo de apellido
            setUsername('');
            setCorreo('');
            setContrasena('');  // Limpiar campos después del éxito
        } catch (error) {
            console.error('Error en el registro:', error.response || error.message);
            setError('Error en el registro, intente de nuevo.');
            setMensajeExito('');  // Limpiar mensaje de éxito si hay error
        }
    };

    return (
        <div className="container mb 3">
            <h2>Registro</h2>
            <div className="card">
                <div className="card-header text-center">
                    <h4>Crear una cuenta</h4>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Escriba su nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Apellido</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Escriba su apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Escriba su username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Correo</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Escriba su correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Escriba su contraseña"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary w-100" onClick={handleRegister}>
                        Registrar
                    </button>
                    {errores && <MensajeError message={errores} />} {/* Mostrar mensaje de error */}
                    {mensajeExito && <div className="alert alert-success mt-3">{mensajeExito}</div>} {/* Mostrar mensaje de éxito */}
                </div>
            </div>
        </div>
    );
};

export default Register;