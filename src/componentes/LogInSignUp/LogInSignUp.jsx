import React, { useState } from 'react';
import './LogInSignUp.css';
import user_icon from '../assets/person.png';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';
import UsuarioService from '../../services/UsuarioService';

export const LogInSignUp = ({ setUsuario }) => {
    const [action, setAction] = useState("Registrarse");
    const [username, setusername] = useState("");
    const [mail, setmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const manejadorBoton = async (e) => {
        e.preventDefault();

        if (username.trim() === "" || password.trim() === "" || mail.trim() === "") {
            setError(true);
            setMensaje("Todos los campos son obligatorios");
            return;
        }

        setError(false);
        setMensaje("Enviando datos...");

        const usuarioBody = { username, mail, password };
        console.log("Datos enviados al backend:", usuarioBody); // Verificación

        try {
            const response = await UsuarioService.addUser(usuarioBody);
            console.log("Respuesta del backend:", response);

            if (response) {
                setUsuario((prevUsuarios) => [...prevUsuarios, { username, mail }]);
                setMensaje("Usuario registrado con éxito");
            } else {
                setMensaje("No se pudo registrar el usuario");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setMensaje(error.response?.data?.message || "Error al registrar usuario");
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
                        <img src={user_icon} alt="" />
                        <input
                            type="text"
                            placeholder='username'
                            value={username}
                            onChange={e => setusername(e.target.value)}
                        />
                    </div>
                )}

                <div className="input">
                    <img src={email_icon} alt="" />
                    <input
                        type="mail"
                        placeholder='e-mail'
                        value={mail}
                        onChange={e => setmail(e.target.value)}
                    />
                </div>

                <div className="input">
                    <img src={password_icon} alt="" />
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
                        className="submit"
                    >
                        {action}
                    </button>
                    <button
                        type="button"
                        className="submit gray"
                        onClick={() => setAction(action === "Registrarse" ? "Iniciar sesion" : "Registrarse")}
                    >
                        {action === "Registrarse" ? "Iniciar sesión" : "Registrate"}
                    </button>
                </div>
            </form>

            {error && <p style={{ color: 'red' }}>{mensaje}</p>}
            {!error && mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

            {action === "Registrarse" ? null : (
                <div className="olvido-contrasenia">
                    Olvidaste tu contraseña? <span>Click Aquí!</span>
                </div>
            )}
        </div>
    );
};