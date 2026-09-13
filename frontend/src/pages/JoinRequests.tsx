import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { ArrowLeft, Send } from 'lucide-react';

export default function JoinRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    try {
      const data = await api.joinRequests.my();
      setRequests(data);
    } catch {}
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/dashboard" className="text-sm text-primary-600 hover:underline flex items-center space-x-1 mb-6">
          <ArrowLeft size={14} /><span>Back to Dashboard</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Join Requests</h1>
        <p className="text-gray-600 mb-8">Track your project join requests</p>

        {requests.length === 0 ? (
          <div className="text-center py-12">
            <Send size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No join requests yet</p>
            <Link to="/discover-projects" className="text-primary-600 hover:underline text-sm mt-2 inline-block">
              Discover projects to get started
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req.id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <Link to={`/projects/${req.project?.id}`} className="font-bold text-primary-600 hover:underline">
                    {req.project?.title}
                  </Link>
                  <span className={`badge ${req.status === 'accepted' ? 'badge-green' : req.status === 'rejected' ? 'badge-orange' : 'badge-blue'}`}>
                    {req.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {req.project?.members?.length || 0}/{req.project?.teamSize} members
                </p>
                {req.matchScore && (
                  <p className="text-sm text-gray-600 mt-1">Match: {req.matchScore}%</p>
                )}
                <p className="text-xs text-gray-400 mt-2">Sent {new Date(req.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
