import logo from './logo.svg';
import './App.css';
import { Componente_prueba } from './componentes/Componente_prueba';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Componente_prueba />
      </header>
    </div>
  );
}

export default App;
