import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from "../Estilos/EstPaginas/AnadirProfesor.module.css";
import Header from '../Componentes/Header';
import Sidebar from '../Componentes/SidebarAdmin';

export function AnadirProfesor() {
  const [formData, setFormData] = useState({
    codigoDocente: '',
    nombreDocente: '',
    correoDocente: '',
    telefonoDocente: '',
    sexoDocente: '',
    asignaturaId: '',
    seccionId: ''
  });

  const [asignaturas, setAsignaturas] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchAsignaturas = async () => {
      try {
        const response = await axios.get('http://localhost:5104/api/SeccionApi');
        const materias = response.data.reduce((acc, seccion) => {
          if (!acc[seccion.codigoMateria]) {
            acc[seccion.codigoMateria] = [];
          }
          acc[seccion.codigoMateria].push(seccion);
          return acc;
        }, {});
        setAsignaturas(Object.keys(materias));
        console.log("Asignaturas cargadas:", Object.keys(materias));
      } catch (error) {
        console.error('Error al cargar las asignaturas y secciones', error);
      }
    };
    fetchAsignaturas();
  }, []);

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000); // Ocultar mensaje después de 3 segundos
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  const handleAsignaturaChange = async (e) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      asignaturaId: value,
      seccionId: ''
    }));

    if (value) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const response = await axios.get(`http://localhost:5104/api/MateriaApi/${value}/Secciones`, config);
        setSecciones(response.data);
        console.log("Secciones cargadas:", response.data);
      } catch (error) {
        console.error('Error al cargar las secciones', error);
      }
    } else {
      setSecciones([]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.codigoDocente) newErrors.codigoDocente = 'El código del docente es obligatorio';
    if (!formData.nombreDocente) newErrors.nombreDocente = 'El nombre es obligatorio';
    if (!formData.correoDocente) newErrors.correoDocente = 'El correo es obligatorio';
    if (!formData.telefonoDocente) newErrors.telefonoDocente = 'El teléfono es obligatorio';
    if (!formData.sexoDocente) newErrors.sexoDocente = 'El género es obligatorio';
    if (!formData.asignaturaId) newErrors.asignaturaId = 'La asignatura es obligatoria';
    if (!formData.seccionId) newErrors.seccionId = 'La sección es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const docenteResponse = await axios.post('http://localhost:5104/api/DocenteApi/CreateDocente', {
          codigoDocente: formData.codigoDocente,
          nombreDocente: formData.nombreDocente,
          correoDocente: formData.correoDocente,
          telefonoDocente: formData.telefonoDocente,
          sexoDocente: formData.sexoDocente,
          contraseñaDocente: formData.codigoDocente // Establecer la contraseña como el código del docente
        }, config);

        await axios.post('http://localhost:5104/api/MateriaDocenteApi/CreateMateriaDocente', {
          docenteId: docenteResponse.data.codigoDocente,
          codigoMateria: formData.asignaturaId,
          seccionId: formData.seccionId
        }, config);

        setShowSuccessMessage(true);
        setFormData({
          codigoDocente: '',
          nombreDocente: '',
          correoDocente: '',
          telefonoDocente: '',
          sexoDocente: '',
          asignaturaId: '',
          seccionId: ''
        });
        setErrors({});
      } catch (error) {
        console.error('Error al enviar los datos', error);
        setErrors({ api: 'Error al enviar los datos. Por favor, intente nuevamente.' });
      }
    } else {
      console.log('Formulario con errores');
    }
  };

  return (
    <div className={styles["profesor-form-container"]}>
      <Header />
      <Sidebar />
      <h2 className={styles["profesor-title"]}>Añadir Profesor</h2>
      <form onSubmit={handleSubmit} className={styles["profesor-form"]}>
        {showSuccessMessage && (
          <div className={styles["notification"]}>
            <p>¡El profesor ha sido registrado exitosamente!</p>
          </div>
        )}
        <div className={styles["full-width-field"]}>
          <label className={styles["form-label"]}>Código del Docente*</label>
          <input
            className={`${styles["form-input"]} ${errors.codigoDocente ? styles.error : ''}`}
            type="text"
            name="codigoDocente"
            placeholder="Código del Docente"
            value={formData.codigoDocente}
            onChange={handleChange}
          />
          {errors.codigoDocente && <span className={styles["error-message"]}>{errors.codigoDocente}</span>}
        </div>
        <div className={styles["full-width-field"]}>
          <label className={styles["form-label"]}>Nombre completo*</label>
          <div className={styles["name-fields"]}>
            <input
              className={`${styles["form-input"]} ${errors.nombreDocente ? styles.error : ''}`}
              type="text"
              name="nombreDocente"
              placeholder="Nombre Completo"
              value={formData.nombreDocente}
              onChange={handleChange}
            />
          </div>
          {errors.nombreDocente && <span className={styles["error-message"]}>{errors.nombreDocente}</span>}
        </div>
        <div className={styles["field-group"]}>
          <div className={styles["field"]}>
            <label className={styles["form-label"]}>Correo electrónico*</label>
            <input
              className={`${styles["form-input"]} ${errors.correoDocente ? styles.error : ''}`}
              type="email"
              name="correoDocente"
              placeholder="correo@universidad.com"
              value={formData.correoDocente}
              onChange={handleChange}
            />
            {errors.correoDocente && <span className={styles["error-message"]}>{errors.correoDocente}</span>}
          </div>
          <div className={styles["field"]}>
            <label className={styles["form-label"]}>Teléfono*</label>
            <input
              className={`${styles["form-input"]} ${errors.telefonoDocente ? styles.error : ''}`}
              type="tel"
              name="telefonoDocente"
              placeholder="***-***-****"
              value={formData.telefonoDocente}
              onChange={handleChange}
            />
            {errors.telefonoDocente && <span className={styles["error-message"]}>{errors.telefonoDocente}</span>}
          </div>
          <div className={styles["field"]}>
            <label className={styles["form-label"]}>Género*</label>
            <select
              className={`${styles["form-select"]} ${errors.sexoDocente ? styles.error : ''}`}
              name="sexoDocente"
              value={formData.sexoDocente}
              onChange={handleChange}
            >
              <option value="">Seleccione un género</option>
              <option value="F">Femenino</option>
              <option value="M">Masculino</option>
              <option value="O">Otro</option>
            </select>
            {errors.sexoDocente && <span className={styles["error-message"]}>{errors.sexoDocente}</span>}
          </div>
        </div>
        <div className={styles["full-width-field"]}>
          <label className={styles["form-label"]}>Asignatura*</label>
          <select
            className={`${styles["form-select"]} ${errors.asignaturaId ? styles.error : ''}`}
            name="asignaturaId"
            value={formData.asignaturaId}
            onChange={handleAsignaturaChange}
          >
            <option value="">Seleccione una asignatura</option>
            {asignaturas.map(asignatura => (
              <option key={asignatura} value={asignatura}>{asignatura}</option>
            ))}
          </select>
          {errors.asignaturaId && <span className={styles["error-message"]}>{errors.asignaturaId}</span>}
        </div>
        <div className={styles["full-width-field"]}>
          <label className={styles["form-label"]}>Sección*</label>
          <select
            className={`${styles["form-select"]} ${errors.seccionId ? styles.error : ''}`}
            name="seccionId"
            value={formData.seccionId}
            onChange={handleChange}
            disabled={!formData.asignaturaId}
          >
            <option value="">Seleccione una sección</option>
            {formData.asignaturaId && secciones.length > 0 && secciones.map(seccion => (
              <option key={seccion.codigoSeccion} value={seccion.codigoSeccion}>{seccion.codigoSeccion}</option>
            ))}
          </select>
          {errors.seccionId && <span className={styles["error-message"]}>{errors.seccionId}</span>}
        </div>
        <div className={styles["button-group"]}>
          <button type="button" className={styles["cancel-button"]}>Cancelar</button>
          <button type="submit" className={styles["submit-button"]}>Registrar</button>
        </div>
      </form>
      <p className={styles["form-footnote"]}>* estos campos son obligatorios</p>
      {errors.api && (
        <div className={styles["error-message"]}>
          <p>{errors.api}</p>
        </div>
      )}
    </div>
  );
}
