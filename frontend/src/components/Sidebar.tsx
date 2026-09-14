import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Search, Users, FolderOpen, Bell, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/discover-projects', icon: Search, label: 'Discover Projects' },
  { to: '/find-teammates', icon: Users, label: 'Find Teammates' },
  { to: '/invitations', icon: FolderOpen, label: 'Invitations' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/student-profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      api.notifications.unreadCount().then((d) => setUnreadCount(d.count)).catch(() => {});
      const interval = setInterval(() => {
        api.notifications.unreadCount().then((d) => setUnreadCount(d.count)).catch(() => {});
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <aside className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-40 transition-all duration-200 flex flex-col ${collapsed ? 'w-16' : 'w-56'}`}>
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 h-14 border-b border-gray-100`}>
        {!collapsed && (
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">TM</span>
            </div>
            <span className="text-sm font-bold text-gray-900">TeamMatch AI</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">TM</span>
          </div>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center ${collapsed ? 'justify-center' : ''} px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className={active ? 'text-blue-600' : 'text-gray-400'} />
              {!collapsed && <span className="ml-2.5">{label}</span>}
              {to === '/notifications' && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-100 p-2">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={logout}
          className={`flex items-center ${collapsed ? 'justify-center' : ''} w-full px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span className="ml-2.5">Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full px-3 py-1.5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
