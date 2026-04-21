import type { Level, Constraint, Day } from '../../types';
import { EXERCISES as E } from '../../data/exercises';

type PhaseBuilder = (level: Level, constraints: Constraint[]) => Day[];

// MUSCLE P1
export function buildMuscleP1(level: Level, _constraints: Constraint[]): Day[] {
  const b = level === 'beginner';
  const a = level === 'advanced';
  return [
    {
      letter: 'A', title: 'Push', sub: 'Pectoraux · Épaules · Triceps', badge: 'DAY A',
      tip: 'Repos 60–75 sec entre séries. Tempo 2-0-1.',
      exos: [
        { ...E[b ? 'pushup_knee' : 'pushup_wide'], reps: a ? '4 × 15' : '3 × 10–12' },
        { ...E.pushup_diamond, reps: a ? '4 × 12' : '3 × 10' },
        { ...E.pushup_incline, reps: a ? '4 × 10' : '3 × 8' },
        { ...E.dips_chair, reps: a ? '4 × 15' : '3 × 12' },
        { ...E.pike, reps: a ? '4 × 10' : '3 × 8' },
        { ...E.plank, reps: a ? '3 × 45 sec' : '3 × 30 sec' },
      ],
    },
    {
      letter: 'B', title: 'Pull', sub: 'Dos · Biceps · Ischios', badge: 'DAY B',
      tip: 'Concentre-toi sur la contraction du dos.',
      exos: [
        { ...E.superman, reps: a ? '4 × 18' : '3 × 15' },
        { ...E.rows_table, reps: a ? '4 × 15' : '3 × 12' },
        { ...E.curl_wall, reps: a ? '3 × 30 sec' : '3 × 20 sec' },
        { ...E.hypers, reps: a ? '4 × 15' : '3 × 12' },
        { ...E.bridge, reps: a ? '4 × 20' : '3 × 15' },
        { ...E.deadbug, reps: a ? '3 × 12/côté' : '3 × 8/côté' },
      ],
    },
    {
      letter: 'C', title: 'Legs', sub: 'Quadriceps · Fessiers · Mollets', badge: 'DAY C',
      tip: 'Zéro saut. Mollets 3 sec montée / 3 sec descente.',
      exos: [
        { ...E[b ? 'squat_body' : 'bulgarian'], reps: b ? '3 × 15' : (a ? '4 × 12/j' : '3 × 10/j') },
        { ...E.lunge, reps: a ? '4 × 15/j' : '3 × 12/j' },
        { ...E.hipthrust, reps: a ? '4 × 20' : '4 × 15' },
        { ...E.sissy, reps: a ? '4 × 12' : '3 × 10' },
        { ...E.calves, reps: a ? '4 × 25' : '3 × 20' },
        { ...E.sideplank, reps: a ? '3 × 40 sec/c' : '3 × 25 sec/c' },
      ],
    },
  ];
}

// MUSCLE P2
export function buildMuscleP2(level: Level, _constraints: Constraint[]): Day[] {
  const a = level === 'advanced';
  const b = level === 'beginner';
  return [
    {
      letter: 'A', title: 'Push intense', sub: 'Pectoraux · Épaules · Triceps', badge: 'DAY A',
      tip: 'Si handstand trop dur, pike pieds surélevés.',
      exos: [
        { ...E.pushup_archer, reps: a ? '5 × 10/c' : '4 × 8/c' },
        { ...E.pushup_decline_pause, reps: a ? '5 × 12' : '4 × 10' },
        { ...E[b ? 'pike' : 'hspu'], reps: a ? '4 × 8' : '3 × 5–8' },
        { ...E.dips_slow, reps: a ? '4 × 15' : '4 × 12' },
        { ...E.planche_pu, reps: a ? '4 × 10' : '3 × 8' },
        { ...E.shoulder_tap, reps: a ? '4 × 14/c' : '3 × 10/c' },
      ],
    },
    {
      letter: 'B', title: 'Pull intense', sub: 'Dos · Biceps · Ischios', badge: 'DAY B',
      tip: 'Nordic curl : chevilles fixées, descente la plus lente.',
      exos: [
        { ...E.australian, reps: a ? '5 × 12' : '4 × 10' },
        { ...E.superman_hold, reps: a ? '5 × 15' : '4 × 12' },
        { ...E.nordic, reps: a ? '4 × 6' : '3 × 5' },
        { ...E.bridge_single, reps: a ? '4 × 15/j' : '4 × 12/j' },
        { ...E.facepull, reps: a ? '4 × 20' : '3 × 15' },
        { ...E.hollow, reps: a ? '4 × 45 sec' : '3 × 30 sec' },
      ],
    },
    {
      letter: 'C', title: 'Legs intense', sub: 'Quadriceps · Fessiers · Mollets', badge: 'DAY C',
      tip: 'Pistol squat : talon posé, buste légèrement penché.',
      exos: [
        { ...E[b ? 'bulgarian' : 'pistol'], reps: b ? '4 × 12/j' : (a ? '5 × 10/j' : '4 × 8/j') },
        { ...E.lunge_walk, reps: a ? '5 × 14/j' : '4 × 12/j' },
        { ...E.hipthrust_single, reps: a ? '5 × 14/j' : '4 × 12/j' },
        { ...E.wallsit, reps: a ? '3 × 60 sec' : '3 × 45 sec' },
        { ...E.calves_single, reps: a ? '4 × 18/j' : '3 × 15/j' },
        { ...E.side_dyn, reps: a ? '4 × 12/c' : '3 × 10/c' },
      ],
    },
  ];
}

