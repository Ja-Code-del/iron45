import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase détecte automatiquement le token dans l'URL et crée la session.
    // On attend un instant que la session soit établie, puis on redirige.
    async function handleCallback() {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // ProtectedRoute s'occupera de rediriger vers /welcome si Iron Name manquant
        navigate('/', { replace: true });
      } else {
        // Si pas de session, retour vers login
        navigate('/auth', { replace: true });
      }
    }

    // Petit délai pour laisser Supabase traiter le token de l'URL
    const timer = setTimeout(handleCallback, 500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="shell">
      <section className="onboarding">
        <div className="onboarding-inner">
          <div className="onb-tag">Connexion en cours...</div>
        </div>
      </section>
    </div>
  );
}