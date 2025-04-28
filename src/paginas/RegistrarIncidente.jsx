import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../componentes/NavBar/NavBar';
import './RegistrarIncidente.css';
import api from '../api';

function RegistrarIncidente() {
  const initialState = {
    titulo: "",
    descripcion: "",
    estado: "",
    ubicacion: "",
    estado_ubicacion: "",
    municipio: "",
    colonia: "",
    calle: "",
    categoria: "",
    imagen: null 
  };

  const [values, setValues] = useState(initialState);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // *** NUEVO: verificar sesión válida llamando al endpoint /v1/users/me ***
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await api.get('/v1/users/me');
      } catch (error) {
        // Si el token no es válido o falla la petición, limpiamos y redirigimos
        localStorage.removeItem('token');
        navigate('/');
      }
    };
    fetchUserData();
  }, [navigate]);

  const processImageFile = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      const reader = new FileReader();

      reader.onload = (e) => {
        setValues(prev => ({ ...prev, imagen: e.target.result }));
      };

      reader.onerror = (err) => {
        console.error("Error al leer el archivo:", err);
        setError("Hubo un error al procesar la imagen.");
        setValues(prev => ({ ...prev, imagen: null }));
        setFileName("");
      };
      reader.readAsDataURL(file);
    } else {
      console.warn("El archivo seleccionado no es una imagen válida.");
      setError("Por favor, selecciona un archivo de imagen válido.");
      setValues(prev => ({ ...prev, imagen: null }));
      setFileName("");
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragover" || e.type === "dragenter");
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setError(null);
      setSuccess(null);
      processImageFile(file);
    }
  }, [processImageFile]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setError(null);
      setSuccess(null);
      processImageFile(file);
    }
  }, [processImageFile]);

  const handleForm = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!values.titulo.trim() || !values.descripcion.trim()) {
      setError("El título y la descripción son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/v1/incidentes', values);
      console.log('Incidencia creada:', response.data);
      setSuccess('Incidencia registrada exitosamente!');
      setValues(initialState);
      setFileName("");
    } catch (err) {
      console.error('Error al crear incidencia:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Ocurrió un error al registrar la incidencia.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className='container'>
        <form className="inputs" onSubmit={handleForm}>
          <h1 className='header'>Ingresa los Datos de la Incidencia</h1>

          {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}
          {success && <div style={{ color: 'green', textAlign: 'center', marginBottom: '10px' }}>{success}</div>}

          <input
            className='input'
            type='text'
            name='titulo'
            value={values.titulo}
            placeholder='Ingresa el título'
            onChange={handleInputChange}
            required
          />
          <input
            className='input'
            type='text'
            name='descripcion'
            value={values.descripcion}
            placeholder='Ingresa la descripción'
            onChange={handleInputChange}
            required
          />

          <select
            className='input'
            name='estado'
            value={values.estado}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Selecciona el estado</option>
            <option value="no solucionado">no solucionado</option>
            <option value="solucionado">solucionado</option>
          </select>

          <input
            className='input'
            type='text'
            name='ubicacion'
            value={values.ubicacion}
            placeholder='Ingresa la ubicación'
            onChange={handleInputChange}
          />
          <input
            className='input'
            type='text'
            name='estado_ubicacion'
            value={values.estado_ubicacion}
            placeholder='Ingresa el estado de la ubicación'
            onChange={handleInputChange}
          />
          <input
            className='input'
            type='text'
            name='municipio'
            value={values.municipio}
            placeholder='Ingresa el municipio'
            onChange={handleInputChange}
          />
          <input
            className='input'
            type='text'
            name='colonia'
            value={values.colonia}
            placeholder='Ingresa la colonia'
            onChange={handleInputChange}
          />
          <input
            className='input'
            type='text'
            name='calle'
            value={values.calle}
            placeholder='Ingresa la calle'
            onChange={handleInputChange}
          />
          <input
            className='input'
            type='text'
            name='categoria'
            value={values.categoria}
            placeholder='Ingresa la categoría'
            onChange={handleInputChange}
          />

          <div className="file-upload-section">
            <div
              className={`drag-drop-zone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleFileInput}
                hidden
              />
              <p>Arrastra tu imagen aquí o</p>
              <label htmlFor="file-input" className="file-select-button">
                Seleccionar archivo
              </label>
              {values.imagen && (
                <div className="file-info">
                  <p>Archivo: {fileName}</p>
                  <div className="image-preview">
                    <img src={values.imagen} alt="Previsualización" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="button-container">
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar Incidente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrarIncidente;