// FAT P1
export function buildFatP1(level: Level, constraints: Constraint[]): Day[] {
  const noise = constraints.includes('noise');
  const a = level === 'advanced';
  return [
    {
      letter: 'A', title: 'Full body burn', sub: 'Circuit · Haute dépense', badge: 'DAY A',
      tip: 'Circuit : 3 tours, repos 30 sec entre exos, 90 sec entre tours.',
      exos: [
        { ...E.squat_body, reps: a ? '15' : '12' },
        { ...E.pushup_wide, reps: a ? '12' : '8–10' },
        { ...E.lunge, reps: a ? '12/j' : '10/j' },
        { ...E[noise ? 'mountain_climb' : 'high_knee'], reps: '40 sec' },
        { ...E.plank, reps: '40 sec' },
        { ...E[noise ? 'shadow_punch' : 'jack_silent'], reps: '45 sec' },
      ],
    },
    {
      letter: 'B', title: 'Haut + cardio', sub: 'Upper body + finisher', badge: 'DAY B',
      tip: '4 tours à rythme soutenu. Contrôle ta respiration.',
      exos: [
        { ...E.pushup_wide, reps: '10–12' },
        { ...E.rows_table, reps: '12' },
        { ...E.dips_chair, reps: '12' },
        { ...E.pike, reps: '8' },
        { ...E.shadow_punch, reps: '60 sec' },
        { ...E.plank, reps: '30 sec' },
      ],
    },
    {
      letter: 'C', title: 'Bas + core', sub: 'Lower body + abdominaux', badge: 'DAY C',
      tip: 'Tempo soutenu. Le bas du corps brûle le plus de calories.',
      exos: [
        { ...E.bulgarian, reps: a ? '12/j' : '10/j' },
        { ...E.hipthrust, reps: '20' },
        { ...E.lunge, reps: '12/j' },
        { ...E.calves, reps: '20' },
        { ...E.deadbug, reps: '10/côté' },
        { ...E.sideplank, reps: '30 sec/c' },
      ],
    },
  ];
}

// FAT P2
export function buildFatP2(level: Level, _constraints: Constraint[]): Day[] {
  const a = level === 'advanced';
  return [
    {
      letter: 'A', title: 'Full body intense', sub: 'Circuit dense · Brûlure', badge: 'DAY A',
      tip: 'Circuit : 4 tours, repos 20 sec seulement. Pousse.',
      exos: [
        { ...E.burpee_low, reps: a ? '12' : '10' },
        { ...E.pushup_wide, reps: a ? '15' : '12' },
        { ...E.squat_body, reps: a ? '20' : '15' },
        { ...E.mountain_climb, reps: '45 sec' },
        { ...E.plank, reps: '45 sec' },
        { ...E.shadow_punch, reps: '60 sec' },
      ],
    },
    {
      letter: 'B', title: 'Haut + endurance', sub: 'Upper body · Volume', badge: 'DAY B',
      tip: '5 tours. Chaque semaine, réduis le repos de 5 sec.',
      exos: [
        { ...E.pushup_archer, reps: '8/côté' },
        { ...E.australian, reps: '12' },
        { ...E.dips_slow, reps: '15' },
        { ...E.pike, reps: '10' },
        { ...E.hollow, reps: '40 sec' },
        { ...E.shoulder_tap, reps: '12/c' },
      ],
    },
    {
      letter: 'C', title: 'Bas intense', sub: 'Lower body · Combustion', badge: 'DAY C',
      tip: 'Pousse sur chaque série. Dernière rep = limite.',
      exos: [
        { ...E.bulgarian, reps: a ? '15/j' : '12/j' },
        { ...E.hipthrust_single, reps: '12/j' },
        { ...E.lunge_walk, reps: '14/j' },
        { ...E.wallsit, reps: '45 sec' },
        { ...E.calves, reps: '25' },
        { ...E.side_dyn, reps: '12/c' },
      ],
    },
  ];
}

