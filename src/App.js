import './App.css';
import { LogInSignUp } from './componentes/LogInSignUp/LogInSignUp';
import PaginaInicio from './componentes/PaginaInicio/PaginaInicio';
import { useState } from 'react';

function App() {
  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? ['authenticated'] : [];
  });

  return (
    <div>
      {!usuario.length 
        ? <LogInSignUp setUsuario={setUsuario}/>
        : <PaginaInicio />
      }
    </div>
  );
}

export default App;
