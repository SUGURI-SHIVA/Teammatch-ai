import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Bell, CheckCircle, XCircle, Mail, Users } from 'lucide-react';

const iconMap: Record<string, any> = {
  INVITATION_RECEIVED: Mail,
  INVITATION_ACCEPTED: CheckCircle,
  INVITATION_DECLINED: XCircle,
  JOIN_REQUEST_RECEIVED: Users,
  JOIN_REQUEST_ACCEPTED: CheckCircle,
  JOIN_REQUEST_REJECTED: XCircle,
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadNotifications(); }, []);

  const loadNotifications = async () => {
    try {
      const data = await api.notifications.list();
      setNotifications(data);
      await api.notifications.readAll();
    } catch {}
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/dashboard" className="text-sm text-primary-600 hover:underline flex items-center space-x-1 mb-6">
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600 mb-8">Stay updated on your team activities</p>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const Icon = iconMap[notif.type] || Bell;
              return (
                <div key={notif.id} className={`card flex items-start space-x-4 ${!notif.read ? 'border-l-4 border-l-primary-500' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notif.read ? 'bg-gray-100 text-gray-500' : 'bg-primary-100 text-primary-600'
                  }`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${!notif.read ? 'text-gray-900' : 'text-gray-600'}`}>{notif.title}</p>
                    <p className="text-sm text-gray-500">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
                  </div>
                  {notif.link && (
                    <Link to={notif.link} className="text-sm text-primary-600 hover:underline">View</Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