// ENDURANCE P1
export function buildEndP1(_level: Level, constraints: Constraint[]): Day[] {
  const noise = constraints.includes('noise');
  return [
    {
      letter: 'A', title: 'Full body flow', sub: 'Circuit long · Régulier', badge: 'DAY A',
      tip: 'Circuit : 4 tours, repos 30 sec, rythme constant du début à la fin.',
      exos: [
        { ...E.squat_body, reps: '15' },
        { ...E.pushup_wide, reps: '10' },
        { ...E.lunge, reps: '10/j' },
        { ...E.plank, reps: '40 sec' },
        { ...E[noise ? 'mountain_climb' : 'high_knee'], reps: '40 sec' },
        { ...E[noise ? 'shadow_punch' : 'jack_silent'], reps: '45 sec' },
      ],
    },
    {
      letter: 'B', title: 'Core + haut', sub: 'Gainage · Bras · Dos', badge: 'DAY B',
      tip: 'Enchaîne sans pause. Respire par le nez si possible.',
      exos: [
        { ...E.pushup_wide, reps: '12' },
        { ...E.rows_table, reps: '12' },
        { ...E.dips_chair, reps: '12' },
        { ...E.plank, reps: '45 sec' },
        { ...E.deadbug, reps: '10/c' },
        { ...E.bird_dog, reps: '10/c' },
      ],
    },
    {
      letter: 'C', title: 'Bas + cardio', sub: 'Jambes · Capacité aérobie', badge: 'DAY C',
      tip: 'Régularité plus importante que l\'intensité.',
      exos: [
        { ...E.bulgarian, reps: '10/j' },
        { ...E.hipthrust, reps: '18' },
        { ...E.lunge, reps: '12/j' },
        { ...E.calves, reps: '20' },
        { ...E[noise ? 'shadow_punch' : 'high_knee'], reps: '60 sec' },
        { ...E.sideplank, reps: '30 sec/c' },
      ],
    },
  ];
}

// ENDURANCE P2
export function buildEndP2(_level: Level, constraints: Constraint[]): Day[] {
  const noise = constraints.includes('noise');
  return [
    {
      letter: 'A', title: 'Flow intense', sub: 'Circuit · Durée', badge: 'DAY A',
      tip: '5 tours sans pause entre exos. Repos 60 sec entre tours.',
      exos: [
        { ...E.squat_body, reps: '20' },
        { ...E.pushup_wide, reps: '12' },
        { ...E.lunge_walk, reps: '12/j' },
        { ...E.plank, reps: '60 sec' },
        { ...E.mountain_climb, reps: '50 sec' },
        { ...E.shoulder_tap, reps: '15/c' },
      ],
    },
    {
      letter: 'B', title: 'Core + haut intense', sub: 'Gainage · Bras · Dos', badge: 'DAY B',
      tip: 'Chaque semaine, ajoute 5 sec sur les gainages.',
      exos: [
        { ...E.pushup_archer, reps: '8/c' },
        { ...E.australian, reps: '12' },
        { ...E.dips_slow, reps: '12' },
        { ...E.hollow, reps: '45 sec' },
        { ...E.bird_dog, reps: '12/c' },
        { ...E.shoulder_tap, reps: '14/c' },
      ],
    },
    {
      letter: 'C', title: 'Bas + cardio intense', sub: 'Jambes · Durée', badge: 'DAY C',
      tip: 'L\'endurance se construit dans les 20 dernières secondes.',
      exos: [
        { ...E.bulgarian, reps: '12/j' },
        { ...E.hipthrust_single, reps: '12/j' },
        { ...E.lunge_walk, reps: '14/j' },
        { ...E.wallsit, reps: '60 sec' },
        { ...E[noise ? 'shadow_punch' : 'high_knee'], reps: '75 sec' },
        { ...E.side_dyn, reps: '12/c' },
      ],
    },
  ];
}

