import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../Estilos/EstPaginas/AnadirEstudiante.module.css';
import Header from '../Componentes/Header';
import Sidebar from '../Componentes/SidebarAdmin';

export function AnadirEstudiante() {
  const [formData, setFormData] = useState({
    id: '',
    nombreEstudiante: '',
    direccionEstudiante: '',
    nacionalidad: 'Dominicana',
    sexoEstudiante: 'F',
    ciudadEstudiante: 'Santo Domingo',
    telefonoEstudiante: '',
    correoEstudiante: '',
    fechaIngreso: new Date().toISOString().split('T')[0],
    periodosCursados: 1,
    indiceGeneral: 4.00,
    indicePeriodo: 4.00,
    periodoActual: '',
    condicionAcademica: 'Activo',
    creditosAprobados: 0,
    contraseñaEstudiante: '',
    carreraId: '',
    alertas: '',
    rol: 'Estudiante'
  });

  const [carreras, setCarreras] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const response = await axios.get('http://localhost:5124/api/CarreraApi');
        setCarreras(response.data);
      } catch (error) {
        console.error('Error al cargar las carreras', error);
      }
    };
    fetchCarreras();
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
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Limpiar el error cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.id) newErrors.id = 'El ID es obligatorio';
    if (!formData.nombreEstudiante) newErrors.nombreEstudiante = 'El nombre es obligatorio';
    if (!formData.direccionEstudiante) newErrors.direccionEstudiante = 'La dirección es obligatoria';
    if (!formData.correoEstudiante) newErrors.correoEstudiante = 'El correo electrónico es obligatorio';
    if (!formData.telefonoEstudiante) newErrors.telefonoEstudiante = 'El teléfono es obligatorio';
    if (!formData.contraseñaEstudiante) newErrors.contraseñaEstudiante = 'La contraseña es obligatoria';
    if (!formData.carreraId) newErrors.carreraId = 'La carrera es obligatoria';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      try {
        await axios.post('http://localhost:5124/api/Estudiante/CreateEstudiante', formData, config);
        setShowSuccessMessage(true);
        // Resetear los campos del formulario
        setFormData({
          id: '',
          nombreEstudiante: '',
          direccionEstudiante: '',
          nacionalidad: 'Dominicana',
          sexoEstudiante: 'F',
          ciudadEstudiante: 'Santo Domingo',
          telefonoEstudiante: '',
          correoEstudiante: '',
          fechaIngreso: new Date().toISOString().split('T')[0],
          periodosCursados: 1,
          indiceGeneral: 4.00,
          indicePeriodo: 4.00,
          periodoActual: '',
          condicionAcademica: 'Activo',
          creditosAprobados: 0,
          contraseñaEstudiante: '',
          carreraId: '',
          alertas: '',
          rol: 'Estudiante'
        });
        setErrors({});
      } catch (error) {
        setErrors({ api: 'Error al enviar los datos. Por favor, intente nuevamente.' });
      }
    } else {
      console.log('Formulario inválido');
    }
  };

  return (
    <div className={styles["anadir-estudiante"]}>
      <Header />
      <Sidebar />
      <h2 className={styles.titulo}>Añadir Estudiante</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles["campo-completo"]}>
          <label>ID*</label>
          <input
            type="text"
            name="id"
            placeholder="ID"
            value={formData.id}
            onChange={handleChange}
            className={errors.id ? styles.error : ''}
          />
          {errors.id && <span className={styles["error-message"]}>{errors.id}</span>}
        </div>

        <div className={styles["campo-completo"]}>
          <label>Nombre completo*</label>
          <input
            type="text"
            name="nombreEstudiante"
            placeholder="Nombre Completo"
            value={formData.nombreEstudiante}
            onChange={handleChange}
            className={errors.nombreEstudiante ? styles.error : ''}
          />
          {errors.nombreEstudiante && <span className={styles["error-message"]}>{errors.nombreEstudiante}</span>}
        </div>

        <div className={styles["campo-grupo"]}>
          <div className={styles.campo}>
            <label>Correo electrónico*</label>
            <input
              type="email"
              name="correoEstudiante"
              placeholder="correo@universidad.com"
              value={formData.correoEstudiante}
              onChange={handleChange}
              className={errors.correoEstudiante ? styles.error : ''}
            />
            {errors.correoEstudiante && <span className={styles["error-message"]}>{errors.correoEstudiante}</span>}
          </div>
          <div className={styles.campo}>
            <label>Teléfono*</label>
            <input
              type="tel"
              name="telefonoEstudiante"
              placeholder="***-***-****"
              value={formData.telefonoEstudiante}
              onChange={handleChange}
              className={errors.telefonoEstudiante ? styles.error : ''}
            />
            {errors.telefonoEstudiante && <span className={styles["error-message"]}>{errors.telefonoEstudiante}</span>}
          </div>
          <div className={styles.campo}>
            <label>Género*</label>
            <select name="sexoEstudiante" value={formData.sexoEstudiante} onChange={handleChange}>
              <option value="F">Femenino</option>
              <option value="M">Masculino</option>
              <option value="O">Otro</option>
            </select>
          </div>
        </div>

        <div className={styles["campo-grupo"]}>
          <div className={styles["campo-largo"]}>
            <label>Dirección*</label>
            <input
              type="text"
              name="direccionEstudiante"
              placeholder="Dirección #, Sector"
              value={formData.direccionEstudiante}
              onChange={handleChange}
              className={errors.direccionEstudiante ? styles.error : ''}
            />
            {errors.direccionEstudiante && <span className={styles["error-message"]}>{errors.direccionEstudiante}</span>}
          </div>
          <div className={styles.campo}>
            <label>Ciudad*</label>
            <select name="ciudadEstudiante" value={formData.ciudadEstudiante} onChange={handleChange}>
              <option value="Santo Domingo">Santo Domingo</option>
              {/* Agrega más ciudades según sea necesario */}
            </select>
          </div>
          <div className={styles.campo}>
            <label>Nacionalidad*</label>
            <select name="nacionalidad" value={formData.nacionalidad} onChange={handleChange}>
              <option value="Dominicana">Dominicana</option>
              {/* Agrega más nacionalidades según sea necesario */}
            </select>
          </div>
        </div>

        <div className={styles["campo-completo"]}>
          <label>Carrera*</label>
          <select
            name="carreraId"
            value={formData.carreraId}
            onChange={handleChange}
            className={errors.carreraId ? styles.error : ''}
          >
            <option value="">Seleccione una carrera</option>
            {carreras.length > 0 && carreras.map(carrera => (
              <option key={carrera.carreraId} value={carrera.carreraId}>{carrera.nombreCarrera}</option>
            ))}
          </select>
          {errors.carreraId && <span className={styles["error-message"]}>{errors.carreraId}</span>}
        </div>

        <div className={styles["campo-completo"]}>
          <label>Contraseña*</label>
          <input
            type="password"
            name="contraseñaEstudiante"
            placeholder="Contraseña"
            value={formData.contraseñaEstudiante}
            onChange={handleChange}
            className={errors.contraseñaEstudiante ? styles.error : ''}
          />
          {errors.contraseñaEstudiante && <span className={styles["error-message"]}>{errors.contraseñaEstudiante}</span>}
        </div>

        <div className={styles.botones}>
          <button type="button" className={styles.cancelar}>Cancelar</button>
          <button type="submit" className={styles.registrar}>Registrar</button>
        </div>
        {showSuccessMessage && (
          <div className={styles.notification}>
            <p>¡Los datos se ingresaron correctamente!</p>
          </div>
        )}
        {errors.api && (
          <div className={styles["error-message"]}>
            <p>{errors.api}</p>
          </div>
        )}
      </form>
      <p className={styles.nota}>* estos campos son obligatorios</p>
    </div>
  );
}
