import React, { useState } from 'react'
import './LogInSignUp.css'
import user_icon from '../assets/person.png'
import email_icon from '../assets/email.png'
import password_icon from '../assets/password.png'

export const LogInSignUp = () => {

  const [action, setAction] = useState("Registrarse");

  return (
    <div className='container'>
        <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            {/**input para el nombre de usuario. Si estamos en Iniciar sesion ya no aparece el input del nombre sino pues si XD*/}
            {action==="Iniciar sesion"?<div></div>:
            <div className="input">
                <img src={user_icon} alt="" />
                <input type="text" placeholder='Nombre' />
            </div>}
            
            {/**input para el email */}
            <div className="input">
                <img src={email_icon} alt="" />
                <input type="email" placeholder='e-mail' />
            </div>
            {/**input para el password */}
            <div className="input">
                <img src={password_icon} alt="" />
                <input type="password" placeholder='Contraseña' />
            </div>
        </div>
        
        {action==="Registrarse"?<div></div>:
        <div className="olvido-contrasenia">Olvidaste tu contraseña? <span>Click Aquí!</span></div>}
        
        <div className="submit-container">
            <div className={action==="Iniciar sesion"?"submit gray":"submit"} onClick={()=>{setAction("Registrarse")}}>Registrate</div>
            <div className={action==="Registrarse"?"submit gray":"submit"} onClick={()=>{setAction("Iniciar sesion")}}>Iniciar sesión</div>
        </div>
    </div>
  )
}
