import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../Estilos/EstPaginas/PensumCarreraViewer.module.css";
import Header from '../Componentes/Header';
import Sidebar from '../Componentes/Sidebar2';
import { useAuth } from "../Componentes/AutenticacionUsuario.jsx";

export function PensumCarreraViewer() {
    const [materias, setMaterias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.carreraId) {
            fetchMaterias(user.carreraId);
        } else {
            setLoading(false);
            setError('No se pudo obtener la información de la carrera del usuario');
        }
    }, [user]);

    const fetchMaterias = async (carreraId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5104/api/CarreraMateriaApi/GetMateriasByCarrera/${carreraId}`);
            setMaterias(response.data);
        } catch (error) {
            console.error('Error al obtener las materias:', error);
            setError('Error al cargar las materias');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pensumCarrera}>
            <Header/>
            <Sidebar/>
            <h1 className={styles.mainTitle}>Pensum de tu Carrera</h1>
            {loading && <p>Cargando materias...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {!loading && !error && materias.length > 0 && (
                <>
                    <h2 className={styles.sectionTitle}>Materias de la Carrera</h2>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Créditos</th>
                                <th>Área Académica</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materias.map(materia => (
                                <tr key={materia.codigoMateria}>
                                    <td>{materia.codigoMateria}</td>
                                    <td>{materia.nombreMateria}</td>
                                    <td>{materia.tipoMateria}</td>
                                    <td>{materia.creditosMateria}</td>
                                    <td>{materia.areaAcademica}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
            {!loading && !error && materias.length === 0 && (
                <p>No se encontraron materias para esta carrera.</p>
            )}
        </div>
    );
}

export default PensumCarreraViewer;