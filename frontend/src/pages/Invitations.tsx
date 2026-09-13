import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { MatchScore, SkillBadge, MatchReasons, ProgressBar } from '../components/UI';
import { CheckCircle, XCircle, Mail, ArrowLeft } from 'lucide-react';

export default function Invitations() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { loadInvitations(); }, []);

  const loadInvitations = async () => {
    try {
      const data = await api.invitations.received();
      setInvitations(data);
    } catch {}
    setLoading(false);
  };

  const handleAccept = async (id: string) => {
    setActionLoading(id);
    try {
      await api.invitations.accept(id);
      setInvitations(invitations.map((inv) => inv.id === id ? { ...inv, status: 'accepted' } : inv));
    } catch (err: any) { alert(err.message); }
    setActionLoading(null);
  };

  const handleDecline = async (id: string) => {
    setActionLoading(id);
    try {
      await api.invitations.decline(id);
      setInvitations(invitations.map((inv) => inv.id === id ? { ...inv, status: 'declined' } : inv));
    } catch (err: any) { alert(err.message); }
    setActionLoading(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>;

  const pending = invitations.filter((i) => i.status === 'pending');
  const processed = invitations.filter((i) => i.status !== 'pending');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/dashboard" className="text-sm text-primary-600 hover:underline flex items-center space-x-1 mb-6">
          <ArrowLeft size={14} /><span>Back to Dashboard</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Invitations</h1>
        <p className="text-gray-600 mb-8">Projects that have invited you to join</p>

        {pending.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">Pending Invitations ({pending.length})</h2>
            <div className="space-y-4">
              {pending.map((inv) => (
                <div key={inv.id} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link to={`/projects/${inv.project?.id}`} className="text-lg font-bold text-primary-600 hover:underline">
                        {inv.project?.title}
                      </Link>
                      <p className="text-sm text-gray-500">From {inv.sender?.name}</p>
                    </div>
                    {inv.matchScore && <MatchScore score={inv.matchScore} />}
                  </div>

                  {inv.project?.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{inv.project.description}</p>
                  )}

                  {inv.project?.skills && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {inv.project.skills.map((s: any) => <SkillBadge key={s.id} name={s.skill.name} />)}
                      </div>
                    </div>
                  )}

                  {inv.matchScore && (
                    <div className="mb-3">
                      <ProgressBar value={inv.matchScore} label="Overall Match" color="bg-accent-500" />
                    </div>
                  )}

                  {inv.matchScore && <MatchReasons reasons={inv.reasons || []} />}

                  <div className="flex space-x-3 mt-4">
                    <button onClick={() => handleAccept(inv.id)} disabled={actionLoading === inv.id}
                      className="btn-accent flex items-center space-x-1">
                      <CheckCircle size={18} /><span>Accept</span>
                    </button>
                    <button onClick={() => handleDecline(inv.id)} disabled={actionLoading === inv.id}
                      className="btn-danger flex items-center space-x-1">
                      <XCircle size={18} /><span>Decline</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pending.length === 0 && processed.length === 0 && (
          <div className="text-center py-12">
            <Mail size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No invitations yet</p>
            <Link to="/discover-projects" className="text-primary-600 hover:underline text-sm mt-2 inline-block">
              Discover projects to get started
            </Link>
          </div>
        )}

        {processed.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4">Past Invitations</h2>
            <div className="space-y-3">
              {processed.map((inv) => (
                <div key={inv.id} className="card opacity-75">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{inv.project?.title}</p>
                      <p className="text-sm text-gray-500">From {inv.sender?.name}</p>
                    </div>
                    <span className={`badge ${inv.status === 'accepted' ? 'badge-green' : 'badge-orange'}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
