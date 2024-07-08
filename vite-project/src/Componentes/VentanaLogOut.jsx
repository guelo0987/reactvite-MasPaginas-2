import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Componentes/AutenticacionUsuario';
import '../Estilos/EstComponentes/VentanaLogOut.css';

const LogoutModal = ({ isVisible, onClose }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleConfirm = () => {
        logout();
        navigate('/'); // Redirigimos a la pantalla de login
        onClose(); // Cerramos el modal
    };

    if (!isVisible) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>¿Estás seguro de que quieres salir?</h2>
          <div className="modal-actions">
            <button onClick={handleConfirm}>Sí</button>
            <button onClick={onClose}>No</button>
          </div>
        </div>
      </div>
    );
};

export default LogoutModal;
