interface StreakDisplayProps {
  streak: number;
}

export function StreakDisplay({ streak }: StreakDisplayProps) {
  if (streak === 0) {
    return (
      <div className="streak-display streak-zero">
        <span className="streak-label">Streak actuel</span>
        <span className="streak-value">—</span>
        <span className="streak-sub">Commence aujourd'hui</span>
      </div>
    );
  }

  const fireCount = Math.min(Math.ceil(streak / 7), 3); // 1 flamme pour 1-7 j, 2 pour 8-14, 3 pour 15+
  const fires = '🔥'.repeat(fireCount);

  return (
    <div className="streak-display">
      <span className="streak-label">Streak actuel</span>
      <span className="streak-value">
        {streak} <span className="streak-unit">{streak === 1 ? 'jour' : 'jours'}</span>
      </span>
      <span className="streak-fires">{fires}</span>
    </div>
  );
}