import React, { useState } from 'react';
import './LogInSignUp.css';
import user_icon from '../assets/person.png';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';
import api from '../../api';

export const LogInSignUp = ({ setUsuario }) => {
  const [action, setAction] = useState("Registrarse");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegistro = async (e) => {
    e.preventDefault();
    
    if (!nombre || !email || !password) {
      setError("Todos los campos son necesarios");
      return;
    }

    try {
      const response = await api.post('/v1/users', {
        username: nombre,
        mail: email,
        password: password
      });
      console.log("Respuesta de registro:", response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      } else {
        console.warn("No se recibió token en la respuesta del registro");
      }
      setUsuario([nombre]);
      
    } catch (err) {
      setError(err.response?.data?.message || "Error en el registro");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/v1/users/login', {
        mail: email,
        password: password
      });
      console.log("Respuesta de login:", response.data);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      } else {
        console.warn("No se recibió token en la respuesta del login");
      }
      setUsuario([response.data.username]);
      
    } catch (err) {
      setError(err.response?.data?.message || "Credenciales inválidas");
    }
  };

  // Manejador que se ejecuta al enviar el formulario.
  // Usa el valor de 'action' para decidir qué operación ejecutar.
  const manejadorBoton = (e) => {
    e.preventDefault();
    if (action === "Registrarse") {
      handleRegistro(e);
    } else {
      handleLogin(e);
    }
  };

  return (
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <form className="inputs" onSubmit={manejadorBoton}>
        {action === "Iniciar sesion" ? null : (
          <div className="input">
            <img src={user_icon} alt="user icon" />
            <input 
              type="text" 
              placeholder='Nombre'
              value={nombre}
              onChange={e => setNombre(e.target.value)} 
            />
          </div>
        )}
        <div className="input">
          <img src={email_icon} alt="email icon" />
          <input 
            type="email" 
            placeholder='e-mail'
            value={email}
            onChange={e => setEmail(e.target.value)}  
          />
        </div>
        <div className="input">
          <img src={password_icon} alt="password icon" />
          <input 
            type="password" 
            placeholder='Contraseña'
            value={password}
            onChange={e => setPassword(e.target.value)}  
          />
        </div>
        <div className="submit-container">
          <button 
            type="submit"
            className={action === "Iniciar sesion" ? "submit gray" : "submit"}
            onClick={() => setAction("Registrarse")}
          >
            Registrate
          </button>
          <button 
            type="submit"
            className={action === "Registrarse" ? "submit gray" : "submit"}
            onClick={() => setAction("Iniciar sesion")}
          >
            Iniciar sesión
          </button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
      
      {action === "Registrarse" ? null : (
        <div className="olvido-contrasenia">
          Olvidaste tu contraseña? <span>Click Aquí!</span>
        </div>
      )}
    </div>
  );
};
