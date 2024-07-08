import React, { useState } from 'react';
import styles from "../Estilos/EstComponentes/PreferenciaNotificaciones.module.css";

const PreferenciaNotificaciones = ({ isOpen, onClose }) => {
  const [generalNotification, setGeneralNotification] = useState(true);
  const [emailNotification, setEmailNotification] = useState(false);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
          <h2>Configuración de notificaciones</h2>
        </div>
        <div className={styles.notificationOptions}>
          <div className={styles.notificationItem}>
            <span>General Notification</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={generalNotification}
                onChange={() => setGeneralNotification(!generalNotification)}
                className={styles.switchInput}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          <div className={styles.notificationItem}>
            <span>Email</span>
            <label className={styles.switch}>
              <input
                type="checkbox"
                checked={emailNotification}
                onChange={() => setEmailNotification(!emailNotification)}
                className={styles.switchInput}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferenciaNotificaciones;
