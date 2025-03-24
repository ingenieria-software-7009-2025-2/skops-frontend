import React from 'react'
import './NavBar.css'
import {Link} from "react-router-dom";

function NavBar() {
  return (
    <div className='navbar'>
        <div className="logo">
            Skops & Company
        </div>
        <ul className="navbar-menu">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/cuenta">Cuenta</Link></li>
            <li><Link to="/ayuda">Ayuda</Link></li>
        </ul>
    </div>
  )
}

export default NavBar