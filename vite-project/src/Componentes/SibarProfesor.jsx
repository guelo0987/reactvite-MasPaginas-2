import React, { useState } from 'react';
import styles from '../Estilos/EstComponentes/Sidebar.module.css';
import logoImage from '../assets/logoUni.png';
import { Link, useNavigate } from 'react-router-dom';
import LogoutModal from '../Componentes/VentanaLogOut';
import PreferenciaNotificaciones from "../Componentes/PreferenciaNotificaciones";
import ConfiguracionCuenta from "../Componentes/ConfiguracionCuenta";

const SidebarItem = ({ icon, text, to, isActive = false, onClick, dashboard }) => (
  <Link to={to} className={`${styles.sidebarItem} ${isActive ? styles.sidebarItemActive : ''} ${dashboard ? styles.sidebarItemDashboard : ''}`} onClick={onClick}>
    <img loading="lazy" src={icon} className={styles.sidebarItemIcon} alt="" />
    <div className={styles.sidebarItemText}>{text}</div>
  </Link>
);

const Sidebar = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPreferenciaNotificacionesVisible, setPreferenciaNotificacionesVisible] = useState(false);
  const [isConfiguracionCuentaVisible, setConfiguracionCuentaVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleConfirmLogout = () => {
    setModalVisible(false);
    navigate('/logout');
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

  return (
    <>
      <aside className={styles.sidebar}>
        <nav className={styles.sidebarNav}>
          <img loading="lazy" src={logoImage} className={styles.sidebarLogo} alt="Logo" />
          <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/1ffb73d9899b17781ffac437db811d6f659136ecabaaad3f305769b7fae1e11b?apiKey=729dc09cd15c473da7916659c4854519&" className={styles.sidebarDivider} alt="" />
          
          {/* Dashboard */}
          <SidebarItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/6a812ed63d89ab65b3067df4fb476d1802ed9e33b87ab2e02774bc7160f1ddf3?apiKey=729dc09cd15c473da7916659c4854519&" text="Dashboard" to="/ProfesorDashboard" dashboard={true} />

          {/* Académico */}
          <div className={styles.sidebarSection}>
            <h2 className={styles.sidebarSectionTitle}>Académico</h2>
            <SidebarItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/7a26fafeb4a6624d9037e579936f0a47d9eb64f8dfef241ec94cb5772681e905?apiKey=729dc09cd15c473da7916659c4854519&" text="Calendario Académico" to="/CalendarioAcademico" />
            <SidebarItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/f0324d01f8677df18c7ac2ee1f4378e9edfab3672350ddcef5bb0cf161d5c053?apiKey=729dc09cd15c473da7916659c4854519&" text="Publicar Calificación" to="/PublicarNota" />
          </div>

          {/* Configuración */}
          <div className={styles.sidebarSection}>
            <h2 className={styles.sidebarSectionTitle}>Configuración</h2>
            <SidebarItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/1f232d4efed64b8abc429ee0b51c66cfc3489b87ef2a2ae5d6a225aca07b4f95?apiKey=729dc09cd15c473da7916659c4854519&" text="Configuraciones de la cuenta" to="#" onClick={handleOpenConfiguracionCuenta} />
            <SidebarItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/b6113ee9ca88d31becd19326d889da793c34d47074112926e65dd031fa456fcb?apiKey=729dc09cd15c473da7916659c4854519&" text="Preferencias de notificaciones" to="#" onClick={handleOpenPreferenciaNotificaciones} />
            <SidebarItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/9104e80a1919c81007c1b02275b427525b5332106a38a90b750e326be1ebca67?apiKey=729dc09cd15c473da7916659c4854519&" text="Logout" to="#" onClick={handleLogoutClick} />
          </div>
        </nav>
      </aside>
      <LogoutModal isVisible={isModalVisible} onClose={handleCloseModal} onConfirm={handleConfirmLogout} />
      {isPreferenciaNotificacionesVisible && <PreferenciaNotificaciones isOpen={isPreferenciaNotificacionesVisible} onClose={handleClosePreferenciaNotificaciones} />}
      {isConfiguracionCuentaVisible && <ConfiguracionCuenta isOpen={isConfiguracionCuentaVisible} onClose={handleCloseConfiguracionCuenta} />}
    </>
  );
};

export default Sidebar;
