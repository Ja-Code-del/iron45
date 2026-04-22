import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDisplayName } from '../hooks/useDisplayName';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { isSet, loading: profileLoading } = useDisplayName();
  const location = useLocation();

  // Chargement de l'auth ou du profil
  if (authLoading || (user && profileLoading)) {
    return (
      <div className="shell">
        <section className="onboarding">
          <div className="onboarding-inner">
            <div className="onb-tag">Chargement...</div>
          </div>
        </section>
      </div>
    );
  }

  // Non connecté → page d'auth
  if (!user) return <Navigate to="/auth" replace />;

  // Connecté mais pas d'Iron Name choisi → welcome
  // Exception : on ne redirige PAS si on est déjà sur /welcome (pour éviter la boucle infinie)
  if (!isSet && location.pathname !== '/welcome') {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
}