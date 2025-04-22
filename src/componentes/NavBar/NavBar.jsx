import React, { useState } from 'react';
import { Link} from 'react-router-dom'; 
import './NavBar.css';

function NavBar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);


    return (
        <div className="navbar">
            <div className="logo">Skops & Company</div>
            <ul className="navbar-menu">
                <li><Link to="/">Inicio</Link></li>

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
                    </div>
                </li>

                <li><Link to="/ayuda">Subir Incidente</Link></li>
            </ul>
        </div>
    );
}

export default NavBar;