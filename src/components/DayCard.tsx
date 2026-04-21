import type { Day, Exercise } from '../types';
import { ICONS } from '../data/icons';

interface DayCardProps {
  day: Day;
  onExerciseClick: (exercise: Exercise) => void;
}

export function DayCard({ day, onExerciseClick }: DayCardProps) {
  return (
    <div className="day">
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
      <div className="day-foot">{day.tip}</div>
    </div>
  );
}