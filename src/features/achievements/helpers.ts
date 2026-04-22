import type { Database } from '../../types/database';
import { computeProgress } from '../program/progressHelpers';

type SessionRow = Database['public']['Tables']['workout_sessions']['Row'];

export interface UnlockedBadges {
  unlocked: Set<string>;
  totalCount: number;
  completedSessionsCount: number;
}

/**
 * Calcule l'ensemble des slugs de badges débloqués par l'utilisateur
 * en fonction de ses séances.
 */
export function computeUnlockedBadges(sessions: SessionRow[]): UnlockedBadges {
  const completed = sessions.filter((s) => s.status === 'completed');
  const completedCount = completed.length;
  const progress = computeProgress(sessions);

  const unlocked = new Set<string>();

  // ─ Badges journaliers (paliers de complétion)
  if (completedCount >= 1)  unlocked.add('premier-sang');
  if (completedCount >= 10) unlocked.add('perseverance');
  if (completedCount >= 50) unlocked.add('legende');

  // ─ Badges hebdomadaires (métaux)
  const metals = ['etain', 'cuivre', 'bronze', 'fer', 'acier', 'argent', 'or', 'platine'];
  progress.weeks.forEach((week, idx) => {
    if (week.isComplete) {
      unlocked.add(metals[idx]);
    }
  });

  // ─ Certifications de phase
  const phase1Complete = progress.weeks.slice(0, 4).every((w) => w.isComplete);
  const phase2Complete = progress.weeks.slice(4, 8).every((w) => w.isComplete);
  if (phase1Complete) unlocked.add('initiation');
  if (phase2Complete) unlocked.add('aguerrissement');

  // ─ Récompense ultime
  if (progress.isProgramComplete) unlocked.add('iron-45');

  return {
    unlocked,
    totalCount: unlocked.size,
    completedSessionsCount: completedCount,
  };
}

/**
 * Calcule le streak actuel : nombre de jours consécutifs se terminant aujourd'hui
 * (ou hier si l'utilisateur n'a pas encore fait de séance aujourd'hui).
 */
export function computeStreak(sessions: SessionRow[]): number {
  const completedSessions = sessions
    .filter((s) => s.status === 'completed' && s.completed_at !== null);

  if (completedSessions.length === 0) return 0;

  // Extraire les dates uniques (format YYYY-MM-DD) en ordre décroissant
  const uniqueDates = new Set<string>();
  completedSessions.forEach((s) => {
    if (s.completed_at) {
      const dateStr = new Date(s.completed_at).toISOString().split('T')[0];
      uniqueDates.add(dateStr);
    }
  });

  const sortedDates = Array.from(uniqueDates).sort().reverse(); // du plus récent au plus ancien

  // Calcul du streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Le streak doit commencer par aujourd'hui OU hier (sinon il est "cassé")
  let startDate: Date;
  if (sortedDates[0] === todayStr) {
    startDate = today;
  } else if (sortedDates[0] === yesterdayStr) {
    startDate = yesterday;
  } else {
    return 0; // Dernière séance trop ancienne
  }

  // On remonte jour par jour tant qu'on trouve une séance
  let streak = 0;
  const current = new Date(startDate);

  while (true) {
    const currentStr = current.toISOString().split('T')[0];
    if (uniqueDates.has(currentStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calcule le total d'heures d'entraînement (somme des duration_seconds).
 */
export function computeTotalTrainingTime(sessions: SessionRow[]): number {
  return sessions
    .filter((s) => s.status === 'completed' && s.duration_seconds !== null)
    .reduce((sum, s) => sum + (s.duration_seconds ?? 0), 0);
}

/**
 * Formatte un nombre de secondes en "2h15" ou "45min".
 */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h${minutes.toString().padStart(2, '0')}`;
}

/**
 * Génère une couleur d'avatar déterministe à partir de l'Iron Name.
 * Même nom → même couleur, toujours.
 */
export function getAvatarColor(ironName: string): string {
  const palette = [
    '#ff5722', // fire
    '#ffb020', // amber
    '#d4ff00', // acid
    '#5B7080', // steel
    '#B87333', // copper
    '#D4AF37', // gold
    '#C0C0C0', // silver
    '#8B2E1F', // burgundy
    '#2E8B8B', // teal
    '#7D3C98', // purple
  ];

  // Hash simple du nom (somme des codes ASCII) pour déterministe
  let hash = 0;
  for (let i = 0; i < ironName.length; i++) {
    hash = (hash + ironName.charCodeAt(i)) % palette.length;
  }

  return palette[hash];
}