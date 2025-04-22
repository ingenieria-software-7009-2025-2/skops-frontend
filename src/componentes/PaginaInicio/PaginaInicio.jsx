import React, { useState } from 'react';
import NavBar from '../NavBar/NavBar';
import './PaginaInicio.css'; 
import api from '../../api'; 

function PaginaInicio() {
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

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
    console.log('Iniciando búsqueda con:', { searchText, filter });
    let url = '';
    let params = {};
    try {
      switch (filter) {
        case 'titulo':
          url = '/v1/incidentes/buscar-titulo';
          params = { titulo: searchText };
          break;
        case 'municipio':
          url = '/v1/incidentes/buscar-municipios';
          params = { municipio: searchText };
          break;
        case 'categoria':
          url = '/v1/incidentes/buscar-categoria';
          params = { categoria: searchText };
          break;
        case 'estado':
          url = '/v1/incidentes/buscar-estado';
          params = { estado: searchText };
          break;
        default:
          throw new Error('Filtro no reconocido');
      }
      console.log(`Enviando petición GET a ${url} con params:`, params);
      const response = await api.get(url, { params: params });
      console.log('Respuesta de la API:', response.data);
      if (filter === 'titulo') {
        setSearchResults(response.data ? [response.data] : []);
      } else {
        setSearchResults(response.data || []);
      }
    } catch (err) {
      console.error(`Error al buscar por ${filter}:`, err);
      setSearchResults([]);
      if (err.response) {
        console.error('Data:', err.response.data);
        console.error('Status:', err.response.status);
        if (err.response.status === 404) {
           setError(`No se encontraron incidencias para "${searchText}" con filtro "${filter}".`);
        } else if (err.response.status === 401) {
          setError('No autorizado para realizar esta búsqueda.');
        } else {
           setError(`Error del servidor: ${err.response.status}. Intenta de nuevo.`);
        }
      } else if (err.request) {
        setError('No se pudo conectar con el servidor. Verifica tu conexión.');
      } else {
        setError(`Ocurrió un error: ${err.message || 'Error desconocido'}.`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="container" style={{ marginTop: '2rem' }}>

        <div className="search-controls-container">
          <input
            className="search-input" 
            type="text"
            name="searchText"
            value={searchText}
            placeholder="Buscar por..." 
            onChange={e => setSearchText(e.target.value)}
          />

          <div className="filter-group">
            <label htmlFor="filtro" className="filter-label">
              Filtrar por
            </label>
            <select
              className="filter-select" 
              id="filtro"
              name="filtro"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="" disabled>Selecciona...</option> 
              <option value="titulo">Título</option>
              <option value="municipio">Municipio</option>
              <option value="categoria">Categoría</option>
              <option value="estado">Estado</option>
            </select>
          </div>


          <button
            type="button"
            className="search-button" 
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        <div className="results-container" style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px', background: '#f9f9f9' }}>
          <h2>Resultados de la Búsqueda</h2>
          {isLoading && <p>Buscando incidencias...</p>}
           {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}

           {!isLoading && !error && searchPerformed && searchResults.length === 0 && (
             <p>No se encontraron incidencias que coincidan con tu búsqueda.</p>
           )}

           {!isLoading && !error && searchResults.length > 0 && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {searchResults.map((incidencia, index) => (
                 <div key={incidencia.id_incidente || index} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '5px', background: '#fff' }}>
                   <h3>{incidencia.titulo} </h3>
                   <p><strong>Descripción:</strong> {incidencia.descripcion}</p>
                   <p><strong>Estado:</strong> {incidencia.estado}</p>
                   <p><strong>Ubicación General:</strong> {incidencia.ubicacion}</p>
                   <p><strong>Estado (Ubicación):</strong> {incidencia.estado_ubicacion}</p>
                   <p><strong>Municipio:</strong> {incidencia.municipio}</p>
                   <p><strong>Colonia:</strong> {incidencia.colonia}</p>
                   <p><strong>Calle:</strong> {incidencia.calle}</p>
                   <p><strong>Categoría:</strong> {incidencia.categoria}</p>
                   {incidencia.imagen && (
                     <div className="image-preview" style={{ marginTop: '1rem' }}>
                       <h4>Imagen Adjunta:</h4>
                       <img
                         src={`data:image/jpeg;base64,${incidencia.imagen}`}
                         alt={`Imagen de la incidencia: ${incidencia.titulo}`}
                         style={{
                           maxWidth: '100%', maxHeight: '300px', height: 'auto',
                           display: 'block', marginTop: '0.5rem', border: '1px solid #ddd', borderRadius: '4px'
                         }}
                       />
                     </div>
                   )}
                    {!incidencia.imagen && <p><em>No hay imagen adjunta.</em></p>}
                 </div>
               ))}
             </div>
           )}
           {!isLoading && !error && !searchPerformed && (
             <p>Ingresa un término de búsqueda y selecciona un filtro para comenzar.</p>
           )}
        </div>

      </div> 
    </div>
  );
}

export default PaginaInicio;