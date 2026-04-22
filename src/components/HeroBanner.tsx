import heroBanner from '../assets/hero-banner.jpeg';

interface HeroBannerProps {
  variant?: 'full' | 'compact';
}

export function HeroBanner({ variant = 'full' }: HeroBannerProps) {
  return (
    <div className={`hero-banner hero-banner-${variant}`}>
      <img src={heroBanner} alt="Trois athlètes dans une salle de sport" />
      <div className="hero-banner-overlay" />
    </div>
  );
}