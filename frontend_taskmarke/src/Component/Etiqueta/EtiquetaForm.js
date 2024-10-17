import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EtiquetaForm = ({ token, currentEtiqueta, setCurrentEtiqueta, fetchEtiquetas }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentEtiqueta) {
      setName(currentEtiqueta.name.toUpperCase()); // Convertir a mayúsculas cuando se cargue la etiqueta para editar
    } else {
      setName('');
    }
  }, [currentEtiqueta]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (currentEtiqueta) {
        await axios.put(`http://localhost:8000/api/etiquetas/${currentEtiqueta.id}/`, { name: name.toUpperCase() }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post('http://localhost:8000/api/etiquetas/', { name: name.toUpperCase() }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setCurrentEtiqueta(null); // Limpiar la etiqueta actual
      setName(''); // Limpiar el campo de entrada
      fetchEtiquetas(); // Llama a esta función para actualizar la lista de etiquetas
    } catch (err) {
      setError(err.response ? err.response.data.detail || 'Error al guardar la etiqueta' : 'Error al guardar la etiqueta');
      console.error('Error in handleSubmit:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-light p-3 rounded shadow" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h4 className="text-center mb-3">{currentEtiqueta ? 'Actualizar Etiqueta' : 'Crear Nueva Etiqueta'}</h4>
      <div className="form-group">
        <input 
          type="text" 
          className="form-control form-control-sm"  
          value={name} 
          onChange={(e) => setName(e.target.value.toUpperCase())}  // Convertir a mayúsculas mientras el usuario escribe
          placeholder="Nombre de la etiqueta" 
          required 
        />
      </div>
      <button type="submit" className="btn btn-primary btn-block btn-sm">{currentEtiqueta ? 'Actualizar' : 'Crear'}</button>
      {currentEtiqueta && <button type="button" className="btn btn-secondary btn-block mt-2 btn-sm" onClick={() => setCurrentEtiqueta(null)}>Cancelar</button>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </form>
  );
};

export default EtiquetaForm;
