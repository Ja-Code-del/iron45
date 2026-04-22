import type { Day, Exercise } from '../types';
import { ICONS } from '../data/icons';

export type DayProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'locked';

interface DayCardProps {
  day: Day;
  onExerciseClick: (exercise: Exercise) => void;
  status?: DayProgressStatus;
  onStart?: () => void;
  dayLetter?: 'A' | 'B' | 'C';
  weekNumber?: number;
}

export function DayCard({
  day,
  onExerciseClick,
  status = 'not_started',
  onStart,
  dayLetter,
  weekNumber,
}: DayCardProps) {
  const showStartButton = status === 'not_started' && onStart;
  const showResumeButton = status === 'in_progress' && onStart;
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';

  return (
    <div className={`day ${isLocked ? 'day-locked' : ''} ${isCompleted ? 'day-completed' : ''}`}>
      <div className="day-head">
        <div className="day-head-l">
          <div className="day-letter">{day.letter}</div>
          <div>
            <div className="day-head-t">{day.title}</div>
            <div className="day-head-s">{day.sub}</div>
          </div>
        </div>
        <div className="day-badge">{day.badge}</div>
      </div>

      {/* Barre de statut en haut de la carte */}
      {status !== 'not_started' && (
        <div className={`day-status-bar day-status-${status}`}>
          {status === 'in_progress' && '● Séance en cours'}
          {status === 'completed' && '✓ Terminé'}
          {status === 'locked' && `🔒 Déverrouillé en semaine ${weekNumber}`}
        </div>
      )}

      <div className="exercises">
        {day.exos.map((ex, i) => (
          <div
            key={`${day.letter}-${i}`}
            className="exercise"
            onClick={() => onExerciseClick(ex)}
          >
            <div
              className="ex-illus"
              dangerouslySetInnerHTML={{ __html: ICONS[ex.icon] || '' }}
            />
            <div className="ex-body">
              <div className="ex-name">{ex.name}</div>
              <div className="ex-muscle">{ex.muscle}</div>
            </div>
            <div className="ex-reps">{ex.reps}</div>
          </div>
        ))}
      </div>

      <div className="day-foot">
        {(showStartButton || showResumeButton) && (
          <button className="day-start-btn" onClick={onStart} disabled={isLocked}>
            {showResumeButton ? 'Reprendre la séance →' : 'Commencer la séance →'}
          </button>
        )}
        {!showStartButton && !showResumeButton && (
          <div className="day-tip">{day.tip}</div>
        )}
      </div>
    </div>
  );
}