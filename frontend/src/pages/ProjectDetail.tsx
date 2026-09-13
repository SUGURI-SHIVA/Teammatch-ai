import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { MatchScore, SkillBadge, InterestBadge, RoleBadge, ProgressBar, MatchReasons } from '../components/UI';
import { ArrowLeft, Users, Target, Clock, CheckCircle, XCircle, Mail, UserPlus } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [teamCoverage, setTeamCoverage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { loadProject(); }, [id]);

  const loadProject = async () => {
    if (!id) return;
    try {
      const [p, coverage] = await Promise.allSettled([
        api.projects.get(id),
        api.recommendations.teamCoverage(id),
      ]);
      if (p.status === 'fulfilled') {
        setProject(p.value);
        if (p.value.creatorId === user?.id) {
          const jr = await api.joinRequests.forProject(id);
          setJoinRequests(jr);
        }
      }
      if (coverage.status === 'fulfilled') setTeamCoverage(coverage.value);
    } catch {}
    setLoading(false);
  };

  const handleAcceptRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      await api.joinRequests.accept(requestId);
      setJoinRequests(joinRequests.map((r) => r.id === requestId ? { ...r, status: 'accepted' } : r));
      loadProject();
    } catch (err: any) { alert(err.message); }
    setActionLoading(null);
  };

  const handleRejectRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      await api.joinRequests.reject(requestId);
      setJoinRequests(joinRequests.map((r) => r.id === requestId ? { ...r, status: 'rejected' } : r));
    } catch (err: any) { alert(err.message); }
    setActionLoading(null);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">Project not found</div></div>;

  const isCreator = project.creatorId === user?.id;
  const isMember = project.members?.some((m: any) => m.userId === user?.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/dashboard" className="text-sm text-primary-600 hover:underline flex items-center space-x-1 mb-6">
          <ArrowLeft size={14} /><span>Back to Dashboard</span>
        </Link>

        <div className="card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
              {project.domain && <p className="text-gray-500 mt-1">{project.domain}</p>}
            </div>
            <span className={`badge ${project.status === 'open' ? 'badge-green' : 'badge-orange'}`}>
              {project.status}
            </span>
          </div>
          <p className="text-gray-600 mb-6">{project.description}</p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users size={16} />
              <span>{project.members?.length || 0}/{project.teamSize} members</span>
            </div>
            {project.experienceLevel && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Target size={16} />
                <span>{project.experienceLevel}</span>
              </div>
            )}
            {project.availability && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>{project.availability}</span>
              </div>
            )}
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-sm text-gray-700 mb-2">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {project.skills?.map((s: any) => <SkillBadge key={s.id} name={s.skill.name} />)}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-sm text-gray-700 mb-2">Roles Needed</h3>
            <div className="flex flex-wrap gap-2">
              {project.roles?.map((r: any) => <RoleBadge key={r.id} name={r.role.name} />)}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-sm text-gray-700 mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {project.interests?.map((i: any) => <InterestBadge key={i.id} name={i.interest.name} />)}
            </div>
          </div>
        </div>

        {teamCoverage && (
          <div className="card mb-6">
            <h2 className="text-lg font-bold mb-4">Team Skill Coverage</h2>
            <ProgressBar value={teamCoverage.coverage} label="Coverage" color="bg-accent-500" />
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Covered Skills</p>
                <div className="flex flex-wrap gap-1">
                  {teamCoverage.coveredSkills?.map((s: string) => (
                    <span key={s} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ {s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Missing Skills</p>
                <div className="flex flex-wrap gap-1">
                  {teamCoverage.missingSkills?.length === 0 ? (
                    <span className="text-xs text-gray-500">None</span>
                  ) : teamCoverage.missingSkills?.map((s: string) => (
                    <span key={s} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">✗ {s}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Duplicate Skills</p>
                <div className="flex flex-wrap gap-1">
                  {teamCoverage.duplicateSkills?.length === 0 ? (
                    <span className="text-xs text-gray-500">None</span>
                  ) : teamCoverage.duplicateSkills?.map((d: any) => (
                    <span key={d.skill} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">{d.skill} ×{d.count}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="card mb-6">
          <h2 className="text-lg font-bold mb-4">Current Team</h2>
          {project.members?.length === 0 ? (
            <p className="text-gray-500 text-sm">No members yet</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {project.members?.map((m: any) => (
                <div key={m.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                    {m.user?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{m.user?.name}</p>
                    <p className="text-xs text-gray-500">{m.role || 'Member'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isCreator && joinRequests.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-lg font-bold mb-4">Join Requests</h2>
            <div className="space-y-3">
              {joinRequests.map((req: any) => (
                <div key={req.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                        {req.student?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium">{req.student?.name}</p>
                        <p className="text-xs text-gray-500">{req.student?.email}</p>
                      </div>
                    </div>
                    {req.matchScore && <MatchScore score={req.matchScore} size="sm" />}
                  </div>
                  {req.matchScore && <MatchReasons reasons={req.reasons || []} />}
                  {req.status === 'pending' && (
                    <div className="flex space-x-2 mt-3">
                      <button onClick={() => handleAcceptRequest(req.id)} disabled={actionLoading === req.id}
                        className="btn-accent text-sm py-2 flex items-center space-x-1">
                        <CheckCircle size={16} /><span>Accept</span>
                      </button>
                      <button onClick={() => handleRejectRequest(req.id)} disabled={actionLoading === req.id}
                        className="btn-danger text-sm py-2 flex items-center space-x-1">
                        <XCircle size={16} /><span>Reject</span>
                      </button>
                    </div>
                  )}
                  {req.status !== 'pending' && (
                    <span className={`badge mt-2 ${req.status === 'accepted' ? 'badge-green' : 'badge-orange'}`}>
                      {req.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isCreator && (
          <Link to={`/projects/${project.id}/find-teammates`} className="btn-primary w-full text-center py-3 flex items-center justify-center space-x-2">
            <UserPlus size={20} /><span>Find Teammates</span>
          </Link>
        )}
      </div>
    </div>
  );
}
