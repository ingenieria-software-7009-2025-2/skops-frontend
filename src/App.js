import logo from './logo.svg';
import './App.css';
import { LogInSignUp } from './componentes/LogInSignUp/LogInSignUp';
import NavBar from './componentes/NavBar/NavBar';
import PaginaInicio from './componentes/PaginaInicio/PaginaInicio';
import { useState } from 'react';

function App() {

  const [usuario, setUsuario] = useState([])
  return (
    <div>
      
      {
        !usuario.length > 0
          ? <LogInSignUp setUsuario={setUsuario}/>
          : <PaginaInicio />
      }
    </div>
  );
}

export default App;