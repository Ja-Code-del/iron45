import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { StreakDisplay } from '../components/StreakDisplay';
import { useAuth } from '../context/AuthContext';
import { useDisplayName } from '../hooks/useDisplayName';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../lib/supabase';
import { getActiveProgram } from '../features/program/programService';
import { listSessionsForProgram } from '../features/program/sessionService';
import { computeProgress } from '../features/program/progressHelpers';
import {
  computeUnlockedBadges,
  computeStreak,
  computeTotalTrainingTime,
  formatDuration,
} from '../features/achievements/helpers';
import { badgesByCategory, type BadgeDefinition } from '../features/achievements/catalog';
import type { Database } from '../types/database';
import type { Objective, Level } from '../types';

type SessionRow = Database['public']['Tables']['workout_sessions']['Row'];

const OBJECTIVE_LABELS: Record<Objective, string> = {
  muscle: 'MUSCLE',
  fat: 'PERTE DE GRAS',
  endurance: 'ENDURANCE',
  balance: 'ÉQUILIBRE',
};

const LEVEL_LABELS: Record<Level, string> = {
  beginner: 'DÉBUTANT',
  intermediate: 'INTERMÉDIAIRE',
  advanced: 'AVANCÉ',
};

const FEELING_EMOJI: Record<string, string> = {
  easy: '😎',
  medium: '💪',
  hard: '🔥',
  exhausting: '☠️',
};

