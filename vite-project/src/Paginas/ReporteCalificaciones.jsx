import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from "../Componentes/AutenticacionUsuario.jsx";
import Header from '../Componentes/Header.jsx';
import Sidebar from '../Componentes/Sidebar2.jsx';
import styles from '../Estilos/EstPaginas/ReporteCalificaciones.module.css';

export function ReporteCalificaciones() {
    const { user } = useAuth();
    const [calificaciones, setCalificaciones] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [year, setYear] = useState('2023');
    const [period, setPeriod] = useState('NOV-ENE');
    const [qualificationType, setQualificationType] = useState('Medio Termino');

    const years = ['2023', '2024', '2025'];
    const periods = ['AGO-OCT', 'NOV-ENE', 'FEB-ABR', 'MAY-JUL'];

    const fetchCalificaciones = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `http://localhost:5104/api/EstudianteMateriaApi/GetCalificacionesEstudiante/${user.id}/${year}-${period}/${qualificationType}`;
            const response = await axios.get(url);
            console.log('Datos recibidos:', response.data);
            console.log('Calificaciones:', response.data.calificaciones);
            setCalificaciones(response.data);
        } catch (error) {
            console.error('Error al obtener las calificaciones:', error);
            setError('Error al cargar las calificaciones. Por favor, intente más tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchCalificaciones();
    };

    const calcularPromedioGeneral = (calificaciones) => {
        if (!calificaciones || calificaciones.length === 0) return 0;
        const total = calificaciones.reduce((sum, item) => sum + parseFloat(item.calificacion), 0);
        return total / calificaciones.length;
    };

    return (
        <div className={styles.reporteCalificacionesPage}>
            <Header />
            <div className={styles.mainContent}>
                <Sidebar />
                <div className={styles.contentArea}>
                    <h1 className={styles.pageTitle}>Reporte De Calificaciones</h1>
                    <form onSubmit={handleSubmit} className={styles.filters}>
                        <div className={styles.filterItem}>
                            <label htmlFor="year">Año</label>
                            <select id="year" value={year} onChange={(e) => setYear(e.target.value)}>
                                {years.map(y => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.filterItem}>
                            <label htmlFor="period">Periodo</label>
                            <select id="period" value={period} onChange={(e) => setPeriod(e.target.value)}>
                                {periods.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.filterItem}>
                            <label htmlFor="qualificationType">Calificaciones</label>
                            <select id="qualificationType" value={qualificationType} onChange={(e) => setQualificationType(e.target.value)}>
                                <option value="Medio Termino">Medio Termino</option>
                                <option value="Final">Final</option>
                            </select>
                        </div>
                        <button type="submit" className={styles.generateButton}>Generar reporte</button>
                    </form>
                    {loading && <p className={styles.loadingMessage}>Cargando calificaciones...</p>}
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    {calificaciones && (
                        <div className={styles.reportContent}>
                            <div className={styles.studentInfo}>
                                <h2>Información del Estudiante</h2>
                                <p><strong>Nombre:</strong> {calificaciones.estudiante.nombre}</p>
                                <p><strong>Carrera:</strong> {calificaciones.estudiante.carrera}</p>
                                <p><strong>ID:</strong> {calificaciones.estudiante.id}</p>
                            </div>
                            <div className={styles.calificacionesWrapper}>
                                <h2>Calificaciones</h2>
                                <div className={styles.tableWrapper}>
                                    <table className={styles.materiasTable}>
                                        <thead>
                                            <tr>
                                                <th>Materia</th>
                                                <th>Sección</th>
                                                <th>Créditos</th>
                                                <th>Profesor</th>
                                                <th>Calificación</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {calificaciones.calificaciones.map((item, index) => {
                                                console.log('Ítem de calificación:', item);
                                                return (
                                                    <tr key={index}>
                                                        <td>{item.nombreMateria}</td>
                                                        <td>{item.seccion}</td>
                                                        <td>{item.creditos}</td>
                                                        <td>{item.profesor}</td>
                                                        <td>{item.calificacion}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className={styles.summary}>
                                <h2>Resumen</h2>
                                <p><strong>Total de créditos:</strong> {calificaciones.totalCreditos}</p>
                                <p><strong>Promedio General:</strong> {calcularPromedioGeneral(calificaciones.calificaciones).toFixed(2)}</p>
                            </div>
                        </div>
                    )}
                    {!loading && !error && !calificaciones && (
                        <p className={styles.noDataMessage}>Seleccione un año y periodo para ver las calificaciones.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
