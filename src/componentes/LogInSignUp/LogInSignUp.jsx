import React, { useState } from 'react';
import './LogInSignUp.css';
import user_icon from '../assets/person.png';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';
import municipio_icon from '../assets/municipio.png';
import api from '../../api';
import axios from 'axios';

export const LogInSignUp = ({ setUsuario }) => {
  const [action, setAction]   = useState("Registrarse");
  const [nombre, setNombre]   = useState("");
  const [municipio, setMunicipio] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");

  const handleRegistro = async () => {
    // Validación: no permitir espacios en blanco
    if (!nombre.trim() || !municipio.trim() || !email.trim() || !password.trim()) {
      setError("Todos los campos son necesarios");
      return;
    }

    try {
      // Usamos axios directamente para no enviar el token
      const response = await axios.post(`${api.defaults.baseURL}/v1/users`, {
        username: nombre,
        municipio: municipio,
        mail: email,
        password: password
      });

      // Si el servidor devuelve código 201 o 200, consideramos registro exitoso
      if (response.status === 201 || response.status === 200) {
        // Limpiar campos
        setNombre("");
        setMunicipio("");
        setEmail("");
        setPassword("");
        setError("");

        // Cambiar al modo login para que el usuario inicie sesión
        setAction("Iniciar sesión");
      } else {
        setError("Error en el proceso de registro");
      }

    } catch (err) {
      // Capturamos error del servidor
      setError(err.response?.data?.message || "Error interno al registrar");
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Todos los campos son necesarios");
      return;
    }

    try {
      const response = await api.post('/v1/users/login', {
        mail: email,
        password: password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUsuario([response.data.username]);
        // Limpiar campos tras login exitoso
        setEmail("");
        setPassword("");
        setError("");
      } else {
        setError("Error en el proceso de autenticación");
      }

    } catch (err) {
      setError(err.response?.data?.message || "Credenciales inválidas");
    }
  };

  const manejadorBoton = (e) => {
    e.preventDefault();
    setError("");
    if (action === "Registrarse") {
      handleRegistro();
    } else {
      handleLogin();
    }
  };

  return (
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <div className="mode-switch">
        <button
          type="button"
          className={action === "Registrarse" ? "active" : ""}
          onClick={() => {
            setAction("Registrarse");
            setError("");
          }}
        >
          Registrate
        </button>
        <button
          type="button"
          className={action === "Iniciar sesión" ? "active" : ""}
          onClick={() => {
            setAction("Iniciar sesión");
            setError("");
          }}
        >
          Iniciar sesión
        </button>
      </div>

      <form className="inputs" onSubmit={manejadorBoton}>
        {action === "Iniciar sesión" ? null : (
          <>
            <div className="input">
              <img src={user_icon} alt="user icon" />
              <input
                type="text"
                placeholder='Nombre'
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />
            </div>
            <div className="input">
              <img src={user_icon} alt="municipio icon" />
              <input
                type="text"
                placeholder='Municipio'
                value={municipio}
                onChange={e => setMunicipio(e.target.value)}
              />
            </div>
          </>
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
          <button type="submit" className="submit">
            {action}
          </button>
        </div>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
};
