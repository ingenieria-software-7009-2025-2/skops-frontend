import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import './NavBar.css';

function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/v1/users/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('token');
      // Redirigir a la página de registro/login
      window.location.href = 'http://localhost:3000/';
    }
  };

  return (
    <div className="navbar">
      <div className="logo">Skops & Company</div>
      <ul className="navbar-menu">
        <li><Link to="/">Inicio</Link></li>

        <li className="dropdown">
          <button
            className="dropbtn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            Cuenta
          </button>
          <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}>
            <Link to="/cuenta" className="dropdown-item">Mi cuenta</Link>
            <Link to="/actualizar-datos" className="dropdown-item">Actualizar Datos</Link>
          </div>
        </li>

        <li><Link to="/registrar_incidente">Subir Incidente</Link></li>

        <li>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;