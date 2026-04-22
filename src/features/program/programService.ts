import { supabase } from '../../lib/supabase';
import type { Objective, Level, Constraint } from '../../types';
import type { Database } from '../../types/database';

type ProgramRow = Database['public']['Tables']['programs']['Row'];

export interface ProgramInput {
  objective: Objective;
  level: Level;
  constraints: Constraint[];
}

/**
 * Récupère le programme actif de l'utilisateur connecté, s'il existe.
 */
export async function getActiveProgram(userId: string): Promise<ProgramRow | null> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[getActiveProgram] erreur:', error);
    return null;
  }
  return data;
}

/**
 * Crée un nouveau programme actif.
 * Archive automatiquement tout programme actif précédent.
 */
export async function createProgram(userId: string, input: ProgramInput): Promise<ProgramRow | null> {
  const { error: archiveError } = await supabase
    .from('programs')
    .update({ status: 'archived', archived_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('status', 'active');

  if (archiveError) {
    console.error('[createProgram] erreur archivage:', archiveError);
    return null;
  }

  const { data, error } = await supabase
    .from('programs')
    .insert({
      user_id: userId,
      objective: input.objective,
      level: input.level,
      constraints: input.constraints,
      status: 'active',
    })
    .select()
    .single();

  if (error) {
    console.error('[createProgram] erreur création:', error);
    return null;
  }
  return data;
}

/**
 * Archive le programme actif sans en créer un nouveau.
 */
export async function archiveActiveProgram(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('programs')
    .update({ status: 'archived', archived_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('status', 'active');

  if (error) {
    console.error('[archiveActiveProgram] erreur:', error);
    return false;
  }
  return true;
}