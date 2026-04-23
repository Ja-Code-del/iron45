import type { Database } from '../../types/database';

type SessionRow = Database['public']['Tables']['workout_sessions']['Row'];

export type DayLetter = 'A' | 'B' | 'C';

export interface WeekState {
  weekNumber: number;
  phase: 1 | 2;
  dayA: 'not_started' | 'in_progress' | 'completed';
  dayB: 'not_started' | 'in_progress' | 'completed';
  dayC: 'not_started' | 'in_progress' | 'completed';
  isComplete: boolean;
  completedDays: number; // 0 à 3
}

export interface ProgramProgress {
  currentWeek: number;           // La 1ère semaine non-complétée (1-8)
  currentPhase: 1 | 2;           // Phase de la current week
  weeks: WeekState[];            // État des 8 semaines
  isProgramComplete: boolean;    // true si les 8 semaines sont complètes
  globalPercent: number;         // % de complétion global (0-100)
}

/* ===================================================================
 * HELPERS INTERNES
 * =================================================================== */

function phaseFromWeek(weekNumber: number): 1 | 2 {
  return weekNumber <= 4 ? 1 : 2;
}

function dayStatusFromSessions(
  sessions: SessionRow[],
  weekNumber: number,
  dayLetter: DayLetter
): 'not_started' | 'in_progress' | 'completed' {
  // On cherche la session la plus récente pour ce (week, day) — peut y en avoir plusieurs (abandon + reprise)
  const relevant = sessions
    .filter((s) => s.week_number === weekNumber && s.day_letter === dayLetter)
    .sort((a, b) => (b.started_at ?? '').localeCompare(a.started_at ?? ''));

  if (relevant.length === 0) return 'not_started';

  // Une session 'completed' compte même si une 'in_progress' est plus récente
  const hasCompleted = relevant.some((s) => s.status === 'completed');
  if (hasCompleted) return 'completed';

  const hasInProgress = relevant.some((s) => s.status === 'in_progress');
  if (hasInProgress) return 'in_progress';

  return 'not_started'; // que des 'abandoned'
}

/* ===================================================================
 * CALCULATEUR PRINCIPAL
 * =================================================================== */

/**
 * À partir des séances d'un utilisateur, calcule l'état complet de sa progression.
 * Fonction pure : aucune requête réseau.
 */
export function computeProgress(sessions: SessionRow[]): ProgramProgress {
  const weeks: WeekState[] = [];

  for (let w = 1; w <= 8; w++) {
    const dayA = dayStatusFromSessions(sessions, w, 'A');
    const dayB = dayStatusFromSessions(sessions, w, 'B');
    const dayC = dayStatusFromSessions(sessions, w, 'C');
    const completedDays = [dayA, dayB, dayC].filter((s) => s === 'completed').length;

    weeks.push({
      weekNumber: w,
      phase: phaseFromWeek(w),
      dayA,
      dayB,
      dayC,
      isComplete: completedDays === 3,
      completedDays,
    });
  }

  const firstIncomplete = weeks.find((w) => !w.isComplete);
  const isProgramComplete = firstIncomplete === undefined;

  const currentWeek = firstIncomplete?.weekNumber ?? 8;
  const currentPhase = phaseFromWeek(currentWeek);

  // Pourcentage : nombre de jours complétés / 24 (8 semaines × 3 jours)
  const totalCompletedDays = weeks.reduce((sum, w) => sum + w.completedDays, 0);
  const globalPercent = Math.round((totalCompletedDays / 24) * 100);

  return {
    currentWeek,
    currentPhase,
    weeks,
    isProgramComplete,
    globalPercent,
  };
}

/* ===================================================================
 * HELPERS POUR L'UI
 * =================================================================== */

/**
 * Est-ce que la semaine N est déverrouillée pour cet utilisateur ?
 * Règle : on ne peut accéder qu'aux semaines déjà complètes OU à la semaine courante.
 */
export function isWeekUnlocked(progress: ProgramProgress, weekNumber: number): boolean {
  return weekNumber <= progress.currentWeek;
}

/**
 * Label humain pour l'état d'un jour ("À faire", "En cours 4/6", "Terminé")
 * Utilisera les compteurs d'exercices quand on aura fetch les logs détaillés.
 */
export function dayStatusLabel(status: 'not_started' | 'in_progress' | 'completed'): string {
  switch (status) {
    case 'not_started': return 'À faire';
    case 'in_progress': return 'En cours';
    case 'completed':   return 'Terminé';
  }
}