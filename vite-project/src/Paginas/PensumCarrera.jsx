import React from 'react';
import styles from './PensumCarrera.module.css'; // Importar estilos CSS Modules
import pensumIMecPDF from '../Doc/PensumIDS.pdf'; // Ruta al archivo PDF
import Header from '../Componentes/Header';
import Sidebar from '../Componentes/Sidebar2';

export function PensumCarrera() {
  return (
    
    <div className={styles.container}>
      <Header/>
      <Sidebar/>
      <h1 className={styles.title}>Pensum de Carrera</h1>
      <embed className={styles.pdfEmbed} src={pensumIMecPDF} type="application/pdf" />
    </div>
  );
}
