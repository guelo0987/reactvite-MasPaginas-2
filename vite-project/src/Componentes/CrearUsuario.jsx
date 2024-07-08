import React from 'react';
import { useNavigate } from 'react-router-dom';

const CrearUsuario = ({ onClose }) => {
  const navigate = useNavigate();

  const handleNavigateEstudiante = () => {
    navigate('/AñadirEstudiante');
  };

  const handleNavigateProfesor = () => {
    navigate('/AñadirProfesor');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <h2>¿Qué tipo de usuario quiere crear?</h2>
          <div className="modal-actions">
            <button
              className="btn btn-primary"
              onClick={handleNavigateEstudiante}
            >
              Estudiante
            </button>
            <button
              className="btn btn-primary"
              onClick={handleNavigateProfesor}
            >
              Profesor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearUsuario;
