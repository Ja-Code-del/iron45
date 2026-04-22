export type Objective = 'muscle' | 'fat' | 'endurance' | 'balance';
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Constraint = 'noise' | 'injury' | 'none';
export type Theme = 'dark' | 'light';

export interface Profile {
  objective: Objective | null;
  level: Level | null;
  constraints: Constraint[];
}

export interface Exercise {
  key: string;
  name: string;
  muscle: string;
  icon: string;
  cue: string;
  reps?: string;
}

export interface Day {
  letter: string;
  title: string;
  sub: string;
  badge: string;
  tip: string;
  exos: Exercise[];
}

export interface ScheduleDay {
  day: string;
  type: string;
  cls: 'push' | 'pull' | 'legs' | 'rest' | 'cardio' | 'full';
  dur: string;
}

export interface Principle {
  n: string;
  title: string;
  text: string;
}

export interface ProfileConfig {
  hero_title: string;
  hero_sub: string;
  manifesto: string;
  sessions: number;
  phases: [string, string];
  p1_title: string;
  p1_sub: string;
  p2_title: string;
  p2_sub: string;
}