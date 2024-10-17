import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';  // Importa íconos de edición y eliminación

const EtiquetaList = ({ etiquetas, onEdit, onDelete }) => {
  return (
    
    <div className="container mt-4" style={{ maxWidth: '500px' }}>  {/* Contenedor más amplio */}
      <ul className="list-group" style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', backgroundColor: '#f9f9f9' }}>  {/* Añadir borde y padding */}
        {etiquetas.length > 0 ? (
          etiquetas.map(etiqueta => (
            <li 
              key={etiqueta.id} 
              className="list-group-item d-flex justify-content-between align-items-center p-2" 
              style={{ fontSize: '16px', borderBottom: '1px solid #ccc' }}  // Tamaño de texto más grande y separador
            >
              {etiqueta.name}
              <div>
                <button 
                  className="btn btn-info btn-sm mr-2" 
                  onClick={() => onEdit(etiqueta)} 
                  style={{ padding: '6px 10px' }}  // Botón un poco más grande
                >
                  <FaEdit />  {/* Ícono de edición */}
                </button>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={() => onDelete(etiqueta.id)} 
                  style={{ padding: '6px 10px' }}  // Botón un poco más grande
                >
                  <FaTrash />  {/* Ícono de eliminación */}
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="list-group-item text-center" style={{ fontSize: '16px' }}>No hay etiquetas disponibles.</li>
        )}
      </ul>
    </div>
    
  );
};

export default EtiquetaList;