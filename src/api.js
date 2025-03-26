import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    console.log('Token enviado en la petición:', token);
    config.headers.Autorizacion = token;
  } else {
    console.warn('No se encontró token en localStorage');
  }
  return config;
});

export default api;