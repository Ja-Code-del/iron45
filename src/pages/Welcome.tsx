import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useDisplayName } from '../hooks/useDisplayName';
import { supabase } from '../lib/supabase';

export function Welcome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { displayName: currentName, isSet, loading, refresh } = useDisplayName();

  const [ironName, setIronName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = ironName.trim();
    if (trimmed.length < 2) {
      setError('Ton Iron Name doit faire au moins 2 caractères.');
      return;
    }
    if (trimmed.length > 30) {
      setError('30 caractères maximum.');
      return;
    }
    if (!user) {
      setError('Session invalide, reconnecte-toi.');
      return;
    }

    setSubmitting(true);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        display_name: trimmed,
        display_name_is_set: true,
      })
      .eq('user_id', user.id);

    if (updateError) {
      setError("Impossible d'enregistrer. Réessaie dans un instant.");
      setSubmitting(false);
      return;
    }

    // Met à jour aussi les user_metadata pour cohérence
    await supabase.auth.updateUser({
      data: { display_name: trimmed },
    });

    await refresh();
    navigate('/', { replace: true });
  }

  // Si pas connecté → redirect login
  if (!user) return <Navigate to="/auth" replace />;

  // Pendant le chargement du profil
  if (loading) {
    return (
      <div className="shell">
        <Navbar meta="Bienvenue" />
        <section className="onboarding">
          <div className="onboarding-inner">
            <div className="onb-tag">Chargement...</div>
          </div>
        </section>
      </div>
    );
  }

  // Si l'Iron Name est DÉJÀ choisi → redirect vers la home (protection contre accès direct à /welcome)
  if (isSet) return <Navigate to="/" replace />;

  return (
    <div className="shell">
      <Navbar meta="Bienvenue" />
      <section className="onboarding">
        <div className="onboarding-inner">
          <div className="onb-tag">Ton Iron Name</div>
          <h2 className="onb-title">
            Choisis<br />ton <span className="italic">alias</span>.
          </h2>
          <p className="onb-sub">
            C'est le nom sous lequel le coach s'adressera à toi. Choisis-le avec soin — il t'accompagnera pendant tout ton parcours.
            {currentName && (
              <>
                <br />
                <em>Par défaut on t'appelait "{currentName}", mais tu peux choisir autre chose.</em>
              </>
            )}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="iron-name">Iron Name</label>
              <input
                id="iron-name"
                type="text"
                className="auth-input"
                value={ironName}
                onChange={(e) => setIronName(e.target.value)}
                placeholder={currentName ?? 'Le nom sous lequel on t\'appellera'}
                required
                minLength={2}
                maxLength={30}
                autoFocus
              />
              <div className="auth-hint">
                Entre 2 et 30 caractères. Tu pourras le changer plus tard.
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="onb-btn"
              disabled={submitting || ironName.trim().length < 2}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {submitting ? 'Enregistrement...' : 'Valider mon Iron Name →'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}