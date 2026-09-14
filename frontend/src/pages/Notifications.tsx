import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Bell, Check, CheckCheck } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    try {
      const data = await api.notifications.list();
      setNotifications(Array.isArray(data) ? data : []);
    } catch { setNotifications([]); }
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    try {
      await api.notifications.read(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await api.notifications.readAll();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

  const handleClick = async (notif: any) => {
    if (!notif.read) await markAsRead(notif.id);
    if (notif.link) {
      const linkMap: Record<string, string> = {
        '/invitations': '/invitations',
        '/join-requests': '/join-requests',
      };
      const target = linkMap[notif.link] || notif.link;
      navigate(target);
    }
  };

  const unread = notifications.filter((n) => !n.read);

  if (loading) return <div className="p-8 text-center text-sm text-gray-500">Loading notifications...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{unread.length > 0 ? `${unread.length} unread notifications` : 'All caught up'}</p>
        </div>
        {unread.length > 0 && (
          <button onClick={markAllAsRead} className="btn-ghost text-xs flex items-center gap-1">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16">
          <Bell size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No notifications yet</p>
          <p className="text-xs text-gray-400 mt-1">You'll see updates about invitations, requests, and team activity here</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => handleClick(notif)}
              className={`w-full card flex items-start gap-3 py-3 text-left transition-all hover:bg-gray-50 cursor-pointer ${!notif.read ? 'border-l-2 border-l-blue-500 bg-blue-50/30' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${!notif.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Bell size={14} className={notif.read ? 'text-gray-400' : 'text-blue-600'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${!notif.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>{notif.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                {notif.link && <p className="text-[10px] text-blue-500 mt-1">Click to view →</p>}
              </div>
              {!notif.read && (
                <span className="text-xs text-blue-600 flex-shrink-0">
                  <Check size={14} />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
