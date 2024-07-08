import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import "../Estilos/EstPaginas/ListaUsuarios.css"
import Header from '../Componentes/Header';
import Sidebar from '../Componentes/SidebarAdmin';

export function ListadoUsuarios() {
  const [carrera, setCarrera] = useState('');
  const [tipo, setTipo] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Token no encontrado. Por favor, inicie sesión.');
          return;
        }

        const decodedToken = jwtDecode(token);
        const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (userRole !== 'Admin') {
          setError('No tiene permiso para acceder a estos recursos.');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const estudiantesResponse = await axios.get('http://localhost:5104/api/Estudiante', config);
        const docentesResponse = await axios.get('http://localhost:5104/api/DocenteApi', config);

        const estudiantes = estudiantesResponse.data.map(est => ({
          id: est.id,
          nombre: est.nombreEstudiante,
          carrera: est.carreras ? est.carreras.nombreCarrera : 'N/A',
          fechaIngreso: est.fechaIngreso,
          tipo: 'Estudiante'
        }));

        const docentes = docentesResponse.data.map(doc => ({
          id: doc.codigoDocente,
          nombre: doc.nombreDocente,
          carrera: "N/A", // Si los docentes no tienen carrera asignada
          fechaIngreso: "N/A", // Si los docentes no tienen fecha de ingreso
          tipo: 'Profesor'
        }));

        setUsuarios([...estudiantes, ...docentes]);
      } catch (error) {
        setError('Error al cargar los usuarios. Por favor, intente nuevamente.');
      }
    };

    fetchUsuarios();
  }, []);

  const handleResetFilters = () => {
    setCarrera('');
    setTipo('');
  };

  const filteredUsuarios = usuarios.filter(usuario => (
    (carrera === '' || usuario.carrera.toLowerCase().includes(carrera.toLowerCase())) &&
    (tipo === '' || usuario.tipo === tipo)
  ));

  return (
    <div className="listado-usuarios">
      <Header />
      <Sidebar />
      <h1>Usuarios</h1>
      <div className="filtros">
        <div className="filtro">
          <label htmlFor="carrera">Carrera:</label>
          <input
            type="text"
            id="carrera"
            value={carrera}
            onChange={(e) => setCarrera(e.target.value)}
            placeholder="Todas"
          />
        </div>
        <div className="filtro">
          <label htmlFor="tipo">Tipo:</label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="Estudiante">Estudiante</option>
            <option value="Profesor">Profesor</option>
          </select>
        </div>
        <button className="btn-filtrar" onClick={handleResetFilters}>Limpiar</button>
      </div>
      {error && <div className="error-message">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Usuarios</th>
            <th>Carrera</th>
            <th>Fecha de Ingreso</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsuarios.map((usuario, index) => (
            <tr key={index}>
              <td>
                <i className="icono-usuario"></i>
                {usuario.nombre}
              </td>
              <td>{usuario.carrera}</td>
              <td>{usuario.fechaIngreso}</td>
              <td>{usuario.tipo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
