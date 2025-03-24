import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import './NavBar.css';

function NavBar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="navbar">
            <div className="logo">Skops & Company</div>
            <ul className="navbar-menu">
                <li><Link to="/">Inicio</Link></li>

                {/* Menú desplegable para "Cuenta" */}
                <li className="dropdown">
                    <button
                        className="dropbtn"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        Cuenta
                    </button>
                    <div
                        className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}
                    >
                        <Link to="/cuenta" className="dropdown-item">
                            Mi cuenta
                        </Link>
                        <Link to="/actualizar-datos" className="dropdown-item">
                            Actualizar Datos
                        </Link>
                        <div
                            className="dropdown-item logout-item"
                            onClick={(e) => {
                                e.preventDefault();
                                handleLogout();
                            }}
                        >
                            Cerrar Sesión
                        </div>
                    </div>
                </li>

                <li><Link to="/ayuda">Ayuda</Link></li>
            </ul>
        </div>
    );
}

export default NavBar;