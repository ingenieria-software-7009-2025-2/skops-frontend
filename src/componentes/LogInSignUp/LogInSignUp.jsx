import React, { useState } from 'react';
import './LogInSignUp.css';
import user_icon from '../assets/person.png';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';
//import {UsuarioService} from '../services/UsuarioService';
import { test } from '../services/test';
console.log(test); // Debería imprimir "Hola, esto es una prueba"


export const LogInSignUp = ({setUsuario}) => {

  const [action, setAction] = useState("Registrarse");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const manejadorBoton = async (e) => {
    e.preventDefault();

    if (nombre === "" || password === "" || email === "") {
      setError(true);
      return;
    }
    setError(false);

    const usuarioBody = {
      nombre,
      email,
      password,
    };

    try {
      const response = await UsuarioService.addUser(usuarioBody);
      setUsuario([nombre]);
      setMensaje("Usuario registrado con éxito");
    } catch (error) {
      setMensaje("Error al registrar usuario");
    }
  };

  return (
    <div className='container'>
        <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
        </div>
        <form className="inputs" onSubmit={manejadorBoton}>
            {/**input para el nombre de usuario. Si estamos en Iniciar sesion ya no aparece el input del nombre sino pues si XD*/}
            {action==="Iniciar sesion"?<div></div>:
            <div className="input">
                <img src={user_icon} alt="" />
                <input 
                    type="text" 
                    placeholder='Nombre'
                    value = {nombre}
                    onChange={e => setNombre(e.target.value)} 
                />
            </div>}
            
            {/**input para el email */}
            <div className="input">
                <img src={email_icon} alt="" />
                <input 
                    type="email" 
                    placeholder='e-mail'
                    value = {email}
                    onChange={e => setEmail(e.target.value)}  
                />
            </div>
            {/**input para el password */}
            <div className="input">
                <img src={password_icon} alt="" />
                <input 
                    type="password" 
                    placeholder='Contraseña'
                    value = {password}
                    onChange={e => setPassword(e.target.value)}  
                />
            </div>
            <div className="submit-container">
                <button className={action==="Iniciar sesion"?"submit gray":"submit"} onClick={()=>{setAction("Registrarse")}}>Registrate</button>
                <button className={action==="Registrarse"?"submit gray":"submit"} onClick={()=>{setAction("Iniciar sesion")}}>Iniciar sesión</button>
            </div>
        </form>
        {error && <p>Todos los campos son necesarios</p>}
         
        {action==="Registrarse"?<div></div>:
        <div className="olvido-contrasenia">Olvidaste tu contraseña? <span>Click Aquí!</span></div>}
        
        
        
    </div>
    
  )
}