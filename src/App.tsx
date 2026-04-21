import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Onboarding } from './pages/Onboarding';
import { Program } from './pages/Program';
import { useTheme } from './hooks/useTheme';
import './styles/global.css';

function App() {
  // Initialise le thème au démarrage de l'app
  useTheme();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/program" element={<Program />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;