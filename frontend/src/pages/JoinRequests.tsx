import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Check, X, Users, User } from 'lucide-react';

export default function JoinRequests() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      const data = await api.projects.my();
      const projectList = Array.isArray(data) ? data : [];
      setProjects(projectList);
      const pendingProjects = projectList.filter((p: any) => Array.isArray(p.joinRequests) && p.joinRequests.some((r: any) => r.status === 'pending'));
      if (pendingProjects.length > 0) {
        setSelectedProject(pendingProjects[0].id);
        setRequests(pendingProjects[0].joinRequests.filter((r: any) => r.status === 'pending'));
      }
    } catch {}
    setLoading(false);
  };

  const loadRequests = (projectId: string) => {
    setSelectedProject(projectId);
    const project = projects.find((p) => p.id === projectId);
    setRequests(Array.isArray(project?.joinRequests) ? project.joinRequests.filter((r: any) => r.status === 'pending') : []);
  };

  const handleAction = async (requestId: string, action: 'accepted' | 'rejected') => {
    setActionLoading(requestId);
    try {
      if (action === 'accepted') await api.joinRequests.accept(requestId);
      else await api.joinRequests.reject(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
      setProjects((prev) => prev.map((p) => ({
        ...p,
        joinRequests: Array.isArray(p.joinRequests) ? p.joinRequests.filter((r: any) => r.id !== requestId) : [],
      })));
    } catch {}
    setActionLoading(null);
  };

  if (loading) return <div className="p-8 text-center text-sm text-gray-500">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="page-title">Join Requests</h1>
        <p className="page-subtitle">Review student requests for your projects</p>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16">
          <Users size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No projects yet</p>
          <p className="text-xs text-gray-400 mt-1">Create a project to start receiving join requests</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <label className="block text-xs font-medium text-gray-600 mb-1">Select project</label>
            <select value={selectedProject} onChange={(e) => loadRequests(e.target.value)} className="input-field text-sm max-w-md">
              {projects.map((p) => {
                const pendingCount = Array.isArray(p.joinRequests) ? p.joinRequests.filter((r: any) => r.status === 'pending').length : 0;
                return (
                  <option key={p.id} value={p.id}>
                    {p.title} {pendingCount > 0 ? `(${pendingCount} pending)` : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-16">
              <User size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No pending requests</p>
              <p className="text-xs text-gray-400 mt-1">Join requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req: any) => (
                <div key={req.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600">
                          {(req.student?.name || '?').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{req.student?.name}</p>
                        <p className="text-xs text-gray-500">Requested role: {req.role}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Array.isArray(req.student?.skills) ? req.student.skills.slice(0, 4).map((s: any) => (
                            <span key={s.id || s} className="badge badge-gray">{typeof s === 'string' ? s : s.name || s.skill?.name || ''}</span>
                          )) : null}
                        </div>
                        {req.matchScore != null && (
                          <div className="mt-2">
                            <span className="badge badge-blue">{req.matchScore}% match</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => handleAction(req.id, 'accepted')} disabled={actionLoading === req.id} className="btn-accent text-xs py-2 px-3 flex items-center gap-1">
                        <Check size={14} /> Accept
                      </button>
                      <button onClick={() => handleAction(req.id, 'rejected')} disabled={actionLoading === req.id} className="btn-danger text-xs py-2 px-3 flex items-center gap-1">
                        <X size={14} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
