import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { Avatar } from './Avatar';
import { useAuth } from '../context/AuthContext';
import { useDisplayName } from '../hooks/useDisplayName';

interface NavbarProps {
  meta?: string;
  showReset?: boolean;
  onReset?: () => void;
}

export function Navbar({ meta = 'Programme adaptatif', showReset = false, onReset }: NavbarProps) {
  const { user } = useAuth();
  const { displayName } = useDisplayName();
  const navigate = useNavigate();

  return (
    <nav className="top">
      <Link to="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}>
        <span className="logo-dot"></span>
        IRON<span className="logo-num">45</span>
      </Link>
      <div className="nav-right">
        <div className="nav-meta">{meta}</div>
        {showReset && (
          <button className="reset-btn" onClick={onReset}>
            Changer d'objectif
          </button>
        )}
        <ThemeToggle />
        {user && (
          <Avatar
            name={displayName ?? 'Athlete'}
            size="sm"
            onClick={() => navigate('/glory')}
          />
        )}
      </div>
    </nav>
  );
}