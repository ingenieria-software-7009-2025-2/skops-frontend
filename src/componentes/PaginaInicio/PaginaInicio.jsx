import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import NavBar from '../NavBar/NavBar';
import './PaginaInicio.css';
import api from '../../api';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function PaginaInicio() {
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const [updatingItem, setUpdatingItem] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [fileName, setFileName] = useState('');
  const [updatedImage, setUpdatedImage] = useState(null);

  const mapRef = useRef(null);
  const ZOOM_LEVEL = 13;

  const handleSearch = async () => {
    if (!searchText.trim() || !filter) {
      setError('Por favor, ingresa un término de búsqueda y selecciona un filtro.');
      setSearchResults([]);
      setSearchPerformed(false);
      return;
    }
    setSearchResults([]);
    setError(null);
    setIsLoading(true);
    setSearchPerformed(true);
    let url = '';
    let params = {};
    try {
      switch (filter) {
        case 'titulo': url = '/v1/incidentes/buscar-titulo'; params = { titulo: searchText }; break;
        case 'municipio': url = '/v1/incidentes/buscar-municipios'; params = { municipio: searchText }; break;
        case 'categoria': url = '/v1/incidentes/buscar-categoria'; params = { categoria: searchText }; break;
        case 'estado': url = '/v1/incidentes/buscar-estado'; params = { estado: searchText }; break;
        default: throw new Error('Filtro no reconocido');
      }
      const response = await api.get(url, { params });
      if (filter === 'titulo') setSearchResults(response.data ? [response.data] : []);
      else setSearchResults(response.data || []);
    } catch (err) {
      setSearchResults([]);
      if (err.response) {
        if (err.response.status === 404) setError(`No se encontraron incidencias para "${searchText}" con filtro "${filter}".`);
        else if (err.response.status === 401) setError('No autorizado para realizar esta búsqueda.');
        else setError(`Error del servidor: ${err.response.status}. Intenta de nuevo.`);
      } else if (err.request) setError('No se pudo conectar con el servidor. Verifica tu conexión.');
      else setError(`Ocurrió un error: ${err.message || 'Error desconocido'}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartUpdate = (incidencia) => {
    const id = incidencia.id_incidente || incidencia.titulo;
    if (incidencia.estado === 'solucionado') {
      setUpdatingItem(id);
      setUpdateError('El incidente ya ha sido resuelto');
      return;
    }
    setUpdateError(null);
    setUpdatingItem(id);
  };

  const processImageFile = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => setUpdatedImage(e.target.result);
      reader.onerror = () => {
        setUpdateError('Hubo un error al procesar la imagen.');
        setUpdatedImage(null);
        setFileName('');
      };
      reader.readAsDataURL(file);
    } else {
      setUpdateError('Por favor, selecciona un archivo de imagen válido.');
      setUpdatedImage(null);
      setFileName('');
    }
  }, []);

  const handleUpdateSubmit = async (id) => {
    if (!updatedImage) {
      setUpdateError('Debes seleccionar una imagen antes de actualizar.');
      return;
    }
    try {
      const body = { imagen: updatedImage };
      const response = await api.put(`/v1/incidentes/${id}`, body);
      setSearchResults(prev => prev.map(item => item.id_incidente === id ? response.data : item));
      setUpdatingItem(null);
      setUpdatedImage(null);
      setFileName('');
      setUpdateError(null);
      setExpandedItems(prev => ({ ...prev, [id]: true }));
    } catch {
      setUpdateError('Error al actualizar el incidente. Intenta de nuevo.');
    }
  };

  useEffect(() => {
    Object.keys(expandedItems).forEach(id => {
      if (expandedItems[id] && mapRef.current) {
        setTimeout(() => {
          mapRef.current.invalidateSize();
        }, 200);
      }
    });
  }, [expandedItems]);

  return (
    <div>
      <NavBar />
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="search-controls-container">
          <input
            className="search-input" type="text"
            value={searchText} placeholder="Buscar por..."
            onChange={e => setSearchText(e.target.value)}
          />
          <div className="filter-group">
            <label htmlFor="filtro" className="filter-label">Filtrar por</label>
            <select id="filtro" className="filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="" disabled>Selecciona...</option>
              <option value="titulo">Título</option>
              <option value="municipio">Municipio</option>
              <option value="categoria">Categoría</option>
              <option value="estado">Estado</option>
            </select>
          </div>
          <button className="search-button" onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        <div className="results-container" style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px', background: '#f9f9f9' }}>
          <h2>Resultados de la Búsqueda</h2>
          {isLoading && <p>Buscando incidencias...</p>}
          {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
          {!isLoading && !error && searchPerformed && searchResults.length === 0 && <p>No se encontraron incidencias que coincidan con tu búsqueda.</p>}

          {!isLoading && !error && searchResults.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {searchResults.map(incidencia => {
                const id = incidencia.id_incidente || incidencia.titulo;
                const isExpanded = expandedItems[id];
                const posicion = incidencia.ubicacion
                  ? incidencia.ubicacion.split(',').map(coord => parseFloat(coord.trim()))
                  : null;

                return (
                  <div key={id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '5px', background: '#fff' }}>
                    <h3>{incidencia.titulo}</h3>
                    <p><strong>Categoría:</strong> {incidencia.categoria}</p>
                    <button onClick={() => toggleExpand(id)} style={{ marginBottom: '1rem' }}>
                      {isExpanded ? 'Ver menos ▲' : 'Ver más ▼'}
                    </button>

                    {isExpanded && (
                      <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
                        <p><strong>Descripción:</strong> {incidencia.descripcion}</p>
                        <p><strong>Estado:</strong> {incidencia.estado}</p>
                        <p><strong>Ubicación General:</strong> {incidencia.ubicacion}</p>
                        <p><strong>Estado (Ubicación):</strong> {incidencia.estado_ubicacion}</p>
                        <p><strong>Municipio:</strong> {incidencia.municipio}</p>
                        <p><strong>Colonia:</strong> {incidencia.colonia}</p>
                        <p><strong>Calle:</strong> {incidencia.calle}</p>

                        {incidencia.imagen ? (
                          <div className="image-preview" style={{ marginTop: '1rem' }}>
                            <h4>Imagen Adjunta:</h4>
                            <img
                              src={`data:image/jpeg;base64,${incidencia.imagen}`} alt={`Imagen de la incidencia: ${incidencia.titulo}`} 
                              style={{ maxWidth: '100%', maxHeight: '200px', display: 'block', marginTop: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                        ) : <p><em>No hay imagen adjunta.</em></p>}

                        <div style={{ width: '100%', maxWidth: '400px', height: '250px', margin: '1rem auto', border: '1px solid #ccc', borderRadius: '5px', overflow: 'hidden' }}>
                          {posicion ? (
                            <MapContainer
                              center={posicion}
                              zoom={ZOOM_LEVEL}
                              style={{ width: '100%', height: '100%' }}
                              whenCreated={map => { mapRef.current = map; setTimeout(() => map.invalidateSize(), 200); }}
                              scrollWheelZoom={false}
                            >
                              <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              />
                              <Marker position={posicion} />
                            </MapContainer>
                          ) : (
                            <p style={{ textAlign: 'center', paddingTop: '1rem' }}><em>No hay ubicación disponible para mostrar el mapa.</em></p>
                          )}
                        </div>

                        <button onClick={() => handleStartUpdate(incidencia)} style={{ marginTop: '1rem' }}>
                          Actualizar Incidente
                        </button>
                        {updateError && updatingItem === id && <p style={{ color: 'red' }}>{updateError}</p>}

                        {updatingItem === id && !updateError && (
                          <div style={{ marginTop: '1rem', borderTop: '1px dashed #ccc', paddingTop: '1rem' }}>
                            <h4>Actualizar Imagen</h4>
                            <input type="file" accept="image/*" onChange={e => processImageFile(e.target.files[0])} />
                            {fileName && <p>Archivo seleccionado: {fileName}</p>}
                            <div style={{ marginTop: '0.5rem' }}>
                              <button onClick={() => handleUpdateSubmit(id)}>Confirmar Actualización</button>
                              <button onClick={() => { setUpdatingItem(null); setUpdateError(null); setUpdatedImage(null); setFileName(''); }} style={{ marginLeft: '1rem' }}>
                                Cancelar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && !error && !searchPerformed && <p>Ingresa un término de búsqueda y selecciona un filtro para comenzar.</p>}
        </div>
      </div>
    </div>
  );
}

export default PaginaInicio;
