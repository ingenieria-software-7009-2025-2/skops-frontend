import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Cuenta from './paginas/Cuenta';
import RegistrarIncidente from './paginas/RegistrarIncidente';
import ActualizarDatos from './componentes/ActualizarDatos/ActualizarDatos';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/cuenta', element: <Cuenta /> },
  { path: '/actualizar-datos', element: <ActualizarDatos /> },
  { path: '/registrar_incidente', element: <RegistrarIncidente /> },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
)
