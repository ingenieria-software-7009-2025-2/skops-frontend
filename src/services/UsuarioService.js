import axios from 'axios';

const USUARIO_BASE_URL = "http://localhost:8080/v1/users";

class UsuarioService {
    
    async addUser(usuarioBody) {
        try {
            const response = await axios.post(`${USUARIO_BASE_URL}`, usuarioBody, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            console.error("Error al agregar usuario:", error);
            throw error;
        }
    }

    async login(mail, password) {
        try {
            const response = await axios.post(`${USUARIO_BASE_URL}/login`, { mail, password }, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            console.error("Error en el login:", error);
            throw error;
        }
    }

    async logout(token) {
        try {
            const response = await axios.post(`${USUARIO_BASE_URL}/logout`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Autorizacion': token
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            throw error;
        }
    }

    async getUserInfo(token) {
        try {
            const response = await axios.get(`${USUARIO_BASE_URL}/me`, {
                headers: { 'Autorizacion': token }
            });
            return response.data;
        } catch (error) {
            console.error("Error al obtener información del usuario:", error);
            throw error;
        }
    }

    async updateUser(token, usuarioUpdateBody) {
        try {
            const response = await axios.put(`${USUARIO_BASE_URL}/me`, usuarioUpdateBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'Autorizacion': token
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            throw error;
        }
    }
}

export const UsuarioService = new UsuarioService();