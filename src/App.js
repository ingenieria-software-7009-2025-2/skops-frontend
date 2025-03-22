import logo from './logo.svg';
import './App.css';
import { LogInSignUp } from './componentes/LogInSignUp/LogInSignUp';
import NavBar from './componentes/NavBar/NavBar';

function App() {
  return (
    <div>
      <NavBar></NavBar>
      <LogInSignUp/>
    </div>
  );
}

export default App;
