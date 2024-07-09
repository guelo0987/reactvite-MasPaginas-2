import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../Estilos/EstPaginas/EstudianteAgregarRetirar.module.css';
import Header from '../Componentes/Header';
import Sidebar from '../Componentes/Sidebar2';
import { useAuth } from "../Componentes/AutenticacionUsuario.jsx";

export function EstudianteRetirarMaterias() {
  const [materias, setMaterias] = useState([]);
  const [filteredMaterias, setFilteredMaterias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  const formatearHorario = (horario) => {
    if (!horario) return 'No disponible';
    if (typeof horario === 'string' && !horario.startsWith('[')) {
      return horario;
    }
    let horarioParsed;
    try {
      horarioParsed = JSON.parse(horario);
    } catch (error) {
      console.error('Error al parsear el horario:', error);
      return horario;
    }
    if (Array.isArray(horarioParsed)) {
      return horarioParsed.map(h => `${h.dia} ${h.horaInicio} - ${h.horaFin}`).join(', ');
    }
    return 'Formato de horario no reconocido';
  };

  useEffect(() => {
    fetchMateriasInscritas();
  }, []);

  useEffect(() => {
    const filtered = materias.filter(materia =>
      materia.nombreMateria.toLowerCase().includes(searchTerm.toLowerCase()) || 
      materia.codigoSeccion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMaterias(filtered);
  }, [searchTerm, materias]);

  const fetchMateriasInscritas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      if (!user.id || !user.periodoActual) {
        throw new Error('Información del usuario incompleta');
      }

      const response = await axios.get(
        `http://localhost:5124/api/EstudianteMateriaApi/GetMateriasEstudiante/${user.id}/${user.periodoActual}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log('Materias inscritas:', response.data);
      setMaterias(response.data);
      setFilteredMaterias(response.data);
    } catch (error) {
      console.error('Error al obtener las materias inscritas:', error);
      setMessage('Error al cargar las materias inscritas. Por favor, intente más tarde.');
    }
  };

  const handleCheckboxChange = (codigoSeccion) => {
    setMaterias(materias.map(materia =>
      materia.codigoSeccion === codigoSeccion ? { ...materia, seleccionada: !materia.seleccionada } : materia
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedMaterias = materias.filter(m => m.seleccionada);
    if (selectedMaterias.length > 0) {
      try {
        for (const materia of selectedMaterias) {
          const estudianteId = user.id;
          const seccionId = materia.codigoSeccion;

          console.log('Datos a enviar:', { estudianteId, seccionId });
          
          const response = await axios.delete(`http://localhost:5124/api/EstudianteMateriaApi/RemoveSeccion`, {
            params: { estudianteId, seccionId }
          });
          
          console.log('Respuesta del servidor:', response.data);
        }
        setMessage('Materias retiradas exitosamente');
        fetchMateriasInscritas(); // Recargar las materias después de retirar
      } catch (error) {
        console.error('Error al retirar materias:', error);
        if (error.response) {
          console.error('Datos de la respuesta de error:', error.response.data);
          console.error('Estado de la respuesta de error:', error.response.status);
          setMessage(`Error al retirar materias: ${error.response.data.message || error.message}`);
        } else {
          setMessage('Error al retirar materias. Por favor, intente nuevamente.');
        }
      }
    } else {
      setMessage('Por favor, selecciona al menos una materia para retirar');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className={styles.retirarMaterias}>
      <Header/>
      <Sidebar/>
      <h1 className={styles.title}>
        <span className={styles.icon}>📚</span>
        Retirar Materias
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
          <button type="submit" className={styles.removeButton}>
            Retirar materias
          </button>
        </div>
        {message && <div className={styles.message}>{message}</div>}
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Materia</th>
              <th>Sección</th>
              <th>Aula</th>
              <th>Edificio</th>
              <th>Horario</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaterias.map((materia, index) => (
              <tr key={materia.codigoSeccion || `materia-${index}`}>
                <td>
                  <input
                    type="checkbox"
                    checked={materia.seleccionada || false}
                    onChange={() => handleCheckboxChange(materia.codigoSeccion)}
                  />
                </td>
                <td>{materia.nombreMateria}</td>
                <td>{materia.codigoSeccion}</td>
                <td>{materia.aula}</td>
                <td>{materia.edificio}</td>
                <td>{formatearHorario(materia.horario)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </div>
  );
}
