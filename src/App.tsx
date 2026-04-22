import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Onboarding } from './pages/Onboarding';
import { Program } from './pages/Program';
import { Auth } from './pages/Auth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { useTheme } from './hooks/useTheme';
import './styles/global.css';

function App() {
  useTheme();

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/program"
            element={
              <ProtectedRoute>
                <Program />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;