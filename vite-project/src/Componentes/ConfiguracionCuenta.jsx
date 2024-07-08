import React, { useState } from 'react';
import styles from "../Estilos/EstComponentes/ConfiguracionCuenta.module.css";

const ConfiguracionCuenta = ({ isOpen, onClose }) => {
  const [language, setLanguage] = useState('es');
  const [showCalendarEvents, setShowCalendarEvents] = useState(true);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.modalBody}>
          <h2 className={styles.sectionTitle}>Idioma</h2>
          <div className={styles.languageOptions}>
            <div className={styles.languageOption}>
              <span>Español (ES)</span>
              <input
                type="radio"
                name="language"
                checked={language === 'es'}
                onChange={() => setLanguage('es')}
                className={styles.radioInput}
              />
            </div>
            <div className={styles.languageOption}>
              <span>English (USA)</span>
              <input
                type="radio"
                name="language"
                checked={language === 'en'}
                onChange={() => setLanguage('en')}
                className={styles.radioInput}
              />
            </div>
          </div>

          <h2 className={styles.sectionTitle}>Calendario</h2>
          <div className={styles.calendarOption}>
            <span>Mostrar Eventos en Calendario</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={showCalendarEvents}
                onChange={() => setShowCalendarEvents(!showCalendarEvents)}
                className={styles.switchInput}
              />
              <span className={styles.slider}></span>
            </label>
          </div>

          <div className={styles.supportOptions}>
            <button className={styles.supportButton}>
              <i className={`${styles.iconHelp} iconHelp`}></i> Help & Support
            </button>
            <button className={styles.supportButton}>
              <i className={`${styles.iconContact} iconContact`}></i> Contact us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionCuenta;
