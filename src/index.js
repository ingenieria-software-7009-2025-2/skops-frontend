import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import{
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Cuenta from './paginas/Cuenta';
import Ayuda from './paginas/Ayuda';
import ActualizarDatos from './componentes/ActualizarDatos/ActualizarDatos';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>
    },

    {
        path: "cuenta",
        element: <Cuenta/>
    },

    {
        path: "/actualizar-datos",
        element: <ActualizarDatos />,
    },

    {
        path: "ayuda",
        element: <Ayuda/>
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);

