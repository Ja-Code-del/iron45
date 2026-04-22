import { getAvatarColor } from '../features/achievements/helpers';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
}

export function Avatar({ name, size = 'md', onClick }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  const color = getAvatarColor(name);

  return (
    <div
      className={`avatar avatar-${size} ${onClick ? 'avatar-clickable' : ''}`}
      style={{ backgroundColor: color }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      aria-label={onClick ? `Profil de ${name}` : undefined}
    >
      {initial}
    </div>
  );
}