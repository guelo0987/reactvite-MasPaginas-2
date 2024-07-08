import React from "react";
import Sidebar from '../Componentes/Sidebar2.jsx';
import Header from '../Componentes/Header.jsx';

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import pdfFile from '../Doc/pensum-IMec.pdf'; // Ajusta la ruta según la ubicación de tu archivo PDF


export function PensumCarrera() {
  return (
    <div>
      <Header />
      <Sidebar />
      <h1>Pensum Carrera</h1>
      <div style={{ width: '100%', maxWidth: '800px', margin: 'auto' }}>
        <Document file={pdfFile}>
          <Page pageNumber={1} />
        </Document>
      </div>
    </div>
  );
}
