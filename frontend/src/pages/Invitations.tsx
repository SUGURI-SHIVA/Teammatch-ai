import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Check, X, FolderOpen, Clock } from 'lucide-react';

export default function Invitations() {
  const [received, setReceived] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { loadInvitations(); }, []);

  const loadInvitations = async () => {
    try {
      const [r, s] = await Promise.allSettled([
        api.invitations.received(),
        api.invitations.sent(),
      ]);
      if (r.status === 'fulfilled') setReceived(r.value);
      if (s.status === 'fulfilled') setSent(s.value);
    } catch {}
    setLoading(false);
  };

  const handleAction = async (id: string, action: 'accepted' | 'declined') => {
    setActionLoading(id);
    try {
      if (action === 'accepted') await api.invitations.accept(id);
      else await api.invitations.decline(id);
      setReceived((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: action } : inv));
    } catch {}
    setActionLoading(null);
  };

  if (loading) return <div className="p-8 text-center text-sm text-gray-500">Loading invitations...</div>;

  const pendingReceived = received.filter((i) => i.status === 'pending');
  const pendingSent = sent.filter((i) => i.status === 'pending');

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="page-title">Invitations</h1>
        <p className="page-subtitle">Manage your project invitations</p>
      </div>

      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button onClick={() => setActiveTab('received')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'received' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          Received ({pendingReceived.length})
        </button>
        <button onClick={() => setActiveTab('sent')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'sent' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          Sent ({pendingSent.length})
        </button>
      </div>

      {activeTab === 'received' && (
        <>
          {pendingReceived.length === 0 ? (
            <EmptyState message="No pending invitations" sub="You'll see team invitations here." />
          ) : (
            <div className="space-y-3">
              {pendingReceived.map((inv) => (
                <div key={inv.id} className="card flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{inv.project?.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">From {inv.sender?.name} • Role: {inv.role}</p>
                    {inv.matchScore != null && (
                      <span className="badge badge-blue mt-1">{inv.matchScore}% match</span>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => handleAction(inv.id, 'accepted')} disabled={actionLoading === inv.id} className="btn-accent text-xs py-2 px-3 flex items-center gap-1">
                      <Check size={14} /> Accept
                    </button>
                    <button onClick={() => handleAction(inv.id, 'declined')} disabled={actionLoading === inv.id} className="btn-danger text-xs py-2 px-3 flex items-center gap-1">
                      <X size={14} /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {received.filter((i) => i.status !== 'pending').length > 0 && (
            <div className="mt-8">
              <h3 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Past Invitations</h3>
              <div className="space-y-2">
                {received.filter((i) => i.status !== 'pending').map((inv) => (
                  <div key={inv.id} className="card bg-gray-50 opacity-70">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-700">{inv.project?.title}</p>
                        <p className="text-xs text-gray-500">From {inv.sender?.name}</p>
                      </div>
                      <span className={`badge ${inv.status === 'accepted' ? 'badge-green' : 'badge-gray'}`}>{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'sent' && (
        <>
          {pendingSent.length === 0 ? (
            <EmptyState message="No pending sent invitations" sub="Invitations you send will appear here." />
          ) : (
            <div className="space-y-3">
              {pendingSent.map((inv) => (
                <div key={inv.id} className="card flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{inv.project?.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">To {inv.receiver?.name} • Role: {inv.role}</p>
                  </div>
                  <span className="badge badge-orange flex items-center gap-1"><Clock size={12} /> Pending</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState({ message, sub }: { message: string; sub: string }) {
  return (
    <div className="text-center py-16">
      <FolderOpen size={40} className="text-gray-300 mx-auto mb-3" />
      <p className="text-sm text-gray-500">{message}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
