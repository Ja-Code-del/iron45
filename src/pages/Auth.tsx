import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

type Mode = 'signin' | 'signup';

export function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ironName, setIronName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (mode === 'signup') {
      const trimmedName = ironName.trim();
      if (trimmedName.length < 2) {
        setError('Ton Iron Name doit faire au moins 2 caractères.');
        setSubmitting(false);
        return;
      }

      const { error } = await signUp(email, password, trimmedName);
      if (error) {
        setError(error);
        setSubmitting(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      } else {
        setSignupSuccess(true);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        navigate('/');
      }
    }
    setSubmitting(false);
  }

  function switchMode() {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
    setSignupSuccess(false);
  }

  if (signupSuccess) {
    return (
      <div className="shell">
        <Navbar meta="Authentification" />
        <section className="onboarding">
          <div className="onboarding-inner">
            <div className="onb-tag">Inscription réussie</div>
            <h2 className="onb-title">
              Un <span className="italic">email</span><br />t'attend.
            </h2>
            <p className="onb-sub">
              Clique sur le lien de confirmation qu'on vient d'envoyer à <em>{email}</em> pour activer ton compte.
            </p>
            <div className="auth-success" style={{ marginTop: '24px', maxWidth: '520px' }}>
              Pense à vérifier tes spams si tu ne vois rien dans quelques minutes.
            </div>
            <div className="onb-nav" style={{ marginTop: '32px' }}>
              <button className="onb-btn onb-btn-back" onClick={() => { setSignupSuccess(false); setMode('signin'); }}>
                ← Retour à la connexion
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="shell">
      <Navbar meta="Authentification" />
      <section className="onboarding">
        <div className="onboarding-inner">
          <div className="onb-tag">
            {mode === 'signin' ? 'Ravi de te revoir' : 'Rejoins le programme'}
          </div>
          <h2 className="onb-title">
            {mode === 'signin' ? (
              <>Bon<br /><span className="italic">retour</span>.</>
            ) : (
              <>Crée<br />ton <span className="italic">compte</span>.</>
            )}
          </h2>
          <p className="onb-sub">
            {mode === 'signin'
              ? "Connecte-toi pour reprendre là où tu t'es arrêté."
              : "Suis ta progression, enregistre tes records, reprends le programme sur n'importe quel appareil."}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="iron-name">Iron Name</label>
                <input
                  id="iron-name"
                  type="text"
                  className="auth-input"
                  value={ironName}
                  onChange={(e) => setIronName(e.target.value)}
                  placeholder="Le nom sous lequel le coach s'adressera à toi"
                  required
                  minLength={2}
                  maxLength={30}
                  autoComplete="nickname"
                />
                <div className="auth-hint">
                  Ton alias de guerrier. Il apparaîtra dans l'app.
                </div>
              </div>
            )}

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
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Mot de passe</label>
              <input
                id="password"
                type="password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'Minimum 6 caractères' : '••••••••'}
                required
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="onb-btn"
              disabled={submitting}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {submitting
                ? 'Patiente...'
                : mode === 'signin' ? 'Se connecter →' : 'Créer mon compte →'}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'signin' ? 'Pas encore de compte ?' : 'Déjà inscrit ?'}
            <button onClick={switchMode}>
              {mode === 'signin' ? 'Créer un compte' : 'Se connecter'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}