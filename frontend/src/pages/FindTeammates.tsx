import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Search, Send } from 'lucide-react';

const roles = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'ML Developer', 'Data Analyst', 'UI/UX Designer', 'Project Manager', 'Mobile Developer', 'DevOps Engineer', 'QA Tester'];

export default function FindTeammates() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [teammates, setTeammates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [inviting, setInviting] = useState<string | null>(null);
  const [sentInvites, setSentInvites] = useState<Set<string>>(new Set());

  useEffect(() => { loadData(); }, [projectId]);

  const loadData = async () => {
    try {
      if (projectId) setSelectedProject(projectId);
      const [teammatesData, projectsData] = await Promise.allSettled([
        api.discovery.teammates(projectId),
        api.projects.my(),
      ]);
      if (teammatesData.status === 'fulfilled') {
        setTeammates(Array.isArray(teammatesData.value) ? teammatesData.value : []);
      } else {
        setError('Failed to load teammates. Make sure you have completed your profile.');
      }
      if (projectsData.status === 'fulfilled') {
        setMyProjects(Array.isArray(projectsData.value) ? projectsData.value : []);
      }
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
      setTeammates([]); setMyProjects([]);
    }
    setLoading(false);
  };

  const handleInvite = async (userId: string) => {
    if (!selectedProject || !user) return;
    setInviting(userId);
    try {
      const project = myProjects.find((p) => p.id === selectedProject);
      if (!project) return;
      const role = project.requiredRoles?.[0]?.name || project.roles?.[0]?.name || 'Team Member';
      await api.invitations.send({ projectId: selectedProject, receiverId: userId, role, message: `Join ${project.title}` });
      setSentInvites(new Set([...sentInvites, userId]));
    } catch (error) {
      console.error('Failed to send invitation:', error);
    }
    setInviting(null);
  };

  const filtered = (Array.isArray(teammates) ? teammates : []).filter((t: any) => {
    if (search) {
      const q = search.toLowerCase();
      if (!t.name?.toLowerCase().includes(q) && !t.course?.toLowerCase().includes(q) && !t.user?.name?.toLowerCase().includes(q)) return false;
    }
    if (selectedRole && !t.preferredRoles?.some((r: any) => {
      const roleName = r.role?.name || r.name || r;
      return roleName === selectedRole;
    })) return false;
    return true;
  });

  const getSkillName = (s: any) => typeof s === 'string' ? s : s.name || s.skill?.name || '';
  const getTeammateName = (t: any) => t.name || t.user?.name || 'Unknown';
  const getInitials = (name: string) => name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?';

  if (loading) return <div className="p-8 text-center text-sm text-gray-500">Finding teammates...</div>;

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6">
        {projectId && (
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-3">
            <ArrowLeft size={14} /> Back to Project
          </button>
        )}
        <h1 className="page-title">Find Teammates</h1>
        <p className="page-subtitle">Discover students whose skills and interests complement your project</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200 mb-6">{error}</div>
      )}

      {myProjects.length > 0 && (
        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-600 mb-1">Select project to invite for</label>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)} className="input-field text-sm max-w-md">
            <option value="">Choose a project</option>
            {myProjects.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search by name or course..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
        <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="input-field text-sm max-w-[200px]">
          <option value="">All Roles</option>
          {roles.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm mb-2">No teammates found</p>
          <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((teammate: any) => (
            <div key={teammate.id} className="card-hover">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-gray-600">
                      {getInitials(getTeammateName(teammate))}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{getTeammateName(teammate)}</p>
                    <p className="text-xs text-gray-500">{teammate.course || ''}{teammate.course && teammate.year ? ' • ' : ''}{teammate.year || ''}</p>
                    {teammate.preferredRoles?.[0] && (
                      <span className="badge badge-blue mt-1">{teammate.preferredRoles[0].role?.name || teammate.preferredRoles[0].name || ''}</span>
                    )}
                  </div>
                </div>
                {teammate.matchScore != null && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{teammate.matchScore}%</div>
                    <div className="text-[10px] text-gray-500">Match</div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(Array.isArray(teammate.skills) ? teammate.skills : []).slice(0, 4).map((s: any) => (
                  <span key={s.id || s} className="badge badge-gray">{getSkillName(s)}</span>
                ))}
              </div>
              {Array.isArray(teammate.reasons) && teammate.reasons.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Why recommended</p>
                  <div className="flex flex-wrap gap-1">
                    {teammate.reasons.slice(0, 2).map((reason: string, i: number) => (
                      <span key={i} className="text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded">{reason}</span>
                    ))}
                  </div>
                </div>
              )}
              {selectedProject && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                  {sentInvites.has(teammate.id) ? (
                    <span className="text-xs text-green-600 font-medium py-2">Invitation sent</span>
                  ) : (
                    <button onClick={() => handleInvite(teammate.id)} disabled={inviting === teammate.id} className="btn-primary text-xs py-2 flex items-center gap-1">
                      <Send size={12} />
                      {inviting === teammate.id ? 'Sending...' : 'Invite'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
