import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Modal } from '../components/Modal';
import { ExerciseCheckbox } from '../components/ExerciseCheckbox';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import {
  getSessionWithLogs,
  toggleExerciseCompletion,
  completeSession,
  abandonSession,
  type SessionWithLogs,
} from '../features/program/sessionService';
import { EXERCISES } from '../data/exercises';
import { ICONS } from '../data/icons';
import type { Exercise } from '../types';
import type { Database } from '../types/database';

type ExerciseLog = Database['public']['Tables']['exercise_logs']['Row'];
type Feeling = 'easy' | 'medium' | 'hard' | 'exhausting';

const FEELING_LABELS: Record<Feeling, { label: string; emoji: string }> = {
  easy:       { label: 'Facile',      emoji: '😎' },
  medium:     { label: 'Correct',     emoji: '💪' },
  hard:       { label: 'Dur',         emoji: '🔥' },
  exhausting: { label: 'Épuisant',    emoji: '☠️' },
};

export function Session() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();

  const [sessionData, setSessionData] = useState<SessionWithLogs | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [modalExercise, setModalExercise] = useState<Exercise | null>(null);

  // État du formulaire de fin de séance
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling | null>(null);
  const [notes, setNotes] = useState('');
  const [submittingComplete, setSubmittingComplete] = useState(false);

  /* ===================================================================
   * CHARGEMENT INITIAL
   * =================================================================== */

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);

    getSessionWithLogs(id).then((data) => {
      if (cancelled) return;
      if (!data) {
        setNotFound(true);
      } else {
        setSessionData(data);
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [id]);

  /* ===================================================================
   * COCHER / DÉCOCHER UN EXERCICE (optimistic UI)
   * =================================================================== */

  async function handleToggle(logId: string, currentChecked: boolean) {
    if (!sessionData) return;

    const newChecked = !currentChecked;

    // 1. Mise à jour optimiste du state local (immédiat)
    setSessionData({
      ...sessionData,
      exercise_logs: sessionData.exercise_logs.map((l) =>
        l.id === logId ? { ...l, completed: newChecked } : l
      ),
    });

    // 2. Appel DB en arrière-plan
    const success = await toggleExerciseCompletion(logId, newChecked);

    // 3. Si ça échoue, on rollback
    if (!success) {
      setSessionData((prev) => prev && {
        ...prev,
        exercise_logs: prev.exercise_logs.map((l) =>
          l.id === logId ? { ...l, completed: currentChecked } : l
        ),
      });
      alert("Impossible d'enregistrer ce changement. Vérifie ta connexion.");
    }
  }

  /* ===================================================================
   * TERMINER LA SÉANCE
   * =================================================================== */

  async function handleCompleteSession(e: FormEvent) {
    e.preventDefault();
    if (!sessionData || submittingComplete) return;

    setSubmittingComplete(true);

    const startedAt = new Date(sessionData.started_at).getTime();
    const durationSeconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));

    const success = await completeSession({
      sessionId: sessionData.id,
      durationSeconds,
      feeling: selectedFeeling ?? undefined,
      notes: notes.trim() || undefined,
    });

    if (success) {
      navigate('/program');
    } else {
      alert("Impossible d'enregistrer la séance. Réessaie.");
      setSubmittingComplete(false);
    }
  }

  /* ===================================================================
   * ABANDONNER LA SÉANCE
   * =================================================================== */

  async function handleAbandon() {
    if (!sessionData) return;
    const ok = window.confirm(
      'Abandonner cette séance ? Les exercices cochés seront perdus.'
    );
    if (!ok) return;

    await abandonSession(sessionData.id);
    navigate('/program');
  }

  /* ===================================================================
   * CONSTRUCTION DU CONTENU
   * =================================================================== */

  // Associe chaque log à son exercice complet via exercise_key
  const exercisesWithMeta = useMemo(() => {
    if (!sessionData) return [];
    return sessionData.exercise_logs.map((log) => {
      const meta = EXERCISES[log.exercise_key];
      return { log, meta };
    });
  }, [sessionData]);

  const completedCount = exercisesWithMeta.filter((e) => e.log.completed).length;
  const totalCount = exercisesWithMeta.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allDone = totalCount > 0 && completedCount === totalCount;

  /* ===================================================================
   * RENDU
   * =================================================================== */

  if (!user) return <Navigate to="/auth" replace />;
  if (notFound) return <Navigate to="/program" replace />;

  if (loading || !sessionData) {
    return (
      <div className="shell">
        <Navbar meta="Séance en cours" />
        <section className="onboarding">
          <div className="onboarding-inner">
            <div className="onb-tag">Chargement de la séance...</div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="shell">
      <Navbar meta={`Séance · Semaine ${sessionData.week_number} · Jour ${sessionData.day_letter}`} />

      <section className="session-main">
        {/* ============== HEADER ============== */}
        <div className="session-head">
          <div className="session-tag">
            Phase {sessionData.phase} · Semaine {sessionData.week_number}
          </div>
          <h1 className="session-title">
            Jour <span className="accent">{sessionData.day_letter}</span>
            {profile.objective === 'muscle' && sessionData.day_letter === 'A' && ' · Push'}
            {profile.objective === 'muscle' && sessionData.day_letter === 'B' && ' · Pull'}
            {profile.objective === 'muscle' && sessionData.day_letter === 'C' && ' · Legs'}
          </h1>

          <div className="session-progress-wrap">
            <div className="session-progress-header">
              <span className="session-progress-count">{completedCount} / {totalCount}</span>
              <span className="session-progress-percent">{percent}%</span>
            </div>
            <div className="session-progress-bar">
              <div
                className={`session-progress-fill ${allDone ? 'full' : ''}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            {allDone && (
              <div className="session-progress-done">
                ✓ Tous les exercices terminés — Tu peux clôturer la séance.
              </div>
            )}
          </div>
        </div>

        {/* ============== LISTE DES EXERCICES ============== */}
        <div className="session-exercises">
          {exercisesWithMeta.map(({ log, meta }) => (
            <div
              key={log.id}
              className={`session-exercise ${log.completed ? 'completed' : ''}`}
            >
              <ExerciseCheckbox
                checked={log.completed}
                onChange={() => handleToggle(log.id, log.completed)}
                size="large"
              />
              <div
                className="session-exercise-body"
                onClick={() => meta && setModalExercise(meta)}
              >
                <div
                  className="session-exercise-illus"
                  dangerouslySetInnerHTML={{ __html: ICONS[meta?.icon ?? ''] || '' }}
                />
                <div className="session-exercise-text">
                  <div className="session-exercise-name">{meta?.name ?? log.exercise_key}</div>
                  <div className="session-exercise-muscle">{meta?.muscle ?? ''}</div>
                </div>
                <div className="session-exercise-reps">{log.target_reps}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ============== ACTIONS ============== */}
        <div className="session-actions">
          <button className="session-btn-abandon" onClick={handleAbandon}>
            Abandonner
          </button>
          <button
            className="session-btn-complete"
            onClick={() => setShowCompleteForm(true)}
            disabled={!allDone}
          >
            {allDone ? 'Terminer la séance →' : `Termine tous les exercices (${completedCount}/${totalCount})`}
          </button>
        </div>
      </section>

      {/* ============== MODAL DE FIN DE SÉANCE ============== */}
      {showCompleteForm && (
        <div className="modal-back" onClick={(e) => {
          if (e.target === e.currentTarget && !submittingComplete) setShowCompleteForm(false);
        }}>
          <div className="modal session-complete-modal">
            <h3>Séance terminée 💪</h3>
            <div className="modal-sub">Quel ressenti ?</div>

            <form onSubmit={handleCompleteSession}>
              <div className="feeling-grid">
                {(Object.keys(FEELING_LABELS) as Feeling[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    className={`feeling-btn ${selectedFeeling === f ? 'selected' : ''}`}
                    onClick={() => setSelectedFeeling(f)}
                  >
                    <span className="feeling-emoji">{FEELING_LABELS[f].emoji}</span>
                    <span className="feeling-label">{FEELING_LABELS[f].label}</span>
                  </button>
                ))}
              </div>

              <label className="auth-label" style={{ marginTop: '20px' }} htmlFor="notes">
                Notes (optionnel)
              </label>
              <textarea
                id="notes"
                className="auth-input session-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Comment t'es-tu senti ? Des douleurs ? Des records battus ?"
                rows={3}
                maxLength={500}
              />

              <div className="session-complete-actions">
                <button
                  type="button"
                  className="onb-btn onb-btn-back"
                  onClick={() => setShowCompleteForm(false)}
                  disabled={submittingComplete}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="onb-btn"
                  disabled={submittingComplete}
                >
                  {submittingComplete ? 'Enregistrement...' : 'Enregistrer la séance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Modal exercise={modalExercise} onClose={() => setModalExercise(null)} />
    </div>
  );
}