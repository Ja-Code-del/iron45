import { Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  meta?: string;
  showReset?: boolean;
  onReset?: () => void;
}

export function Navbar({ meta = 'Programme adaptatif', showReset = false, onReset }: NavbarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/auth');
  }

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
        {user && (
          <button className="reset-btn" onClick={handleSignOut}>
            Déconnexion
          </button>
        )}
        <ThemeToggle />
      </div>
    </nav>
  );
}