// Sidebar.js
import React, { useState } from 'react';
import styles from '../Estilos/EstComponentes/Sidebar.module.css';
import logoImage from '../assets/logoUni.png';
import { Link, useNavigate } from 'react-router-dom';
import LogoutModal from '../Componentes/VentanaLogOut';
import OpcionUsuario from "../Componentes/OpcionUsuario";
import CrearUsuarioModal from "../Componentes/CrearUsuario";
import PreferenciaNotificaciones from "../Componentes/PreferenciaNotificaciones";
import ConfiguracionCuenta from "../Componentes/ConfiguracionCuenta";

const SidebarItem = ({ icon, text, to, isActive = false, onClick }) => (
  <Link to={to} className={`${styles.sidebarItem} ${isActive ? styles.sidebarItemActive : ''}`} onClick={onClick}>
    <img loading="lazy" src={icon} className={styles.sidebarItemIcon} alt="" />
    <div className={styles.sidebarItemText}>{text}</div>
  </Link>
);

const Sidebar = () => {
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isOpcionUsuarioModalVisible, setOpcionUsuarioModalVisible] = useState(false);
  const [isCrearUsuarioModalVisible, setCrearUsuarioModalVisible] = useState(false);
  const [isPreferenciaNotificacionesVisible, setPreferenciaNotificacionesVisible] = useState(false);
  const [isConfiguracionCuentaVisible, setConfiguracionCuentaVisible] = useState(false);
  const navigate = useNavigate();

  const handleOpenLogoutModal = () => {
    setLogoutModalVisible(true);
  };

  const handleCloseLogoutModal = () => {
    setLogoutModalVisible(false);
  };

  const handleConfirmLogout = () => {
    setLogoutModalVisible(false);
    navigate('/logout');
  };

  const handleOpenOpcionUsuarioModal = () => {
    setOpcionUsuarioModalVisible(true);
  };

  const handleCloseOpcionUsuarioModal = () => {
    setOpcionUsuarioModalVisible(false);
  };

  const handleOpenCrearUsuarioModal = () => {
    setCrearUsuarioModalVisible(true);
  };

  const handleCloseCrearUsuarioModal = () => {
    setCrearUsuarioModalVisible(false);
  };

  const handleOpenPreferenciaNotificaciones = () => {
    setPreferenciaNotificacionesVisible(true);
  };

  const handleClosePreferenciaNotificaciones = () => {
    setPreferenciaNotificacionesVisible(false);
  };

  const handleOpenConfiguracionCuenta = () => {
    setConfiguracionCuentaVisible(true);
  };

  const handleCloseConfiguracionCuenta = () => {
    setConfiguracionCuentaVisible(false);
  };

  const sidebarItems = [
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/d705e2e96688f89670a564256ed99bb6ddb16d1afba99fa7e635e38d8b91819b?apiKey=729dc09cd15c473da7916659c4854519&", text: "Usuarios", to: "#", onClick: handleOpenOpcionUsuarioModal },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f0324d01f8677df18c7ac2ee1f4378e9edfab3672350ddcef5bb0cf161d5c053?apiKey=729dc09cd15c473da7916659c4854519&", text: "Materias", to: "/materias" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/13194c62e6243b58128e558d9e18d78ba8edbf3ee9dabef5b1dde03255ce2969?apiKey=729dc09cd15c473da7916659c4854519&", text: "Secciones", to: "/secciones" },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/33aa67f9d2b8fbf550e7e6dc626e5059ea4ea6d45b16f60162fe967860fdb5f0?apiKey=729dc09cd15c473da7916659c4854519&", text: "Aulas", to: "/aulas" },
  ];

  const configItems = [
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/ee91485ea8d501d78cc6ed14461c7b2f646e5a30d6ad54f438de519ffc7ca9c0?apiKey=729dc09cd15c473da7916659c4854519&", text: "Configuraciones de la cuenta", to: "#", onClick: handleOpenConfiguracionCuenta },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/1e95206ad721e91628e23121cc7f244991dadefeaf6d2fd4211338cb865df7ff?apiKey=729dc09cd15c473da7916659c4854519&", text: "Preferencias de notificaciones", to: "#", onClick: handleOpenPreferenciaNotificaciones },
    { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fe043f0e7aaab8d1092d08b27f81f2a59e8d5a4b4f09b0e669a661c365311721?apiKey=729dc09cd15c473da7916659c4854519&", text: "Logout", to: "#", onClick: handleOpenLogoutModal },
  ];

  return (
    <>
      <aside className={styles.sidebar}>
        <nav className={styles.sidebarNav}>
          <img loading="lazy" src={logoImage} className={styles.sidebarLogo} alt="Logo" />
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/1ffb73d9899b17781ffac437db811d6f659136ecabaaad3f305769b7fae1e11b?apiKey=729dc09cd15c473da7916659c4854519&" className={styles.sidebarDivider} alt="" />
          <SidebarItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/12267cf220e9d643d85a3ec73c6942b6a1b06f1755d681f959ec52f87fbaf03c?apiKey=729dc09cd15c473da7916659c4854519&" text="Dashboard" to="/AdminDashboard" isActive={true} />
          
          <div className={styles.sidebarSection}>
            <h2 className={styles.sidebarSectionTitle}>ACADEMIC</h2>
            {sidebarItems.map((item, index) => (
              <SidebarItem key={index} icon={item.icon} text={item.text} to={item.to} onClick={item.onClick} />
            ))}
            <h2 className={`${styles.sidebarSectionTitle} mt-40 max-md:mt-10`}>Configuración</h2>
            {configItems.map((item, index) => (
              <SidebarItem key={index} icon={item.icon} text={item.text} to={item.to} onClick={item.onClick} />
            ))}
          </div>
        </nav>
      </aside>
      <LogoutModal isVisible={isLogoutModalVisible} onClose={handleCloseLogoutModal} onConfirm={handleConfirmLogout} />
      {isOpcionUsuarioModalVisible && <OpcionUsuario onClose={handleCloseOpcionUsuarioModal} onCrearUsuario={handleOpenCrearUsuarioModal} />}
      {isCrearUsuarioModalVisible && <CrearUsuarioModal onClose={handleCloseCrearUsuarioModal} />}
      <PreferenciaNotificaciones isOpen={isPreferenciaNotificacionesVisible} onClose={handleClosePreferenciaNotificaciones} />
      <ConfiguracionCuenta isOpen={isConfiguracionCuentaVisible} onClose={handleCloseConfiguracionCuenta} />
    </>
  );
};

export default Sidebar;
