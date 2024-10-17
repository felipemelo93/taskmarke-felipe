import React from 'react';

const MensajeError = ({ message }) => {
  return (
    <div className="alert alert-danger mt-3">
      {message}
    </div>
  );
};

export default MensajeError;