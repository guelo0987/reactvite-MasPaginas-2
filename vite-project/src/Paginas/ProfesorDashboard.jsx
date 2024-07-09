import React, { useState, useEffect } from "react";
import axios from 'axios';
import Sidebar from "../Componentes/SibarProfesor.jsx";
import Header from "../Componentes/Header.jsx";
import styles from "../Estilos/EstPaginas/ProfesorDashboard.module.css";
import PhotoPerfil from '../assets/perfil sin foto.png';
import { useAuth } from "../Componentes/AutenticacionUsuario.jsx";

export function ProfesorDashboard() {
    const { user } = useAuth();
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMaterias = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No se encontró el token de autenticación');
                }
                const response = await axios.get(`http://localhost:5124/api/MateriaDocenteApi/GetMateriasYSeccionesPorDocente/${user.codigoDocente}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log('Respuesta de la API:', response.data);
                setMaterias(response.data);
            } catch (error) {
                console.error('Error al obtener las materias:', error);
                setError('Error al cargar las materias: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.codigoDocente) {
            fetchMaterias();
        } else {
            setLoading(false);
        }
    }, [user]);

    const formatearHorario = (horario) => {
        if (!horario) return 'No disponible';
        try {
            const horarioParsed = JSON.parse(horario);
            return horarioParsed.map(h => `${h.dia} ${h.horaInicio} - ${h.horaFin}`).join(', ');
        } catch (error) {
            console.error('Error al parsear el horario:', error);
            return horario;
        }
    };

    return (
        <div className={styles.profesorDashboard}>
            <Sidebar />
            <div className={styles.mainContent}>
                <Header />
                <div className={styles.userInfo}>
                    <img src={PhotoPerfil} alt="Profile" className={styles.profileImage} />
                    <div className={styles.userDetails}>
                        <h2 className={styles.userProfileTitle}>Bienvenido, {user.nombreDocente}</h2>
                        <div className={styles.userProfileDetail}><span className={styles.userProfileDetailLabel}>Código Docente:</span> {user.codigoDocente}</div>
                        <div className={styles.userProfileDetail}><span className={styles.userProfileDetailLabel}>Nombre:</span> {user.nombreDocente}</div>
                        <div className={styles.userProfileDetail}><span className={styles.userProfileDetailLabel}>Correo:</span> {user.correoDocente}</div>
                        <div className={styles.userProfileDetail}><span className={styles.userProfileDetailLabel}>Teléfono:</span> {user.telefonoDocente}</div>
                        <div className={styles.userProfileDetail}><span className={styles.userProfileDetailLabel}>Sexo:</span> {user.sexoDocente}</div>
                    </div>
                </div>
                <div className={styles.dashboardContent}>
                    <div className={styles.asignaturasSection}>
                        <h2>Asignaturas Impartidas</h2>
                        {loading ? (
                            <p>Cargando materias...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : materias.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Materia</th>
                                        <th>Código</th>
                                        <th>Sección</th>
                                        <th>Horario</th>
                                        <th>Aula</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {materias.map((materia, index) => (
                                        <tr key={index}>
                                            <td>{materia.nombreMateria}</td>
                                            <td>{materia.codigoMateria}</td>
                                            <td>{materia.codigoSeccion}</td>
                                            <td>{formatearHorario(materia.horario)}</td>
                                            <td>{materia.codigoAula}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No se encontraron materias asignadas.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}