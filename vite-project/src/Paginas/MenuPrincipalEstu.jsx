import React, { useState, useEffect } from 'react';
import Sidebar from '../Componentes/Sidebar2.jsx';
import Header from '../Componentes/Header.jsx';
import "../Estilos/EstPaginas/MenuPrincipalEstu.css"
import PhotoPerfil from '../assets/perfil sin foto.png';
import { useAuth } from "../Componentes/AutenticacionUsuario.jsx";
import axios from 'axios';

// Función auxiliar para formatear el horario
const formatearHorario = (horario) => {
  if (!horario) return 'No disponible';

  // Si el horario ya es una cadena formateada, la devolvemos tal cual
  if (typeof horario === 'string' && !horario.startsWith('[')) {
    return horario;
  }

  // Si es una cadena JSON, la parseamos
  let horarioArray;
  if (typeof horario === 'string') {
    try {
      horarioArray = JSON.parse(horario);
    } catch (error) {
      console.error('Error al parsear el horario:', error);
      return 'Error en formato de horario';
    }
  } else {
    horarioArray = horario;
  }

  if (!Array.isArray(horarioArray) || horarioArray.length === 0) {
    return 'No disponible';
  }

  const dias = horarioArray.map(h => h.dia).join(' y ');
  const horaInicio = horarioArray[0].horaInicio;
  const horaFin = horarioArray[0].horaFin;

  return `${dias} de ${horaInicio} a ${horaFin}`;
};

// Componente CourseCard actualizado
const CourseCard = ({ nombreMateria, codigoSeccion, profesor, aula, edificio, horario, color }) => (
  <div className="course-card" style={{ backgroundColor: color }}>
    <div className="course-card-content">
      <h2 className="course-card-title">{nombreMateria} - {codigoSeccion}</h2>
      <div className="course-card-details">
        <div className="course-card-detail"><span className="course-card-detail-label">Profesor:</span> {profesor}</div>
        <div className="course-card-detail"><span className="course-card-detail-label">Aula:</span> {aula}</div>
        <div className="course-card-detail"><span className="course-card-detail-label">Edificio:</span> {edificio}</div>
        <div className="course-card-detail"><span className="course-card-detail-label">Horario:</span> {formatearHorario(horario)}</div>
      </div>
    </div>
  </div>
);

const UserProfile = ({ user }) => (
  <div className="user-profile">
    <div className="user-profile-content">
      <img loading="lazy" src={PhotoPerfil} className="profile-avatar-landing" alt="" />
      <div className="user-profile-details">
        <h2 className="user-profile-title">Bienvenido, {user.nombreEstudiante}</h2>
        <div className="user-profile-detail"><span className="user-profile-detail-label">ID:</span> {user.id}</div>
        <div className="user-profile-detail"><span className="user-profile-detail-label">Correo:</span> {user.correoEstudiante}</div>
        <div className="user-profile-detail"><span className="user-profile-detail-label">Teléfono:</span> {user.telefonoEstudiante}</div>
        <div className="user-profile-detail"><span className="user-profile-detail-label">Dirección:</span> {user.direccionEstudiante}</div>
        <div className="user-profile-detail"><span className="user-profile-detail-label">Ciudad:</span> {user.ciudadEstudiante}</div>
        <div className="user-profile-detail"><span className="user-profile-detail-label">Fecha de Ingreso:</span> {new Date(user.fechaIngreso).toLocaleDateString()}</div>
        <div className="user-profile-detail"><span className="user-profile-detail-label">Créditos Aprobados:</span> {user.creditosAprobados}</div>
        <div className="user-profile-detail"><span className="user-profile-detail-label">Índice General:</span> {user.indiceGeneral}</div>
        <div className="user-profile-detail"><span className="user-profile-detail-label">Índice del Período:</span> {user.indicePeriodo}</div>
        <div className="user-profile-detail"><span className="user-profile-detail-label">Período Actual:</span> {user.periodoActual}</div>
        <div className="user-profile-detail"><span className="user-profile-detail-label">Condición Académica:</span> {user.condicionAcademica}</div>
      </div>
    </div>
  </div>
);

export function MenuPrincipal() {
  const { user } = useAuth();
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaterias = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5104/api/EstudianteMateriaApi/GetMateriasEstudiante/${user.id}/${user.periodoActual}`);
        console.log('Respuesta completa de la API:', response.data);
        const materiasData = Array.isArray(response.data) ? response.data : [];
        console.log('Primera materia:', materiasData[0]);
        setMaterias(materiasData);
      } catch (error) {
        console.error('Error al obtener las materias:', error);
        setError('Error al cargar las materias');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id && user.periodoActual) {
      fetchMaterias();
    } else {
      setLoading(false);
    }
  }, [user]);

  const colorCycle = [
    '#E1D2FF', '#FDE1AC', '#BAE5F5', '#CCEFBF', '#4ffff',
  ];
  
  return (
    <div className="my-component">
      <div className="layout">
        <Header />
        <Sidebar />
        <main className="main">
          <div className="main-content">
            {user && <UserProfile user={user} />}
            <section className="course-cards">
              {loading ? (
                <p>Cargando materias...</p>
              ) : error ? (
                <p>{error}</p>
              ) : materias.length > 0 ? (
                materias.map((materia, index) => {
                  console.log('Materia siendo renderizada:', materia);
                  const colorIndex = index % colorCycle.length;
                  return (
                    <CourseCard
                      key={materia.codigoSeccion || index}
                      nombreMateria={materia.nombreMateria || 'Sin nombre'}
                      codigoSeccion={materia.codigoSeccion || 'N/A'}
                      profesor={materia.profesor || 'Sin asignar'}
                      aula={materia.aula || 'N/A'}
                      edificio={materia.edificio || 'N/A'}
                      horario={materia.horario}
                      color={colorCycle[colorIndex]}
                    />
                  );
                })
              ) : (
                <p>No hay materias para mostrar.</p>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}