import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar/NavBar'
import api from '../../api';
import './ActualizarDatos.css';

function ActualizarDatos() {
  const [userData, setUserData] = useState({
    username: '',
    mail: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Obtener datos actuales del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/v1/users/me');
        setUserData({
          username: response.data.username,
          mail: response.data.mail,
          password: '', // No mostramos la contraseña actual por seguridad
        });
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/');
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/v1/users/me', userData); // Envía los datos actualizados
      setSuccess('Datos actualizados correctamente');
      setError('');
    } catch (error) {
      setError('Error al actualizar los datos');
      setSuccess('');
    }
  };

  return (
    <div className="update-container">
      <h2>Actualizar Datos</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Nombre de usuario:</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Email:</label>
          <input
            type="email"
            name="mail"
            value={userData.mail}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Nueva contraseña (opcional):</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="Dejar vacío para mantener la actual"
          />
        </div>
        <button type="submit" className="submit-button">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}

export default ActualizarDatos;