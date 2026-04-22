import { useEffect } from 'react';

export type CelebrationType = 'day' | 'week' | 'phase' | 'program';

interface CelebrationProps {
  type: CelebrationType;
  title: string;
  subtitle: string;
  detail?: string;
  onDismiss: () => void;
  autoClose?: number; // ms avant fermeture auto (0 = manuel uniquement)
}

export function Celebration({
  type,
  title,
  subtitle,
  detail,
  onDismiss,
  autoClose = 0,
}: CelebrationProps) {
  useEffect(() => {
    if (autoClose > 0) {
      const timer = setTimeout(onDismiss, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onDismiss]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' || e.key === 'Enter') onDismiss();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onDismiss]);

  return (
    <div className={`celebration celebration-${type}`}>
      <div className="celebration-content">
        {/* Particules décoratives */}
        <div className="celebration-particles">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={`particle particle-${i % 4}`} style={{
              animationDelay: `${i * 0.08}s`,
            }} />
          ))}
        </div>

        <div className="celebration-main">
          <div className="celebration-type">
            {type === 'day'     && '★ JOUR COMPLÉTÉ'}
            {type === 'week'    && '★★ SEMAINE COMPLÉTÉE'}
            {type === 'phase'   && '★★★ PHASE COMPLÉTÉE'}
            {type === 'program' && '★★★★ PROGRAMME TERMINÉ'}
          </div>

          <h2 className="celebration-title">{title}</h2>
          <p className="celebration-subtitle">{subtitle}</p>
          {detail && <div className="celebration-detail">{detail}</div>}

          <button className="celebration-btn" onClick={onDismiss}>
            Continuer →
          </button>
        </div>
      </div>
    </div>
  );
}