// BALANCE P1
export function buildBalP1(_level: Level, constraints: Constraint[]): Day[] {
  const noise = constraints.includes('noise');
  return [
    {
      letter: 'A', title: 'Force haut', sub: 'Pectoraux · Dos · Épaules', badge: 'DAY A',
      tip: 'Force le matin, tempo contrôlé, repos 60 sec.',
      exos: [
        { ...E.pushup_wide, reps: '3 × 10' },
        { ...E.rows_table, reps: '3 × 12' },
        { ...E.dips_chair, reps: '3 × 10' },
        { ...E.pike, reps: '3 × 8' },
        { ...E.plank, reps: '3 × 30 sec' },
        { ...E.cat_cow, reps: '10 cycles' },
      ],
    },
    {
      letter: 'B', title: 'Cardio + core', sub: 'Circuit · Abdominaux', badge: 'DAY B',
      tip: 'Circuit 3 tours, repos 45 sec.',
      exos: [
        { ...E[noise ? 'mountain_climb' : 'high_knee'], reps: '40 sec' },
        { ...E.squat_body, reps: '15' },
        { ...E[noise ? 'shadow_punch' : 'jack_silent'], reps: '45 sec' },
        { ...E.plank, reps: '40 sec' },
        { ...E.deadbug, reps: '10/c' },
        { ...E.sideplank, reps: '30 sec/c' },
      ],
    },
    {
      letter: 'C', title: 'Force bas', sub: 'Quadriceps · Fessiers · Mollets', badge: 'DAY C',
      tip: 'Focus technique, pas d\'à-coups.',
      exos: [
        { ...E.bulgarian, reps: '3 × 10/j' },
        { ...E.hipthrust, reps: '3 × 15' },
        { ...E.lunge, reps: '3 × 12/j' },
        { ...E.calves, reps: '3 × 20' },
        { ...E.bridge, reps: '3 × 15' },
        { ...E.bird_dog, reps: '3 × 10/c' },
      ],
    },
  ];
}

// BALANCE P2
export function buildBalP2(_level: Level, constraints: Constraint[]): Day[] {
  const noise = constraints.includes('noise');
  return [
    {
      letter: 'A', title: 'Force haut intense', sub: 'Pectoraux · Dos · Épaules', badge: 'DAY A',
      tip: 'Tempo 2-0-1 sur tout, repos 75 sec.',
      exos: [
        { ...E.pushup_archer, reps: '4 × 8/c' },
        { ...E.australian, reps: '4 × 10' },
        { ...E.dips_slow, reps: '4 × 12' },
        { ...E.pike, reps: '4 × 10' },
        { ...E.hollow, reps: '3 × 40 sec' },
        { ...E.cat_cow, reps: '12 cycles' },
      ],
    },
    {
      letter: 'B', title: 'Cardio + core intense', sub: 'Circuit · Abdominaux', badge: 'DAY B',
      tip: '4 tours, repos 30 sec seulement.',
      exos: [
        { ...E.mountain_climb, reps: '45 sec' },
        { ...E.squat_body, reps: '18' },
        { ...E[noise ? 'shadow_punch' : 'high_knee'], reps: '50 sec' },
        { ...E.shoulder_tap, reps: '14/c' },
        { ...E.deadbug, reps: '12/c' },
        { ...E.side_dyn, reps: '10/c' },
      ],
    },
    {
      letter: 'C', title: 'Force bas intense', sub: 'Quadriceps · Fessiers · Mollets', badge: 'DAY C',
      tip: 'Variantes unilatérales = double surcharge.',
      exos: [
        { ...E.pistol, reps: '4 × 8/j' },
        { ...E.hipthrust_single, reps: '4 × 12/j' },
        { ...E.lunge_walk, reps: '4 × 12/j' },
        { ...E.wallsit, reps: '3 × 45 sec' },
        { ...E.calves_single, reps: '3 × 15/j' },
        { ...E.bird_dog, reps: '3 × 12/c' },
      ],
    },
  ];
}

export const PHASE_BUILDERS: Record<string, PhaseBuilder> = {
  muscle_p1: buildMuscleP1, muscle_p2: buildMuscleP2,
  fat_p1: buildFatP1,       fat_p2: buildFatP2,
  end_p1: buildEndP1,       end_p2: buildEndP2,
  bal_p1: buildBalP1,       bal_p2: buildBalP2,
};