import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export function ResetPassword() {
  const navigate = useNavigate();
  const { user, loading: authLoading, updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Si l'utilisateur vient d'arriver sur cette page sans lien magique,
  // la session n'existe pas. On attend un peu pour voir si elle se crée
  // (Supabase met un petit délai pour détecter le token dans l'URL).
  const [waitingForSession, setWaitingForSession] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setWaitingForSession(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setSubmitting(true);

    const { error } = await updatePassword(password);

    if (error) {
      setError(error);
      setSubmitting(false);
    } else {
      setSuccess(true);
      setSubmitting(false);
      // Redirige après 2 secondes pour laisser l'utilisateur voir la confirmation
      setTimeout(() => navigate('/', { replace: true }), 2000);
    }
  }

  // Écran d'attente : la session n'est peut-être pas encore établie
  if (authLoading || waitingForSession) {
    return (
      <div className="shell">
        <Navbar meta="Réinitialisation" />
        <section className="onboarding">
          <div className="onboarding-inner">
            <div className="onb-tag">Vérification du lien...</div>
          </div>
        </section>
      </div>
    );
  }

  // Si pas de user après l'attente, le lien est invalide/expiré
  if (!user) {
    return (
      <div className="shell">
        <Navbar meta="Lien invalide" />
        <section className="onboarding">
          <div className="onboarding-inner">
            <div className="onb-tag">Lien invalide ou expiré</div>
            <h2 className="onb-title">
              Lien <span className="italic">expiré</span>.
            </h2>
            <p className="onb-sub">
              Le lien de réinitialisation n'est plus valide. Les liens expirent après 1 heure pour des raisons de sécurité.
              Demande un nouveau lien pour réessayer.
            </p>
            <div className="onb-nav" style={{ marginTop: '32px' }}>
              <Link to="/forgot-password" className="onb-btn" style={{ textDecoration: 'none' }}>
                Demander un nouveau lien →
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (success) {
    return (
      <div className="shell">
        <Navbar meta="Mot de passe mis à jour" />
        <section className="onboarding">
          <div className="onboarding-inner">
            <div className="onb-tag">Succès</div>
            <h2 className="onb-title">
              Nouveau mot<br />de passe <span className="italic">validé</span>.
            </h2>
            <p className="onb-sub">
              Tu vas être redirigé automatiquement...
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="shell">
      <Navbar meta="Réinitialisation" />
      <section className="onboarding">
        <div className="onboarding-inner">
          <div className="onb-tag">Choisis ton nouveau mot de passe</div>
          <h2 className="onb-title">
            Nouveau<br /><span className="italic">départ</span>.
          </h2>
          <p className="onb-sub">
            Choisis un mot de passe solide. Tu vas l'utiliser pour te connecter dès maintenant.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="new-password">Nouveau mot de passe</label>
              <input
                id="new-password"
                type="password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                required
                minLength={6}
                autoComplete="new-password"
                autoFocus
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="confirm-password">Confirmer</label>
              <input
                id="confirm-password"
                type="password"
                className="auth-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répète le mot de passe"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="onb-btn"
              disabled={submitting || password.length < 6 || confirmPassword.length < 6}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {submitting ? 'Mise à jour...' : 'Mettre à jour mon mot de passe →'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}