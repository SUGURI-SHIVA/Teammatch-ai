import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-[9px]">TM</span>
          </div>
          <span className="text-sm font-bold text-gray-900">TeamMatch AI</span>
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-xs text-gray-500">{user.name}</span>
              <button onClick={handleLogout} className="btn-ghost text-xs py-1.5 flex items-center gap-1">
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-xs py-1.5">Login</Link>
              <Link to="/register" className="btn-primary text-xs py-1.5">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
