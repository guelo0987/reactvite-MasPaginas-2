import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../Estilos/EstPaginas/Secciones.module.css';
import Header from '../Componentes/Header';
import Sidebar from '../Componentes/SidebarAdmin';

export function Secciones() {
  const [secciones, setSecciones] = useState([]);
  const [materiasFiltradas, setMateriasFiltradas] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
  const [aulaSeleccionada, setAulaSeleccionada] = useState('');
  const [aulas, setAulas] = useState([]);

  useEffect(() => {
    obtenerSecciones();
    obtenerAulas();
  }, []);

  const obtenerSecciones = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5124/api/SeccionApi', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSecciones(response.data);
      setMateriasFiltradas(response.data);
    } catch (error) {
      console.error('Error al obtener las secciones:', error);
    }
  };

  const obtenerAulas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5124/api/AulaApi', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAulas(response.data);
    } catch (error) {
      console.error('Error al obtener las aulas:', error);
    }
  };

  useEffect(() => {
    filtrarSecciones();
  }, [materiaSeleccionada, aulaSeleccionada]);

  const filtrarSecciones = () => {
    let seccionesFiltradas = secciones;
    if (materiaSeleccionada) {
      seccionesFiltradas = seccionesFiltradas.filter(seccion => seccion.materias?.codigoMateria === materiaSeleccionada);
    }
    if (aulaSeleccionada) {
      seccionesFiltradas = seccionesFiltradas.filter(seccion => seccion.codigoAula === aulaSeleccionada);
    }
    setMateriasFiltradas(seccionesFiltradas);
  };

  return (
    <div className={styles.seccionesContainer}>
      <Header/>
      <Sidebar/>
      <h1 className={styles.heading}>Secciones</h1>
      <div className={styles.filtros}>
        <div className={styles.filtroGrupo}>
          <label className={styles.label}>Materia</label>
          <select 
            value={materiaSeleccionada} 
            onChange={(e) => setMateriaSeleccionada(e.target.value)}
            className={styles.select}
          >
            <option value="">Todas</option>
            {[...new Set(secciones.map(seccion => seccion.materias?.codigoMateria).filter(Boolean))].map(codigoMateria => (
              <option key={codigoMateria} value={codigoMateria}>{codigoMateria}</option>
            ))}
          </select>
        </div>
        <div className={styles.filtroGrupo}>
          <label className={styles.label}>Aula</label>
          <select 
            value={aulaSeleccionada} 
            onChange={(e) => setAulaSeleccionada(e.target.value)}
            className={styles.select}
          >
            <option value="">Todas</option>
            {aulas.map(aula => (
              <option key={aula.codigoAula} value={aula.codigoAula}>{aula.codigoAula}</option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.tablaContainer}>
        <h2>Secciones</h2>
        <table className={styles.seccionesTabla}>
          <thead>
            <tr>
              <th>Código Sección</th>
              <th>Código Materia</th>
              <th>Código Aula</th>
              <th>Horario</th>
              <th>Cupo</th>
            </tr>
          </thead>
          <tbody>
            {materiasFiltradas.map(seccion => (
              <tr key={seccion.codigoSeccion}>
                <td>{seccion.codigoSeccion}</td>
                <td>{seccion.materias?.codigoMateria}</td>
                <td>{seccion.codigoAula || 'No asignada'}</td>
                <td>{seccion.horario}</td>
                <td>{seccion.cupo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Secciones;
