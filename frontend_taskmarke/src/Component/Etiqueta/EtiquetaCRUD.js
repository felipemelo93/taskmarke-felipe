import React, { useEffect, useState, useCallback } from 'react';
import EtiquetaList from './EtiquetaList';
import EtiquetaForm from './EtiquetaForm';
import axios from 'axios';
import Menu from '../Menu';

const EtiquetaCRUD = ({ token }) => {
  const [etiquetas, setEtiquetas] = useState([]);
  const [currentEtiqueta, setCurrentEtiqueta] = useState(null);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://127.0.0.1:8000/authentification/current-user/';

  const fetchEtiquetas = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/etiquetas/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Etiquetas recibidas:', response.data);
      setEtiquetas(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.detail || 'Error al obtener las etiquetas' : 'Error al obtener las etiquetas');
      console.error('Error fetching etiquetas:', err);
    }
  }, [token]);

  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user info:', error);
      setLoading(false);
    }
  }, [token]);

  const handleEdit = (etiqueta) => {
    setCurrentEtiqueta(etiqueta);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/etiquetas/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchEtiquetas();
    } catch (err) {
      setError(err.response ? err.response.data.detail || 'Error al eliminar la etiqueta' : 'Error al eliminar la etiqueta');
      console.error('Error deleting etiqueta:', err);
    }
  };

  useEffect(() => {
    fetchEtiquetas();
    fetchUserInfo();
  }, [fetchEtiquetas, fetchUserInfo]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="bg-while text-dark min-vh-100">
      <Menu userInfo={userInfo} />

      <div className="mt-5 mx-3 mb-4 text-center">
        <h2>Gestión de Etiquetas</h2>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <EtiquetaForm 
          token={token}
          currentEtiqueta={currentEtiqueta} 
          setCurrentEtiqueta={setCurrentEtiqueta} 
          fetchEtiquetas={fetchEtiquetas} 
        />
        <EtiquetaList 
          etiquetas={etiquetas} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  );
};

export default EtiquetaCRUD;
