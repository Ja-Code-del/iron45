import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database';
import type { Day, Exercise } from '../../types';

type SessionRow = Database['public']['Tables']['workout_sessions']['Row'];
type ExerciseLogRow = Database['public']['Tables']['exercise_logs']['Row'];

export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';
export type DayLetter = 'A' | 'B' | 'C';

export interface SessionWithLogs extends SessionRow {
  exercise_logs: ExerciseLogRow[];
}

/* ===================================================================
 * LECTURE
 * =================================================================== */

/**
 * Récupère toutes les séances d'un programme (pour calculer la semaine courante, etc.)
 */
export async function listSessionsForProgram(programId: string): Promise<SessionRow[]> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('program_id', programId)
    .order('started_at', { ascending: true });

  if (error) {
    console.error('[listSessionsForProgram] erreur:', error);
    return [];
  }
  return data ?? [];
}

/**
 * Récupère UNE séance avec ses exercise_logs (pour la page /session/:id)
 */
export async function getSessionWithLogs(sessionId: string): Promise<SessionWithLogs | null> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*, exercise_logs(*)')
    .eq('id', sessionId)
    .maybeSingle();

  if (error) {
    console.error('[getSessionWithLogs] erreur:', error);
    return null;
  }

  if (!data) return null;

  // On trie les exos par order_index pour un affichage déterministe
  const logs = [...(data.exercise_logs ?? [])].sort((a, b) => a.order_index - b.order_index);

  return { ...data, exercise_logs: logs };
}

/**
 * Récupère la séance 'in_progress' de l'utilisateur (il ne peut y en avoir qu'une à la fois)
 */
export async function getInProgressSession(userId: string): Promise<SessionRow | null> {
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'in_progress')
    .maybeSingle();

  if (error) {
    console.error('[getInProgressSession] erreur:', error);
    return null;
  }
  return data;
}

/* ===================================================================
 * CRÉATION
 * =================================================================== */

export interface CreateSessionInput {
  programId: string;
  userId: string;
  phase: 1 | 2;
  weekNumber: number;
  dayLetter: DayLetter;
  day: Day;
}

/**
 * Crée une nouvelle séance 'in_progress' + crée les 6 exercise_logs liés.
 * Retourne la séance créée avec ses logs pour affichage immédiat.
 */
export async function createSession(input: CreateSessionInput): Promise<SessionWithLogs | null> {
  // 1. Créer la session
  const { data: session, error: sessionError } = await supabase
    .from('workout_sessions')
    .insert({
      program_id: input.programId,
      user_id: input.userId,
      phase: input.phase,
      week_number: input.weekNumber,
      day_letter: input.dayLetter,
      status: 'in_progress',
    })
    .select()
    .single();

  if (sessionError || !session) {
    console.error('[createSession] erreur création session:', sessionError);
    return null;
  }

  // 2. Créer les exercise_logs associés
  const logsToInsert = input.day.exos.map((exo: Exercise, index: number) => ({
    session_id: session.id,
    user_id: input.userId,
    exercise_key: exo.icon, // on utilise `icon` comme clé unique car c'est notre identifiant dans EXERCISES
    order_index: index,
    target_reps: exo.reps ?? '',
    completed: false,
    sets_completed: [],
  }));

  const { data: logs, error: logsError } = await supabase
    .from('exercise_logs')
    .insert(logsToInsert)
    .select();

  if (logsError || !logs) {
    console.error('[createSession] erreur création logs:', logsError);
    // Rollback manuel : on supprime la session orpheline
    await supabase.from('workout_sessions').delete().eq('id', session.id);
    return null;
  }

  return {
    ...session,
    exercise_logs: logs.sort((a, b) => a.order_index - b.order_index),
  };
}

/* ===================================================================
 * MISE À JOUR
 * =================================================================== */

/**
 * Coche / décoche un exercice dans une séance.
 * Retourne true en cas de succès.
 */
export async function toggleExerciseCompletion(
  logId: string,
  completed: boolean
): Promise<boolean> {
  const { error } = await supabase
    .from('exercise_logs')
    .update({ completed })
    .eq('id', logId);

  if (error) {
    console.error('[toggleExerciseCompletion] erreur:', error);
    return false;
  }
  return true;
}

/**
 * Termine une séance : met status='completed', completed_at=now, et éventuellement feeling/notes.
 */
export interface CompleteSessionInput {
  sessionId: string;
  durationSeconds: number;
  feeling?: 'easy' | 'medium' | 'hard' | 'exhausting';
  notes?: string;
}

export async function completeSession(input: CompleteSessionInput): Promise<boolean> {
  const { error } = await supabase
    .from('workout_sessions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      duration_seconds: input.durationSeconds,
      feeling: input.feeling ?? null,
      notes: input.notes ?? null,
    })
    .eq('id', input.sessionId);

  if (error) {
    console.error('[completeSession] erreur:', error);
    return false;
  }
  return true;
}

/**
 * Marque une séance comme 'abandoned' (utile pour la confirmation de l'option C).
 */
export async function abandonSession(sessionId: string): Promise<boolean> {
  const { error } = await supabase
    .from('workout_sessions')
    .update({
      status: 'abandoned',
      completed_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (error) {
    console.error('[abandonSession] erreur:', error);
    return false;
  }
  return true;
}