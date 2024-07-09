// Schedule.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Estilos/EstPaginas/Horario.css';
import Header from "../Componentes/Header.jsx"
import Sidebar from '../Componentes/Sidebar2.jsx';
import { useAuth } from "../Componentes/AutenticacionUsuario.jsx";

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
      return horario; // Devolvemos la cadena original si no se puede parsear
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

export function Horario() {
  const [scheduleData, setScheduleData] = useState([]);
  const { user } = useAuth();
  const days = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];

  const colors = ['lightpurple', 'lightblue', 'lightorange', 'lightgreen', 'lightpink', 'lightyellow', 'lightcyan'];

  useEffect(() => {
    const fetchHorario = async () => {
      try {
        const response = await axios.get(`http://localhost:5124/api/EstudianteMateriaApi/GetMateriasEstudiante/${user.id}/${user.periodoActual}`);
        const materias = response.data;
        const horario = materias.flatMap((materia, index) => {
          const horarioFormateado = formatearHorario(materia.horario);
          const dias = horarioFormateado.split(' de ')[0].split(' y ');
          const color = colors[index % colors.length]; // Asigna un color basado en el índice de la materia
          return dias.map(dia => ({
            day: dia.substring(0, 3).toUpperCase(),
            subject: `${materia.nombreMateria} - ${materia.codigoSeccion}`,
            time: horarioFormateado.split('de ')[1],
            color: color
          }));
        });
        setScheduleData(horario);
      } catch (error) {
        console.error('Error al obtener el horario:', error);
      }
    };

    if (user && user.id && user.periodoActual) {
      fetchHorario();
    }
  }, [user]);

  return (
    <div className="horario-page">
      <div className="container">
        <Header />
        <div className="main-content">
          <Sidebar />
          <div className="schedule-container">
            <div className="schedule-header">
              {days.map(day => (
                <div className="schedule-day" key={day}>{day}</div>
              ))}
            </div>
            <div className="schedule-body">
              {days.map(day => (
                <div className="schedule-column" key={day}>
                  {scheduleData.filter(item => item.day === day).map((item, index) => (
                    <div className={`schedule-item ${item.color}`} key={index}>
                      <div className="schedule-subject">{item.subject}</div>
                      <div className="schedule-time">{item.time}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}