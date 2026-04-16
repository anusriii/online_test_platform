import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const showBackButton = !['/', '/dashboard', '/admin', '/register'].includes(location.pathname);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        {showBackButton && (
          <button className="btn-back" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
        <Link to={userInfo ? (userInfo.role === 'admin' ? '/admin' : '/dashboard') : '/'}>
          <span className="brand-icon">⚡</span> MockTest Pro
        </Link>
      </div>
      <div className="nav-links">
        {userInfo ? (
          <>
            <span className="nav-user">Hi, <strong>{userInfo.name}</strong></span>
            {userInfo.role === 'admin' && <Link to="/admin" className="nav-item">Admin Panel</Link>}
            {userInfo.role === 'student' && <Link to="/dashboard" className="nav-item">Dashboard</Link>}
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/" className="nav-item">Login</Link>
            <Link to="/register" className="nav-item highlight">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;