const STATUS_LABELS: Record<string, string> = {
  completed: 'Terminée',
  abandoned: 'Abandonnée',
  in_progress: 'En cours',
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function Glory() {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const { displayName, loading: nameLoading, refresh: refreshName } = useDisplayName();
  const { profile, loading: profileLoading } = useProfile();

  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Modals
  const [selectedSession, setSelectedSession] = useState<SessionRow | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);
  const [showEditName, setShowEditName] = useState(false);
  const [newName, setNewName] = useState('');
  const [editError, setEditError] = useState<string | null>(null);
  const [savingName, setSavingName] = useState(false);

  /* ===================================================================
   * FETCH DES SESSIONS
   * =================================================================== */
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      setLoadingSessions(true);
      if (!user) return;
      const program = await getActiveProgram(user.id);
      if (!program) {
        if (!cancelled) {
          setSessions([]);
          setLoadingSessions(false);
        }
        return;
      }
      const list = await listSessionsForProgram(program.id);
      if (!cancelled) {
        setSessions(list);
        setLoadingSessions(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [user]);

  /* ===================================================================
   * CALCULS DÉRIVÉS (mémoïsés)
   * =================================================================== */

  const progress = useMemo(() => computeProgress(sessions), [sessions]);
  const { unlocked, completedSessionsCount } = useMemo(
    () => computeUnlockedBadges(sessions),
    [sessions]
  );
  const streak = useMemo(() => computeStreak(sessions), [sessions]);
  const totalTime = useMemo(() => computeTotalTrainingTime(sessions), [sessions]);
  const grouped = useMemo(() => badgesByCategory(), []);

  const recentSessions = useMemo(() => {
    return [...sessions]
      .filter((s) => s.status !== 'in_progress')
      .sort((a, b) => {
        const aDate = a.completed_at ?? a.started_at;
        const bDate = b.completed_at ?? b.started_at;
        return (bDate ?? '').localeCompare(aDate ?? '');
      })
      .slice(0, 10);
  }, [sessions]);

  /* ===================================================================
   * HANDLERS
   * =================================================================== */

  async function handleSignOut() {
    await signOut();
    navigate('/auth');
  }

  function openEditName() {
    setNewName(displayName ?? '');
    setEditError(null);
    setShowEditName(true);
  }

  async function handleSaveName(e: FormEvent) {
    e.preventDefault();
    if (!user) return;

    const trimmed = newName.trim();
    if (trimmed.length < 2) {
      setEditError('Minimum 2 caractères.');
      return;
    }
    if (trimmed.length > 30) {
      setEditError('Maximum 30 caractères.');
      return;
    }
    if (trimmed === displayName) {
      setShowEditName(false);
      return;
    }

    setSavingName(true);
    setEditError(null);

    const { error: dbError } = await supabase
      .from('profiles')
      .update({ display_name: trimmed, display_name_is_set: true })
      .eq('user_id', user.id);

    if (dbError) {
      setEditError("Impossible d'enregistrer. Réessaie.");
      setSavingName(false);
      return;
    }

    await supabase.auth.updateUser({ data: { display_name: trimmed } });
    await refreshName();
    setSavingName(false);
    setShowEditName(false);
  }

  /* ===================================================================
   * RENDU
   * =================================================================== */

  if (authLoading || nameLoading || profileLoading) {
    return (
      <div className="shell">
        <Navbar meta="Ma progression" />
        <section className="onboarding">
          <div className="onboarding-inner">
            <div className="onb-tag">Chargement...</div>
          </div>
        </section>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const name = displayName ?? 'Athlete';
  const hasProgram = Boolean(profile.objective && profile.level);

  return (
    <div className="shell">
      <Navbar meta="Ma progression" />

      {/* ================== HERO ================== */}
      <section className="glory-hero">
        <div className="glory-hero-inner">
          <Avatar name={name} size="xl" />
          <div className="glory-hero-name">{name}</div>
          <div className="glory-hero-tagline">
            {hasProgram ? (
              <>
                <span className="glory-tag">{OBJECTIVE_LABELS[profile.objective!]}</span>
                <span className="glory-tag-sep">·</span>
                <span className="glory-tag">{LEVEL_LABELS[profile.level!]}</span>
              </>
            ) : (
              <em>Aucun programme actif</em>
            )}
          </div>
        </div>
      </section>

      {/* ================== CONTENU ================== */}
      <section className="glory-main">

        {/* ─── STATS DE COMBAT ─── */}
        <div className="glory-section-head">
          <h2>Stats de <span className="italic">combat</span></h2>
        </div>
        <div className="glory-stats-grid">
          <div className="glory-stat">
            <div className="glory-stat-value">{completedSessionsCount}</div>
            <div className="glory-stat-label">Séances terminées</div>
          </div>
          <div className="glory-stat">
            <div className="glory-stat-value">{progress.globalPercent}<small>%</small></div>
            <div className="glory-stat-label">Programme complété</div>
          </div>
          <div className="glory-stat">
            <div className="glory-stat-value">{formatDuration(totalTime)}</div>
            <div className="glory-stat-label">Temps cumulé</div>
          </div>
          <div className="glory-stat">
            <div className="glory-stat-value">{unlocked.size}<small>/14</small></div>
            <div className="glory-stat-label">Badges débloqués</div>
          </div>
        </div>

        {/* ─── STREAK ─── */}
        <StreakDisplay streak={streak} />

        {/* ─── BADGES ─── */}
        <div className="glory-section-head" style={{ marginTop: '64px' }}>
          <h2>Tableau <span className="italic">d'honneur</span></h2>
          <p>Clique sur un badge pour voir les détails.</p>
        </div>

        <h3 className="glory-badge-category">Journaliers</h3>
        <div className="glory-badge-grid">
          {grouped.daily.map((b) => (
            <Badge
              key={b.slug}
              badge={b}
              unlocked={unlocked.has(b.slug)}
              onClick={() => setSelectedBadge(b)}
            />
          ))}
        </div>

        <h3 className="glory-badge-category">Hebdomadaires · La voie des métaux</h3>
        <div className="glory-badge-grid">
          {grouped.weekly.map((b) => (
            <Badge
              key={b.slug}
              badge={b}
              unlocked={unlocked.has(b.slug)}
              onClick={() => setSelectedBadge(b)}
            />
          ))}
        </div>

        <h3 className="glory-badge-category">Certifications de phase</h3>
        <div className="glory-badge-grid">
          {grouped.phase.map((b) => (
            <Badge
              key={b.slug}
              badge={b}
              unlocked={unlocked.has(b.slug)}
              onClick={() => setSelectedBadge(b)}
            />
          ))}
        </div>

        <h3 className="glory-badge-category">Récompense ultime</h3>
        <div className="glory-badge-grid">
          {grouped.ultimate.map((b) => (
            <Badge
              key={b.slug}
              badge={b}
              unlocked={unlocked.has(b.slug)}
              onClick={() => setSelectedBadge(b)}
            />
          ))}
        </div>

        {/* ─── HISTORIQUE ─── */}
        <div className="glory-section-head" style={{ marginTop: '64px' }}>
          <h2>Journal de <span className="italic">guerre</span></h2>
          <p>Tes 10 dernières séances. Clique pour voir les détails.</p>
        </div>

        {loadingSessions ? (
          <div className="onb-tag">Chargement de l'historique...</div>
        ) : recentSessions.length === 0 ? (
          <div className="glory-empty">
            <em>Aucune séance enregistrée. C'est le moment de commencer.</em>
          </div>
        ) : (
          <div className="glory-history">
            {recentSessions.map((s) => (
              <div
                key={s.id}
                className={`glory-history-row glory-history-${s.status}`}
                onClick={() => setSelectedSession(s)}
                role="button"
              >
                <div className="glory-history-day">
                  <div className="glory-history-letter">{s.day_letter}</div>
                  <div className="glory-history-week">S{s.week_number}</div>
                </div>
                <div className="glory-history-meta">
                  <div className="glory-history-date">
                    {formatDate(s.completed_at ?? s.started_at)}
                  </div>
                  <div className="glory-history-status">
                    {STATUS_LABELS[s.status] ?? s.status}
                    {s.duration_seconds && ` · ${formatDuration(s.duration_seconds)}`}
                  </div>
                </div>
                <div className="glory-history-feeling">
                  {s.feeling && FEELING_EMOJI[s.feeling]}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── PARAMÈTRES ─── */}
        <div className="glory-section-head" style={{ marginTop: '64px' }}>
          <h2>Réglages du <span className="italic">compte</span></h2>
        </div>
        <div className="glory-settings">
          <button className="glory-setting-btn" onClick={openEditName}>
            <span className="glory-setting-label">Modifier mon Iron Name</span>
            <span className="glory-setting-value">{name} →</span>
          </button>
          <button className="glory-setting-btn" onClick={() => navigate('/program')}>
            <span className="glory-setting-label">Mon programme</span>
            <span className="glory-setting-value">
              {hasProgram ? `${OBJECTIVE_LABELS[profile.objective!]} → ` : 'Aucun → '}
            </span>
          </button>
          <button className="glory-setting-btn glory-setting-danger" onClick={handleSignOut}>
            <span className="glory-setting-label">Se déconnecter</span>
            <span className="glory-setting-value">→</span>
          </button>
        </div>
      </section>

      {/* ================== MODAL SÉANCE ================== */}
      {selectedSession && (
        <div className="modal-back" onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedSession(null);
        }}>
          <div className="modal">
            <button className="modal-close" onClick={() => setSelectedSession(null)}>×</button>
            <div className="modal-sub">{formatDate(selectedSession.completed_at ?? selectedSession.started_at)}</div>
            <h3>
              Jour {selectedSession.day_letter} · Semaine {selectedSession.week_number}
            </h3>
            <div style={{ marginTop: '20px' }}>
              <div className="glory-detail-row">
                <span className="glory-detail-label">Statut</span>
                <span className="glory-detail-value">{STATUS_LABELS[selectedSession.status]}</span>
              </div>
              {selectedSession.duration_seconds && (
                <div className="glory-detail-row">
                  <span className="glory-detail-label">Durée</span>
                  <span className="glory-detail-value">{formatDuration(selectedSession.duration_seconds)}</span>
                </div>
              )}
              {selectedSession.feeling && (
                <div className="glory-detail-row">
                  <span className="glory-detail-label">Ressenti</span>
                  <span className="glory-detail-value">
                    {FEELING_EMOJI[selectedSession.feeling]} {selectedSession.feeling}
                  </span>
                </div>
              )}
              <div className="glory-detail-row">
                <span className="glory-detail-label">Phase</span>
                <span className="glory-detail-value">{selectedSession.phase}</span>
              </div>
            </div>
            {selectedSession.notes && (
              <div className="modal-cue" style={{ marginTop: '16px' }}>
                {selectedSession.notes}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================== MODAL BADGE ================== */}
      {selectedBadge && (
        <div className="modal-back" onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedBadge(null);
        }}>
          <div className="modal">
            <button className="modal-close" onClick={() => setSelectedBadge(null)}>×</button>
            <div className="glory-badge-modal-head">
              <Badge badge={selectedBadge} unlocked={unlocked.has(selectedBadge.slug)} />
            </div>
            <div className="modal-sub">
              {unlocked.has(selectedBadge.slug) ? 'DÉBLOQUÉ' : 'VERROUILLÉ'}
            </div>
            <div className="modal-cue" style={{ marginTop: '16px' }}>
              <strong>{selectedBadge.description}</strong>
              <br /><br />
              {unlocked.has(selectedBadge.slug)
                ? 'Tu as mérité ce badge. Garde la cadence.'
                : `Condition : ${selectedBadge.unlockCondition}`}
            </div>
          </div>
        </div>
      )}

      {/* ================== MODAL EDIT NAME ================== */}
      {showEditName && (
        <div className="modal-back" onClick={(e) => {
          if (e.target === e.currentTarget && !savingName) setShowEditName(false);
        }}>
          <div className="modal">
            <button className="modal-close" onClick={() => !savingName && setShowEditName(false)}>×</button>
            <h3>Modifier l'Iron Name</h3>
            <div className="modal-sub">Choisis avec soin.</div>
            <form onSubmit={handleSaveName} style={{ marginTop: '20px' }}>
              <input
                type="text"
                className="auth-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ton nouvel Iron Name"
                minLength={2}
                maxLength={30}
                autoFocus
                disabled={savingName}
              />
              {editError && <div className="auth-error" style={{ marginTop: '12px' }}>{editError}</div>}
              <div className="session-complete-actions">
                <button
                  type="button"
                  className="onb-btn onb-btn-back"
                  onClick={() => setShowEditName(false)}
                  disabled={savingName}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="onb-btn"
                  disabled={savingName || newName.trim().length < 2}
                >
                  {savingName ? 'Enregistrement...' : 'Valider'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}