import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import api from '../..//api';
import './ActualizarDatos.css';

function ActualizarDatos() {
  const [userData, setUserData] = useState({
    username: '',
    mail: '',
    password: '',
    municipio: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  // Validar formulario
  useEffect(() => {
    const requiredFields = ['username', 'mail'];
    const isValid = requiredFields.every(field => userData[field].trim() !== '');
    setIsFormValid(isValid);
  }, [userData]);

  // Obtener datos actuales del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/v1/users/me');
        setUserData({
          username: response.data.username,
          mail: response.data.mail,
          password: '',
          municipio: response.data.municipio || '',
        });
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/');
      }
    };
    fetchUserData();
  }, [navigate]);

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setError('Por favor completa todos los campos obligatorios');
      setSuccess('');
      return;
    }

    try {
      const dataToSend = {
        username: userData.username.trim(),
        mail: userData.mail.trim(),
        municipio: userData.municipio.trim(),
        ...(userData.password.trim() !== '' && { password: userData.password.trim() })
      };

      await api.put('/v1/users/me', dataToSend);
      setSuccess('Datos actualizados correctamente');
      setError('');
      setUserData(prev => ({ ...prev, password: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar los datos');
      setSuccess('');
    }
  };

  return (
    <div>
      <NavBar />
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
            <label>Municipio:</label>
            <input
              type="text"
              name="municipio"
              value={userData.municipio}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Dejar vacío para mantener la actual"
            />
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={!isFormValid}
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}

export default ActualizarDatos;
