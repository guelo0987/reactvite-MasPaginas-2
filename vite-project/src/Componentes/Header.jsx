import React from 'react';
import '../Estilos/EstComponentes/Header.css';
import { useAuth } from "../Componentes/AutenticacionUsuario.jsx";

const Header = () => {
  const { user } = useAuth(); // Obtener el usuario desde el contexto

  // Determinar qué información mostrar segn el tipo de usuario
  const nombreMostrado = user?.nombreAdmin || user?.nombreEstudiante;
  const correoMostrado = user?.correoAdmin || user?.correoEstudiante;

  return (
    <header className="main-header">
      <div className="main-header-icons">
        {/* Aquí puedes agregar otros íconos si es necesario */}
      </div>
      <div className="main-header-profile">
        <div className="profile-info">
          <div className="profile-name">{nombreMostrado}</div>
          <div className="profile-role">{correoMostrado}</div>
        </div>
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/3a7eabf1265f4cebafa26a1c1e84e0ace41d4a7ff3c8fb7cbf48471771b5be57?apiKey=729dc09cd15c473da7916659c4854519&" className="profile-avatar" alt="Profile" />
      </div>
    </header>
  );
};

export default Header;
