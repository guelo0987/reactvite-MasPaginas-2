import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Estilos/EstPaginas/Aulas.css';
import Header from '../Componentes/Header';
import Sidebar from '../Componentes/SidebarAdmin';

export function Aulas() {
  const [aulas, setAulas] = useState([]);
  const [nuevaAula, setNuevaAula] = useState({
    codigoAula: '',
    capacidad: '',
    tipoAula: '',
    edificio: ''
  });
  const [filtroEdificio, setFiltroEdificio] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos');

  useEffect(() => {
    cargarAulas();
  }, []);

  const cargarAulas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No se encontró el token de autorización');
        // Aquí podrías redirigir al usuario a la página de login
        return;
      }

      const response = await axios.get('http://localhost:5124/api/AulaApi', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setAulas(response.data);
    } catch (error) {
      console.error('Error al cargar las aulas:', error);
      if (error.response && error.response.status === 401) {
        console.error('Token no válido o expirado');
        // Aquí podrías manejar la renovación del token o redirigir al login
      }
      // Mostrar un mensaje de error al usuario
      alert('Error al cargar las aulas. Por favor, intente de nuevo más tarde.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaAula({ ...nuevaAula, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5124/api/AulaApi/CreateAula', nuevaAula, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setNuevaAula({ codigoAula: '', capacidad: '', tipoAula: '', edificio: '' });
      cargarAulas(); // Recargar las aulas después de crear una nueva
      alert('Aula creada con éxito');
    } catch (error) {
      console.error('Error al crear el aula:', error);
      alert('Error al crear el aula. Por favor, intente de nuevo.');
    }
  };

  const aulasFiltradas = aulas.filter(aula => 
    (filtroEdificio === 'Todos' || aula.edificio === filtroEdificio) &&
    (filtroTipo === 'Todos' || aula.tipoAula === filtroTipo)
  );

  return (
    <div className="aulasContainer">
      <Header />
      <Sidebar />
      <h2 className="aulasTitle">
        <span className="aulasIcon">&#9783;</span> Aulas
      </h2>

      <form onSubmit={handleSubmit} className="aulaForm">
        <input
          type="text"
          name="codigoAula"
          value={nuevaAula.codigoAula}
          onChange={handleInputChange}
          placeholder="Código del Aula (ej. GC301)"
          pattern="^[A-Z]{2}\d{3}$"
          required
        />
        <input
          type="number"
          name="capacidad"
          value={nuevaAula.capacidad}
          onChange={handleInputChange}
          placeholder="Capacidad"
        />
        <input
          type="text"
          name="tipoAula"
          value={nuevaAula.tipoAula}
          onChange={handleInputChange}
          placeholder="Tipo de Aula"
          maxLength="6"
        />
        <select
          name="edificio"
          value={nuevaAula.edificio}
          onChange={handleInputChange}
          required
        >
          <option value="">Seleccione un edificio</option>
          <option value="AJ">AJ - Arquitectura y Jardines</option>
          <option value="BZ">BZ</option>
          <option value="GC">GC - Galería Central</option>
          <option value="FD">FD - Facultad de Diseño</option>
        </select>
        <button type="submit">Crear Aula</button>
      </form>

      <div className="filters">
        <div className="filterGroup">
          <label>Edificio</label>
          <select value={filtroEdificio} onChange={(e) => setFiltroEdificio(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="AJ">AJ - Arquitectura y Jardines</option>
            <option value="BZ">BZ</option>
            <option value="GC">GC - Galería Central</option>
            <option value="FD">FD - Facultad de Diseño</option>
          </select>
        </div>
        <div className="filterGroup">
          <label>Tipo</label>
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
            <option value="Todos">Todos</option>
            <option value="Teoría">Teoría</option>
            <option value="Práctica">Práctica</option>
          </select>
        </div>
      </div>

      <div className="tableContainer">
        <table className="aulasTable">
          <thead>
            <tr>
              <th>Código Aula</th>
              <th>Capacidad</th>
              <th>Tipo de Aula</th>
              <th>Edificio</th>
            </tr>
          </thead>
          <tbody>
            {aulasFiltradas.map((aula) => (
              <tr key={aula.codigoAula}>
                <td>{aula.codigoAula}</td>
                <td>{aula.capacidad}</td>
                <td>{aula.tipoAula}</td>
                <td>{aula.edificio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Aulas;
