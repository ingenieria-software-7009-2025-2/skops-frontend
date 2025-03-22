import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import{
    createBrowserRouter,
    RouterProvider,
    Route,
} from "react-router-dom";
import Cuenta from './paginas/Cuenta';
import Ayuda from './paginas/Ayuda';

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
        path: "ayuda",
        element: <Ayuda/>
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);

