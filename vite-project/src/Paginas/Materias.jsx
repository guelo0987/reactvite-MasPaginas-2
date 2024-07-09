import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../Estilos/EstPaginas/Materias.module.css';
import Header from '../Componentes/Header';
import Sidebar from '../Componentes/SidebarAdmin';

export function Materias() {
  const [formData, setFormData] = useState({
    codigoMateria: '',
    areaAcademica: '',
    creditos: '1',
    tipo: 'Teoria',
    carrera: '',
    nombre: '',
    secciones: [{ seccion: 'SEC - 01', profesor: '', cupo: 30, aula: '' }],
    horario: [
      { dia: 'Lunes', horaInicio: '8:00am', horaFin: '10:00am' },
      { dia: 'Miércoles', horaInicio: '8:00am', horaFin: '10:00am' }
    ]
  });

  const [carreras, setCarreras] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.get('http://localhost:5124/api/CarreraApi', config);
        setCarreras(response.data);
      } catch (error) {
        console.error('Error al cargar las carreras', error);
        setApiError('Error al cargar las carreras. Por favor, intente más tarde.');
      }
    };

    const fetchDocentes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.get('http://localhost:5124/api/DocenteApi', config);
        setDocentes(response.data);
      } catch (error) {
        console.error('Error al cargar los docentes', error);
        setApiError('Error al cargar los docentes. Por favor, intente más tarde.');
      }
    };

    const fetchAulas = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.get('http://localhost:5124/api/AulaApi', config);
        setAulas(response.data);
      } catch (error) {
        console.error('Error al cargar las aulas', error);
        setApiError('Error al cargar las aulas. Por favor, intente más tarde.');
      }
    };

    fetchCarreras();
    fetchDocentes();
    fetchAulas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSeccionChange = (index, field, value) => {
    const newSecciones = [...formData.secciones];
    newSecciones[index][field] = value;
    setFormData(prevState => ({
      ...prevState,
      secciones: newSecciones
    }));
  };

  const addSeccion = () => {
    setFormData(prevState => ({
      ...prevState,
      secciones: [...prevState.secciones, { seccion: '', profesor: '', cupo: 30, aula: '' }]
    }));
  };

  const handleHorarioChange = (index, field, value) => {
    const newHorario = [...formData.horario];
    newHorario[index][field] = value;
    setFormData(prevState => ({
      ...prevState,
      horario: newHorario
    }));
  };

  const addHorario = () => {
    setFormData(prevState => ({
      ...prevState,
      horario: [...prevState.horario, { dia: '', horaInicio: '', horaFin: '' }]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.codigoMateria) newErrors.codigoMateria = 'El código de la materia es requerido';
    if (!formData.nombre) newErrors.nombre = 'El nombre de la materia es requerido';
    if (!formData.carrera) newErrors.carrera = 'Debe seleccionar una carrera';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    
    if (!validateForm()) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found');
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Verificar si el código de materia ya existe
      try {
        const checkResponse = await axios.get(`http://localhost:5124/api/MateriaApi/CheckCodigo/${formData.codigoMateria}`, config);
        if (checkResponse.data.exists) {
          setApiError(`El código de materia ${formData.codigoMateria} ya existe. Por favor, use un código diferente.`);
          return;
        }
      } catch (checkError) {
        console.error('Error al verificar el código de materia:', checkError);
        setApiError('Error al verificar el código de materia. Por favor, intente nuevamente.');
        return;
      }

      const materiaData = {
        codigoMateria: formData.codigoMateria,
        nombreMateria: formData.nombre,
        tipoMateria: formData.tipo,
        creditosMateria: parseInt(formData.creditos),
        areaAcademica: formData.areaAcademica
      };

      console.log('Request payload:', materiaData);

      // Crear materia
      const materiaResponse = await axios.post('http://localhost:5124/api/MateriaApi/CreateMateria', materiaData, config);
      const materiaId = materiaResponse.data.codigoMateria;

      // Asignar materia a carrera
      await axios.post('http://localhost:5124/api/CarreraMateriaApi/CreateCarreraMateria', {
        carreraId: parseInt(formData.carrera),
        codigoMateria: materiaId
      }, config);

      // Crear secciones y asignar profesores
      for (const seccion of formData.secciones) {
        const seccionData = {
          codigoSeccion: seccion.seccion, // Este es el ID de la sección creado por el usuario
          codigoMateria: materiaId,
          codigoAula: seccion.aula,
          horario: JSON.stringify(formData.horario),
          cupo: seccion.cupo
        };
        console.log('Datos de la sección a crear:', seccionData);

        try {
          // Crear la sección
          const seccionResponse = await axios.post('http://localhost:5124/api/SeccionApi/CreateSeccion', seccionData, config);
          console.log('Respuesta de la creación de sección:', seccionResponse.data);

          // Usar el ID de la sección creado por el usuario
          const seccionId = seccion.seccion;

          const materiaDocenteData = {
            codigoMateria: materiaId,
            seccionId: seccionId,
            docenteId: seccion.profesor
          };
          console.log('Datos de MateriaDocente a crear:', materiaDocenteData);

          // Crear la asociación MateriaDocente
          const materiaDocenteResponse = await axios.post('http://localhost:5124/api/MateriaDocenteApi/CreateMateriaDocente', materiaDocenteData, config);
          console.log('Respuesta de la creación de MateriaDocente:', materiaDocenteResponse.data);

        } catch (error) {
          console.error('Error al crear la sección o asignar el docente:', error);
          if (error.response) {
            console.error('Datos de la respuesta de error:', error.response.data);
            console.error('Estado de la respuesta de error:', error.response.status);
          }
          throw error;
        }
      }

      alert('Materia creada exitosamente con sus secciones y profesores asignados.');
      // Limpiar el formulario o redirigir según sea necesario
      
    } catch (error) {
      console.error('Error en el proceso de creación:', error);
      setApiError(`Error: ${error.message || 'Ocurrió un error desconocido'}`);
    }
  };

  return (
    <div className={styles.materias}>
      <Header />
      <Sidebar />
      <h2 className={styles.titulo}>Materias</h2>
      {apiError && <div className={styles.apiError}>{apiError}</div>}
      <form onSubmit={handleSubmit}>
        <div className={styles.fila}>
          <div className={styles.campo}>
            <label>Código de la Materia</label>
            <input
              type="text"
              name="codigoMateria"
              value={formData.codigoMateria}
              onChange={handleChange}
              placeholder="Código de la Materia (e.g., MAT123)"
            />
            {errors.codigoMateria && <span className={styles.error}>{errors.codigoMateria}</span>}
          </div>
          <div className={styles.campo}>
            <label>Área académica</label>
            <input
              type="text"
              name="areaAcademica"
              value={formData.areaAcademica}
              onChange={handleChange}
              placeholder="Área Académica"
            />
            {errors.areaAcademica && <span className={styles.error}>{errors.areaAcademica}</span>}
          </div>
          <div className={styles.campo}>
            <label>Créditos</label>
            <select name="creditos" value={formData.creditos} onChange={handleChange}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            {errors.creditos && <span className={styles.error}>{errors.creditos}</span>}
          </div>
          <div className={styles.campo}>
            <label>Tipo</label>
            <select name="tipo" value={formData.tipo} onChange={handleChange}>
              <option value="Teoria">Teoría</option>
              <option value="Practica">Práctica</option>
            </select>
            {errors.tipo && <span className={styles.error}>{errors.tipo}</span>}
          </div>
        </div>

        <div className={styles.fila}>
          <div className={styles.campo}>
            <label>Carrera</label>
            <select name="carrera" value={formData.carrera} onChange={handleChange}>
              <option value="">Seleccione una carrera</option>
              {carreras.map(carrera => (
                <option key={carrera.carreraId} value={carrera.carreraId}>{carrera.nombreCarrera}</option>
              ))}
            </select>
            {errors.carrera && <span className={styles.error}>{errors.carrera}</span>}
          </div>
        </div>

        <div className={styles.campoCompleto}>
          <label>Nombre:</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre de la Materia" />
          {errors.nombre && <span className={styles.error}>{errors.nombre}</span>}
        </div>

        <div className={styles.secciones}>
          <h3>Secciones y profesor encargado</h3>
          {formData.secciones.map((seccion, index) => (
            <div key={index} className={styles.fila}>
              <input
                type="text"
                value={seccion.seccion}
                onChange={(e) => handleSeccionChange(index, 'seccion', e.target.value)}
                placeholder="SEC - 01"
              />
              <select
                value={seccion.profesor}
                onChange={(e) => handleSeccionChange(index, 'profesor', e.target.value)}
              >
                <option value="">Seleccione un profesor</option>
                {docentes.map(docente => (
                  <option key={docente.codigoDocente} value={docente.codigoDocente}>{docente.nombreDocente}</option>
                ))}
              </select>
              <select
                value={seccion.aula}
                onChange={(e) => handleSeccionChange(index, 'aula', e.target.value)}
              >
                <option value="">Seleccione un aula</option>
                {aulas.map(aula => (
                  <option key={aula.codigoAula} value={aula.codigoAula}>{aula.codigoAula}</option>
                ))}
              </select>
              <input
                type="number"
                value={seccion.cupo}
                onChange={(e) => handleSeccionChange(index, 'cupo', e.target.value)}
                placeholder="Cupo"
              />
            </div>
          ))}
          <button type="button" onClick={addSeccion} className={styles.agregar}>Otra Sección</button>
        </div>

        <div className={styles.horario}>
          <h3>Horario</h3>
          <div className={`${styles.fila} ${styles.encabezado}`}>
            <div>Días</div>
            <div>Horas</div>
          </div>
          {formData.horario.map((horario, index) => (
            <div key={index} className={styles.fila}>
              <select
                value={horario.dia}
                onChange={(e) => handleHorarioChange(index, 'dia', e.target.value)}
              >
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
              </select>
              <div className={styles.horas}>
                <select
                  value={horario.horaInicio}
                  onChange={(e) => handleHorarioChange(index, 'horaInicio', e.target.value)}
                >
                  <option value="8:00am">8:00am</option>
                  <option value="9:00am">9:00am</option>
                  <option value="10:00am">10:00am</option>
                  {/* Agrega más horas según sea necesario */}
                </select>
                <span>hasta</span>
                <select
                  value={horario.horaFin}
                  onChange={(e) => handleHorarioChange(index, 'horaFin', e.target.value)}
                >
                  <option value="10:00am">10:00am</option>
                  <option value="11:00am">11:00am</option>
                  <option value="12:00pm">12:00pm</option>
                  {/* Agrega más horas según sea necesario */}
                </select>
              </div>
            </div>
          ))}
          <button type="button" onClick={addHorario} className={styles.agregar}>Agregar día</button>
        </div>

        <div className={styles.botones}>
          <button type="button" className={styles.cancelar}>Cancelar</button>
          <button type="submit" className={styles.registrar}>Registrar</button>
        </div>
      </form>
    </div>
  );
}           

export default Materias;
