import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  listSessionsForProgram,
  getInProgressSession,
  createSession,
  abandonSession,
  type SessionWithLogs,
} from '../features/program/sessionService';
import {
  computeProgress,
  type ProgramProgress,
  type DayLetter,
} from '../features/program/progressHelpers';
import type { Day } from '../types';
import type { Database } from '../types/database';

type SessionRow = Database['public']['Tables']['workout_sessions']['Row'];

interface UseSessionsArgs {
  programId: string | null;
}

interface StartSessionArgs {
  phase: 1 | 2;
  weekNumber: number;
  dayLetter: DayLetter;
  day: Day;
  onConflict?: (existingSession: SessionRow) => Promise<'abandon' | 'resume' | 'cancel'>;
}

export interface UseSessionsReturn {
  sessions: SessionRow[];
  progress: ProgramProgress;
  inProgressSession: SessionRow | null;
  loading: boolean;
  refresh: () => Promise<void>;
  startSession: (args: StartSessionArgs) => Promise<SessionWithLogs | null>;
}

const EMPTY_PROGRESS: ProgramProgress = {
  currentWeek: 1,
  currentPhase: 1,
  weeks: [],
  isProgramComplete: false,
  globalPercent: 0,
};

export function useSessions({ programId }: UseSessionsArgs): UseSessionsReturn {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [inProgressSession, setInProgressSession] = useState<SessionRow | null>(null);
  const [loading, setLoading] = useState(true);

  /* ===================================================================
   * LECTURE INITIALE & RAFRAÎCHISSEMENT
   * =================================================================== */

  const refresh = useCallback(async () => {
    if (!user || !programId) {
      setSessions([]);
      setInProgressSession(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const [list, inProgress] = await Promise.all([
      listSessionsForProgram(programId),
      getInProgressSession(user.id),
    ]);
    setSessions(list);
    setInProgressSession(inProgress);
    setLoading(false);
  }, [user, programId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /* ===================================================================
   * DÉMARRER UNE SÉANCE
   * =================================================================== */

  const startSession = useCallback(
    async (args: StartSessionArgs): Promise<SessionWithLogs | null> => {
      if (!user || !programId) return null;

      // Cas 1 : pas de séance en cours → démarrage direct
      if (!inProgressSession) {
        const created = await createSession({
          programId,
          userId: user.id,
          phase: args.phase,
          weekNumber: args.weekNumber,
          dayLetter: args.dayLetter,
          day: args.day,
        });
        if (created) {
          await refresh();
        }
        return created;
      }

      // Cas 2 : une séance est déjà en cours
      // Si c'est la MÊME (même week + day) : on la reprend directement, pas de prompt
      const isSameSession =
        inProgressSession.week_number === args.weekNumber &&
        inProgressSession.day_letter === args.dayLetter;

      if (isSameSession) {
        // L'utilisateur veut reprendre la séance en cours — on ne recrée rien, on renvoie la session existante via fetch
        return null; // La page /program s'occupera de naviguer vers /session/:id avec son id
      }

      // Cas 3 : une AUTRE séance est en cours → on demande confirmation
      const choice = args.onConflict
        ? await args.onConflict(inProgressSession)
        : 'cancel';

      if (choice === 'cancel') return null;

      if (choice === 'resume') {
        // L'utilisateur préfère reprendre la séance existante
        return null; // idem : la page /program navigue vers la session existante
      }

      // choice === 'abandon' → on abandonne l'ancienne, on crée la nouvelle
      await abandonSession(inProgressSession.id);
      const created = await createSession({
        programId,
        userId: user.id,
        phase: args.phase,
        weekNumber: args.weekNumber,
        dayLetter: args.dayLetter,
        day: args.day,
      });
      if (created) {
        await refresh();
      }
      return created;
    },
    [user, programId, inProgressSession, refresh]
  );

  /* ===================================================================
   * CALCUL DE LA PROGRESSION (dérivé, pas de state)
   * =================================================================== */

  const progress = programId ? computeProgress(sessions) : EMPTY_PROGRESS;

  return {
    sessions,
    progress,
    inProgressSession,
    loading,
    refresh,
    startSession,
  };
}