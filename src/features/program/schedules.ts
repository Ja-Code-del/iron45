import type { Objective, ScheduleDay } from '../../types';

export function buildSchedule(objective: Objective): ScheduleDay[] {
  if (objective === 'muscle') {
    return [
      { day: 'Lun', type: 'Push', cls: 'push', dur: '45 min' },
      { day: 'Mar', type: 'Pull', cls: 'pull', dur: '45 min' },
      { day: 'Mer', type: 'Legs', cls: 'legs', dur: '45 min' },
      { day: 'Jeu', type: 'Push', cls: 'push', dur: '45 min' },
      { day: 'Ven', type: 'Pull', cls: 'pull', dur: '45 min' },
      { day: 'Sam', type: 'Legs', cls: 'legs', dur: '45 min' },
      { day: 'Dim', type: 'Repos', cls: 'rest', dur: 'Mobilité' },
    ];
  }
  if (objective === 'fat') {
    return [
      { day: 'Lun', type: 'Full', cls: 'full', dur: '45 min' },
      { day: 'Mar', type: 'Haut', cls: 'push', dur: '45 min' },
      { day: 'Mer', type: 'Repos', cls: 'rest', dur: 'Marche' },
      { day: 'Jeu', type: 'Bas', cls: 'legs', dur: '45 min' },
      { day: 'Ven', type: 'Full', cls: 'full', dur: '45 min' },
      { day: 'Sam', type: 'Haut', cls: 'push', dur: '45 min' },
      { day: 'Dim', type: 'Repos', cls: 'rest', dur: 'Étirements' },
    ];
  }
  if (objective === 'endurance') {
    return [
      { day: 'Lun', type: 'Flow', cls: 'full', dur: '45 min' },
      { day: 'Mar', type: 'Core', cls: 'pull', dur: '45 min' },
      { day: 'Mer', type: 'Bas', cls: 'legs', dur: '45 min' },
      { day: 'Jeu', type: 'Flow', cls: 'full', dur: '45 min' },
      { day: 'Ven', type: 'Core', cls: 'pull', dur: '45 min' },
      { day: 'Sam', type: 'Bas', cls: 'legs', dur: '45 min' },
      { day: 'Dim', type: 'Repos', cls: 'rest', dur: 'Marche' },
    ];
  }
  // balance
  return [
    { day: 'Lun', type: 'Haut', cls: 'push', dur: '45 min' },
    { day: 'Mar', type: 'Cardio', cls: 'cardio', dur: '45 min' },
    { day: 'Mer', type: 'Repos', cls: 'rest', dur: 'Mobilité' },
    { day: 'Jeu', type: 'Bas', cls: 'legs', dur: '45 min' },
    { day: 'Ven', type: 'Haut', cls: 'push', dur: '45 min' },
    { day: 'Sam', type: 'Cardio', cls: 'cardio', dur: '45 min' },
    { day: 'Dim', type: 'Repos', cls: 'rest', dur: 'Étirements' },
  ];
}