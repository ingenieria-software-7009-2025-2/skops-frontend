import React, { useEffect, useState } from 'react'
import NavBar from '../componentes/NavBar/NavBar'
import api from '../api';
import './Cuenta.css';
import { useNavigate } from 'react-router-dom';

function Cuenta() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/v1/users/me');
        setUserData(response.data);
      } catch (error) {
          console.error("Error:", error);
          localStorage.removeItem('token');
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
        <NavBar />
        <div className="cuenta-container">
            <h2>Mi Cuenta</h2>
            
            {userData && (
              <div className="user-info">
                <p><strong>Nombre de usuario:</strong> {userData.username}</p>
                <p><strong>Email:</strong> {userData.mail}</p>
                {/* Agrega más campos según respuesta de tu API */}
              </div>
            )}

            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              Cerrar sesión
            </button>
        </div>
    </div>
  )
}

export default Cuenta