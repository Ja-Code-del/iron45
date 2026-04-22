import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export function ForgotPassword() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = await resetPassword(email.trim());

    if (error) {
      setError(error);
      setSubmitting(false);
    } else {
      setSent(true);
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="shell">
        <Navbar meta="Mot de passe oublié" />
        <section className="onboarding">
          <div className="onboarding-inner">
            <div className="onb-tag">Email envoyé</div>
            <h2 className="onb-title">
              Vérifie<br />tes <span className="italic">mails</span>.
            </h2>
            <p className="onb-sub">
              Si un compte existe pour <em>{email}</em>, tu recevras un lien de réinitialisation dans quelques instants.
            </p>
            <div className="auth-success" style={{ marginTop: '24px', maxWidth: '520px' }}>
              Clique sur le lien dans l'email pour choisir un nouveau mot de passe. Le lien expire après 1 heure.
              Pense à vérifier tes spams si tu ne vois rien dans 2-3 minutes.
            </div>
            <div className="onb-nav" style={{ marginTop: '32px' }}>
              <Link to="/auth" className="onb-btn onb-btn-back" style={{ textDecoration: 'none' }}>
                ← Retour à la connexion
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="shell">
      <Navbar meta="Mot de passe oublié" />
      <section className="onboarding">
        <div className="onboarding-inner">
          <div className="onb-tag">Réinitialisation</div>
          <h2 className="onb-title">
            Mot de passe<br /><span className="italic">oublié</span> ?
          </h2>
          <p className="onb-sub">
            Saisis l'email associé à ton compte. Tu recevras un lien pour choisir un nouveau mot de passe.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                required
                autoComplete="email"
                autoFocus
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="onb-btn"
              disabled={submitting || !email.trim()}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {submitting ? 'Envoi en cours...' : 'Envoyer le lien →'}
            </button>
          </form>

          <div className="auth-switch">
            Tu te souviens de ton mot de passe ?
            <Link to="/auth" style={{ color: 'var(--fire)', marginLeft: '6px', textDecoration: 'underline' }}>
              Se connecter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}