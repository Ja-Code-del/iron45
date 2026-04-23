import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Onboarding } from './pages/Onboarding';
import { Program } from './pages/Program';
import { Auth } from './pages/Auth';
import { Session } from './pages/Session';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { AuthCallback } from './pages/AuthCallback';
import { Welcome } from './pages/Welcome';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { useTheme } from './hooks/useTheme';
import { Glory } from './pages/Glory';
import { Analytics } from "@vercel/analytics/react"
import './styles/global.css';

function App() {
  useTheme();

  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
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
            <Route
              path="/session/:id"
              element={
                <ProtectedRoute>
                  <Session />
                </ProtectedRoute>
              }
            />
            <Route
              path="/welcome"
              element={
                <ProtectedRoute>
                  <Welcome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/glory"
              element={
                <ProtectedRoute>
                  <Glory />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Analytics />
    </>
  );
}

export default App;