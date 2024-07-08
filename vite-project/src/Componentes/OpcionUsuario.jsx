// OpcionUsuario.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Estilos/EstComponentes/OpcionUsuario.css";

const OpcionUsuario = ({ onClose, onCrearUsuario }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    onClose();
  };

  const handleCrearUsuarios = () => {
    handleCloseModal();
    onCrearUsuario();
  };

  const handleListadoUsuarios = () => {
    handleCloseModal();
    navigate('/ListadoUsuarios'); // Navegar a la pantalla de ListadoUsuarios
  };

  return (
    <>
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>¿Qué desea realizar?</h2>
            <div className="options">
              <button onClick={handleCrearUsuarios}>Crear Usuarios</button>
              <button onClick={handleListadoUsuarios}>Listado de usuarios</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OpcionUsuario;
