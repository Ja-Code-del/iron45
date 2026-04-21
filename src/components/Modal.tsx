import { useEffect } from 'react';
import type { Exercise } from '../types';
import { ICONS } from '../data/icons';

interface ModalProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export function Modal({ exercise, onClose }: ModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (exercise) {
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
  }, [exercise, onClose]);

  if (!exercise) return null;

  return (
    <div className="modal-back" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Fermer">×</button>
        <div
          className="modal-illus"
          dangerouslySetInnerHTML={{ __html: ICONS[exercise.icon] || '' }}
        />
        <h3>{exercise.name}</h3>
        <div className="modal-sub">{exercise.muscle}</div>
        {exercise.reps && <div className="modal-reps">{exercise.reps}</div>}
        <div className="modal-cue">{exercise.cue}</div>
      </div>
    </div>
  );
}