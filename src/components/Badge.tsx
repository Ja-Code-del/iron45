import type { BadgeDefinition } from '../features/achievements/catalog';

// Import dynamique de toutes les images du dossier badges/
const badgeImages = import.meta.glob('../assets/badges/*.jpeg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

function getBadgeImage(slug: string): string | null {
  const path = `../assets/badges/${slug}.jpeg`;
  return badgeImages[path] ?? null;
}

interface BadgeProps {
  badge: BadgeDefinition;
  unlocked: boolean;
  onClick?: () => void;
}

export function Badge({ badge, unlocked, onClick }: BadgeProps) {
  const imageSrc = getBadgeImage(badge.slug);

  return (
    <div
      className={`badge-card ${unlocked ? 'unlocked' : 'locked'}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      style={{ '--badge-color': badge.color } as React.CSSProperties}
    >
      <div className="badge-image-wrap">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={badge.name}
            className="badge-image"
            loading="lazy"
          />
        ) : (
          <div className="badge-image-fallback">
            <span className="badge-emoji">{badge.icon}</span>
          </div>
        )}
        {!unlocked && <div className="badge-lock-overlay">🔒</div>}
      </div>
      <div className="badge-info">
        <div className="badge-name">{badge.name}</div>
        <div className="badge-condition">
          {unlocked ? badge.description : badge.unlockCondition}
        </div>
      </div>
    </div>
  );
}