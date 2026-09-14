import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Users, MapPin, Clock, Send, UserPlus, Trash2, Settings } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [message, setMessage] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => { loadProject(); }, [id]);

  const loadProject = async () => {
    try {
      const data = await api.projects.get(id!);
      setProject(data);
    } catch {}
    setLoading(false);
  };

  const isOwner = project?.creatorId === user?.id;
  const isMember = project?.members?.some((m: any) => m.userId === user?.id);
  const hasRequested = project?.joinRequests?.some((r: any) => r.studentId === user?.id && r.status === 'pending');

  const handleJoin = async () => {
    if (!selectedRole) return;
    setJoining(true);
    try {
      await api.joinRequests.send({ projectId: id, role: selectedRole, message });
      setRequestSent(true);
    } catch {}
    setJoining(false);
  };

  const handleDelete = async () => {
    try {
      await api.projects.delete(id!);
      navigate('/dashboard');
    } catch {}
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await api.joinRequests.accept(requestId);
      loadProject();
    } catch {}
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await api.joinRequests.reject(requestId);
      loadProject();
    } catch {}
  };

  if (loading) return <div className="p-8 text-center text-sm text-gray-500">Loading project...</div>;
  if (!project) return <div className="p-8 text-center text-sm text-gray-500">Project not found</div>;

  const pendingRequests = project.joinRequests?.filter((r: any) => r.status === 'pending') || [];

  return (
    <div className="p-8 max-w-4xl">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="card mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-xl font-bold text-gray-900">{project.title}</h1>
              {project.domain && <span className="badge badge-blue">{project.domain}</span>}
            </div>
            <p className="text-sm text-gray-600 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.requiredSkills?.map((s: any) => (
                <span key={s.id || s} className="badge badge-gray">{s.name || s}</span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Users size={14} /> {project.members?.length || 0}/{project.teamSize} members</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {project.availability || 'Flexible'}</span>
              <span className="flex items-center gap-1"><MapPin size={14} /> {project.experienceLevel || 'Any level'}</span>
            </div>
          </div>
          {isOwner && (
            <div className="flex gap-2 ml-4">
              <Link to={`/projects/${id}/find-teammates`} className="btn-primary text-xs flex items-center gap-1">
                <UserPlus size={14} /> Find Teammates
              </Link>
              <button onClick={() => setShowDelete(!showDelete)} className="btn-ghost text-red-500 px-2"><Trash2 size={16} /></button>
            </div>
          )}
        </div>

        {showDelete && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-red-600 mb-2">Are you sure? This cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={handleDelete} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-700">Delete Project</button>
              <button onClick={() => setShowDelete(false)} className="btn-ghost text-xs">Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="section-title mb-3">Team Members</h2>
          <div className="space-y-2">
            {project.members?.map((member: any) => (
              <div key={member.id} className="card py-3 flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {member.user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{member.user?.name}</p>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              </div>
            ))}
            {(!project.members || project.members.length === 0) && (
              <p className="text-sm text-gray-500">No members yet</p>
            )}
          </div>

          {project.requiredRoles && project.requiredRoles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-medium text-gray-600 mb-2">Open Roles</h3>
              <div className="flex flex-wrap gap-1.5">
                {project.requiredRoles.map((r: any) => (
                  <span key={r.id || r} className="badge badge-purple">{r.name || r}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          {!isOwner && !isMember && !hasRequested && !requestSent && (
            <div className="card">
              <h2 className="section-title mb-3">Request to Join</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Select Role</label>
                  <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="input-field text-sm">
                    <option value="">Choose a role</option>
                    {project.requiredRoles?.map((r: any) => (
                      <option key={r.id || r} value={r.name || r}>{r.name || r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Message (optional)</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="input-field min-h-[60px]" placeholder="Why do you want to join?" />
                </div>
                <button onClick={handleJoin} disabled={joining || !selectedRole} className="btn-primary w-full flex items-center justify-center gap-2">
                  <Send size={14} /> {joining ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </div>
          )}

          {requestSent && (
            <div className="card bg-green-50 border-green-200">
              <p className="text-sm font-medium text-green-800">Request sent successfully</p>
              <p className="text-xs text-green-600 mt-1">The project creator will review your request.</p>
            </div>
          )}

          {isOwner && pendingRequests.length > 0 && (
            <div>
              <h2 className="section-title mb-3">Join Requests ({pendingRequests.length})</h2>
              <div className="space-y-2">
                {pendingRequests.map((req: any) => (
                  <div key={req.id} className="card py-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {req.student?.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{req.student?.name}</p>
                          <p className="text-xs text-gray-500">Role: {req.role}</p>
                          {req.matchScore != null && <span className="badge badge-blue mt-1">{req.matchScore}% match</span>}
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => handleAcceptRequest(req.id)} className="btn-accent text-xs py-1.5 px-2.5">Accept</button>
                        <button onClick={() => handleRejectRequest(req.id)} className="btn-danger text-xs py-1.5 px-2.5">Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
