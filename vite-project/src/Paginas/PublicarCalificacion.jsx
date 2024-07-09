import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Componentes/SibarProfesor.jsx';
import Header from '../Componentes/Header.jsx';
import styles from '../Estilos/EstPaginas/PublicarNota.module.css';
import { useAuth } from "../Componentes/AutenticacionUsuario.jsx";

export function PublicarNota() {
    const { user } = useAuth();
    const [materias, setMaterias] = useState([]);
    const [selectedMateria, setSelectedMateria] = useState('');
    const [selectedSeccion, setSelectedSeccion] = useState('');
    const [estudiantes, setEstudiantes] = useState([]);
    const [tipoCalificacion, setTipoCalificacion] = useState('Medio Término');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchMaterias();
    }, [user]);

    const fetchMaterias = async () => {
        try {
            const response = await axios.get(`http://localhost:5124/api/MateriaDocenteApi/GetMateriasYSeccionesPorDocente/${user.codigoDocente}`);
            setMaterias(response.data);
        } catch (error) {
            console.error('Error al obtener las materias:', error);
            setErrorMessage('Error al cargar las materias');
        }
    };

    const handleMateriaChange = (e) => {
        setSelectedMateria(e.target.value);
        setSelectedSeccion('');
        setEstudiantes([]);
    };

    const handleSeccionChange = (e) => {
        setSelectedSeccion(e.target.value);
        fetchEstudiantes(e.target.value);
    };

    const fetchEstudiantes = async (seccionId) => {
        try {
            const response = await axios.get(`http://localhost:5124/api/MateriaDocenteApi/GetEstudiantes/${user.codigoDocente}/${selectedMateria}/${seccionId}`);
            setEstudiantes(response.data);
        } catch (error) {
            console.error('Error al obtener los estudiantes:', error);
            setErrorMessage('Error al cargar los estudiantes');
        }
    };

    const handleCalificacionChange = (estudianteId, value) => {
        const updatedEstudiantes = estudiantes.map(estudiante => {
            if (estudiante.id === estudianteId) {
                return {
                    ...estudiante,
                    [tipoCalificacion === 'Medio Término' ? 'calificacionMedioTermino' : 'calificacionFinal']: value
                };
            }
            return estudiante;
        });
        setEstudiantes(updatedEstudiantes);
    };

    const handlePublicarNotas = async () => {
        try {
            for (const estudiante of estudiantes) {
                const calificacionData = {};
                if (tipoCalificacion === 'Medio Término') {
                    calificacionData.calificacionMedioTermino = estudiante.calificacionMedioTermino;
                } else {
                    calificacionData.calificacionFinal = estudiante.calificacionFinal;
                }
                console.log('Enviando datos:', calificacionData); // Para depuración
                const response = await axios.put(`http://localhost:5124/api/MateriaDocenteApi/EditCalificacion/${estudiante.id}/${selectedMateria}/${selectedSeccion}`, calificacionData);
                console.log('Respuesta del servidor:', response.data); // Para depuración
            }
            setSuccessMessage('Calificaciones publicadas exitosamente');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Error al publicar las calificaciones:', error.response?.data || error.message);
            setErrorMessage('Error al publicar las calificaciones: ' + (error.response?.data || error.message));
        }
    };

    return (
        <div className={styles['publicar-nota-page']}>
            <Header />
            <div className={styles['main-content']}>
                <Sidebar />
                <div className={styles['content-area']}>
                    <h1>Publicar Calificaciones</h1>
                    <div className={styles['filters']}>
                        <div className={styles['filter-item']}>
                            <label htmlFor="materia">Materia</label>
                            <select id="materia" value={selectedMateria} onChange={handleMateriaChange}>
                                <option value="">Seleccione una materia</option>
                                {materias.map(materia => (
                                    <option key={materia.codigoMateria} value={materia.codigoMateria}>
                                        {materia.nombreMateria}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles['filter-item']}>
                            <label htmlFor="seccion">Sección</label>
                            <select id="seccion" value={selectedSeccion} onChange={handleSeccionChange}>
                                <option value="">Seleccione una sección</option>
                                {materias.filter(m => m.codigoMateria === selectedMateria).map(materia => (
                                    <option key={materia.codigoSeccion} value={materia.codigoSeccion}>
                                        {materia.codigoSeccion}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles['filter-item']}>
                            <label htmlFor="tipoCalificacion">Tipo de Calificación</label>
                            <select id="tipoCalificacion" value={tipoCalificacion} onChange={(e) => setTipoCalificacion(e.target.value)}>
                                <option value="Medio Término">Medio Término</option>
                                <option value="Final">Final</option>
                            </select>
                        </div>
                    </div>
                    {estudiantes.length > 0 && (
                        <div className={styles['estudiantes-table']}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Calificación {tipoCalificacion}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {estudiantes.map(estudiante => (
                                        <tr key={estudiante.id}>
                                            <td>{estudiante.id}</td>
                                            <td>{estudiante.nombreEstudiante}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={tipoCalificacion === 'Medio Término' ? estudiante.calificacionMedioTermino : estudiante.calificacionFinal}
                                                    onChange={(e) => handleCalificacionChange(estudiante.id, e.target.value)}
                                                    min="0"
                                                    max="100"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button onClick={handlePublicarNotas} className={styles['publicar-button']}>
                                Publicar Notas de {tipoCalificacion}
                            </button>
                        </div>
                    )}
                    {successMessage && <div className={styles['success-message']}>{successMessage}</div>}
                    {errorMessage && <div className={styles['error-message']}>{errorMessage}</div>}
                </div>
            </div>
        </div>
    );
}