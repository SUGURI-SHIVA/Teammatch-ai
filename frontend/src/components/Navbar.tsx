import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme, themeColors, ThemeColor } from '../context/ThemeContext';
import { Bell, LogOut, User, LayoutDashboard, Palette } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../utils/api';

const colorDots: Record<ThemeColor, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  teal: 'bg-teal-500',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showThemePicker, setShowThemePicker] = useState(false);

  useEffect(() => {
    if (user) {
      api.notifications.unreadCount().then((d) => setUnreadCount(d.count)).catch(() => {});
      const interval = setInterval(() => {
        api.notifications.unreadCount().then((d) => setUnreadCount(d.count)).catch(() => {});
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
              <span className="text-white font-bold text-sm">TM</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TeamMatch AI</span>
          </Link>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowThemePicker(!showThemePicker)}
                className="btn-ghost relative"
                title="Change theme color"
              >
                <Palette size={20} />
              </button>
              {showThemePicker && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-48 z-50">
                  <p className="text-sm font-bold text-gray-700 mb-3">Theme Color</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(themeColors) as ThemeColor[]).map((name) => (
                      <button
                        key={name}
                        onClick={() => { setTheme(name); setShowThemePicker(false); }}
                        className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all ${
                          theme === name ? 'bg-gray-100 ring-2 ring-offset-1' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full ${colorDots[name]}`} />
                        <span className="text-xs capitalize text-gray-600">{name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <>
                <Link to="/dashboard" className="btn-ghost flex items-center space-x-1">
                  <LayoutDashboard size={18} />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
                <Link to="/discover-projects" className="btn-ghost hidden md:inline">Discover Projects</Link>
                <Link to="/find-teammates" className="btn-ghost hidden md:inline">Find Teammates</Link>
                <div className="relative">
                  <Link to="/notifications" className="btn-ghost relative">
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User size={16} />
                  <span className="hidden md:inline">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="btn-ghost text-red-600 flex items-center space-x-1">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Login</Link>
                <Link to="/register" className="btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
