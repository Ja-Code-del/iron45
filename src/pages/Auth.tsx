import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

type Mode = 'signin' | 'signup';

export function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle } = useAuth();

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

  async function handleGoogleSignIn() {
  setError(null);
  setSubmitting(true);
  const { error } = await signInWithGoogle();
  if (error) {
    setError(error);
    setSubmitting(false);
  }
  // Si pas d'erreur, la redirection Google est en cours, pas besoin de toucher au state
}

function handleAppleComingSoon() {
  setError("Sign in with Apple sera disponible bientôt.");
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

          <div className="auth-oauth-wrap">
            <button
              type="button"
              className="auth-oauth auth-oauth-google"
              onClick={handleGoogleSignIn}
              disabled={submitting}
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </button>

            <button
              type="button"
              className="auth-oauth auth-oauth-apple"
              onClick={handleAppleComingSoon}
              disabled={true}
              title="Bientôt disponible"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.53-3.23 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple · Bientôt
            </button>
          </div>

          <div className="auth-divider">ou</div>

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