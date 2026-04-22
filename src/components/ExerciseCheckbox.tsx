interface ExerciseCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'default' | 'large';
}

export function ExerciseCheckbox({
  checked,
  onChange,
  disabled = false,
  size = 'default',
}: ExerciseCheckboxProps) {
  function handleClick(e: React.MouseEvent) {
    e.stopPropagation(); // Évite que le click bubble à la Row de l'exercice (ouverture modal)
    if (!disabled) onChange(!checked);
  }

  return (
    <button
      type="button"
      className={`ex-checkbox ${checked ? 'checked' : ''} ${size === 'large' ? 'large' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      aria-checked={checked}
      role="checkbox"
      aria-label={checked ? 'Marquer comme non terminé' : 'Marquer comme terminé'}
    >
      {checked && (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
}