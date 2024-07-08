import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../Estilos/EstPaginas/EstudianteAgregarRetirar.module.css';
import Header from '../Componentes/Header';
import Sidebar from '../Componentes/Sidebar2';
import { useAuth } from "../Componentes/AutenticacionUsuario.jsx";

export function EstudianteAgregarMaterias() {
  const [materias, setMaterias] = useState([]);
  const [filteredMaterias, setFilteredMaterias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const formatearHorario = (horario) => {
    if (!horario) return 'No disponible';

    // Si el horario ya es una cadena formateada, la devolvemos tal cual
    if (typeof horario === 'string' && !horario.startsWith('[')) {
      return horario;
    }

    let horarioParsed;
    try {
      horarioParsed = typeof horario === 'string' ? JSON.parse(horario) : horario;
    } catch (error) {
      console.error('Error al parsear el horario:', error);
      // Si no se puede parsear como JSON, devolvemos la cadena original
      return horario;
    }

    if (!Array.isArray(horarioParsed) || horarioParsed.length === 0) {
      return 'No disponible';
    }

    return horarioParsed.map(h => `${h.dia} ${h.horaInicio} - ${h.horaFin}`).join(', ');
  };

  useEffect(() => {
    fetchMaterias();
  }, []);

  useEffect(() => {
    const filtered = materias.filter(materia =>
      materia.materias?.nombreMateria?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      materia.seccions?.codigoSeccion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMaterias(filtered);
  }, [searchTerm, materias]);

  const fetchMaterias = async () => {
    try {
      const response = await axios.get('http://localhost:5104/api/MateriaDocenteApi');
      console.log('Datos recibidos de la API:', response.data);
      setMaterias(response.data);
      setFilteredMaterias(response.data);
    } catch (error) {
      console.error('Error al obtener las materias:', error);
      setMessage('Error al cargar las materias. Por favor, intente más tarde.');
    }
  };

  const handleCheckboxChange = (id) => {
    setMaterias(materias.map(materia =>
      materia.seccionId === id ? { ...materia, seleccionada: !materia.seleccionada } : materia
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedMaterias = materias.filter(m => m.seleccionada);
    if (selectedMaterias.length > 0) {
      try {
        for (const materia of selectedMaterias) {
          const estudianteId = user.id; // Asegúrate de que user.id sea el ID del estudiante
          const seccionId = materia.seccionId;

          console.log('Datos a enviar:', { estudianteId, seccionId });
          
          const response = await axios.post(`http://localhost:5104/api/EstudianteMateriaApi/SelectSeccion?estudianteId=${estudianteId}&seccionId=${seccionId}`);
          
          console.log('Respuesta del servidor:', response.data);
        }
        setMessage('Materias seleccionadas exitosamente');
        fetchMaterias(); // Recargar las materias después de agregar
      } catch (error) {
        console.error('Error al seleccionar materias:', error);
        if (error.response) {
          console.error('Datos de la respuesta de error:', error.response.data);
          console.error('Estado de la respuesta de error:', error.response.status);
          setMessage(`Error al seleccionar materias: ${error.response.data.message || error.message}`);
        } else {
          setMessage('Error al seleccionar materias. Por favor, intente nuevamente.');
        }
      }
    } else {
      setMessage('Por favor, selecciona al menos una materia');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className={styles.agregarMaterias}>
      <Header/>
      <Sidebar/>
      <h1 className={styles.title}>
        <span className={styles.icon}>📚</span>
        Agregar Materias
      </h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.filters}>
          <div className={styles.searchWrapper}>
            <label htmlFor="materia">Buscar Materia:</label>
            <input
              type="text"
              id="materia"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              placeholder="Buscar materia..."
            />
          </div>
          <button type="submit" className={styles.addButton}>
            Agregar materias
          </button>
        </div>
        {message && <div className={styles.message}>{message}</div>}
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Materia</th>
              <th>Sección</th>
              <th>Profesor</th>
              <th>Aula</th>
              <th>Horario</th>
              <th>Cupo</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterias.map((materia) => (
              <tr key={materia.seccionId}>
                <td>
                  <input
                    type="checkbox"
                    checked={materia.seleccionada || false}
                    onChange={() => handleCheckboxChange(materia.seccionId)}
                  />
                </td>
                <td>{materia.materias?.nombreMateria || 'No disponible'}</td>
                <td>{materia.seccions?.codigoSeccion}</td>
                <td>{materia.docentes?.nombreDocente || 'No asignado'}</td>
                <td>{materia.seccions?.codigoAula}</td>
                <td>{formatearHorario(materia.seccions?.horario)}</td>
                <td>{materia.seccions?.cupo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </div>
  );
}