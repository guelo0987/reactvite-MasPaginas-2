import React, { useState } from 'react';

const OpcionCreacionUsuario = ({ onClose }) => {
  const [tipoUsuario, setTipoUsuario] = useState(''); // State to track selected user type

  const handleCloseModal = () => {
    onClose(); // Call the onClose prop to close the modal
  };

  const handleCrearEstudiante = () => {
    // Implement logic for creating a student user
    console.log('Creando estudiante...');
    handleCloseModal(); // Close the modal after creating the student
  };

  const handleCrearProfesor = () => {
    // Implement logic for creating a teacher user
    console.log('Creando profesor...');
    handleCloseModal(); // Close the modal after creating the teacher
  };

  return (
    <div className="modal-overlay" onClick={handleCloseModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>¿Qué tipo de usuario desea crear?</h2>
        <div className="options">
          <button
            className={tipoUsuario === 'estudiante' ? 'active' : ''}
            onClick={() => setTipoUsuario('estudiante')}
          >
            Estudiante
          </button>
          <button
            className={tipoUsuario === 'profesor' ? 'active' : ''}
            onClick={() => setTipoUsuario('profesor')}
          >
            Profesor
          </button>
        </div>
        {tipoUsuario && (
          <div className="user-creation-form">
            {/* Form for creating the user based on selected type (Estudiante or Profesor) */}
            {/* ... Form fields and submit button ... */}
          </div>
        )}
      </div>
    </div>
  );
};

export default OpcionCreacionUsuario;
