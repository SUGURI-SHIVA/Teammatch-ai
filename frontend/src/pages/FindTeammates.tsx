import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../utils/api';
import { MatchScore, SkillBadge, InterestBadge, RoleBadge, MatchReasons, ProgressBar } from '../components/UI';
import { Search, Users, Mail, ArrowLeft, Shield } from 'lucide-react';

export default function FindTeammates() {
  const { projectId } = useParams();
  const [students, setStudents] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [inviting, setInviting] = useState<string | null>(null);

  useEffect(() => { loadData(); }, [projectId]);

  const loadData = async () => {
    try {
      if (projectId) {
        const [p, s] = await Promise.all([
          api.projects.get(projectId),
          api.recommendations.students(projectId),
        ]);
        setProject(p);
        setStudents(s);
      } else {
        const myProjects = await api.projects.my();
        if (myProjects.length > 0) {
          const p = myProjects[0];
          setProject(p);
          const s = await api.recommendations.students(p.id);
          setStudents(s);
        }
      }
    } catch {}
    setLoading(false);
  };

  const handleInvite = async (studentId: string) => {
    if (!project) return;
    setInviting(studentId);
    try {
      await api.invitations.send({ projectId: project.id, receiverId: studentId });
      setStudents(students.map((s) => s.userId === studentId ? { ...s, invited: true } : s));
    } catch (err: any) {
      alert(err.message);
    }
    setInviting(null);
  };

  const allSkills = [...new Set(students.flatMap((s) => s.skills?.map((sk: any) => sk.skill.name) || []))];
  const allRoles = [...new Set(students.flatMap((s) => s.preferredRoles?.map((r: any) => r.role.name) || []))];

  const filtered = students.filter((s) => {
    if (search) {
      const name = s.user?.name?.toLowerCase() || '';
      const skills = s.skills?.map((sk: any) => sk.skill.name.toLowerCase()).join(' ') || '';
      if (!name.includes(search.toLowerCase()) && !skills.includes(search.toLowerCase())) return false;
    }
    if (filterSkill && !s.skills?.some((sk: any) => sk.skill.name === filterSkill)) return false;
    if (filterRole && !s.preferredRoles?.some((r: any) => r.role.name === filterRole)) return false;
    return true;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link to="/dashboard" className="text-sm text-primary-600 hover:underline flex items-center space-x-1 mb-2">
            <ArrowLeft size={14} /><span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Find Teammates</h1>
          {project && <p className="text-gray-600 mt-1">For project: {project.title}</p>}
        </div>

        {project && (
          <div className="card mb-6 bg-primary-50 border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-primary-900">Team Skill Coverage</h3>
                <p className="text-sm text-primary-700">{project.members?.length || 0}/{project.teamSize} members</p>
              </div>
              <Link to={`/projects/${project.id}/team`} className="text-sm text-primary-600 hover:underline">View Team</Link>
            </div>
          </div>
        )}

        <div className="card mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search students by name or skill..." />
              </div>
            </div>
            <select value={filterSkill} onChange={(e) => setFilterSkill(e.target.value)} className="input-field w-auto">
              <option value="">All Skills</option>
              {allSkills.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="input-field w-auto">
              <option value="">All Roles</option>
              {allRoles.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No students found matching your criteria</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((student) => (
              <div key={student.userId} className="card-hover flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg">
                      {student.user?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-bold">{student.user?.name}</p>
                      <p className="text-xs text-gray-500">{student.college || 'Student'}</p>
                    </div>
                  </div>
                  {student.matchScore != null && <MatchScore score={student.matchScore} />}
                </div>

                {student.matchScore != null && (
                  <div className="mb-3">
                    <ProgressBar value={student.skillMatch || 0} label="Skill Match" color="bg-blue-500" />
                    <ProgressBar value={student.interestMatch || 0} label="Interest Match" color="bg-purple-500" />
                    <ProgressBar value={student.roleMatch || 0} label="Role Match" color="bg-green-500" />
                  </div>
                )}

                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {student.skills?.slice(0, 6).map((s: any) => (
                      <SkillBadge key={s.id} name={s.skill.name} level={s.level} />
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Interests</p>
                  <div className="flex flex-wrap gap-1">
                    {student.interests?.slice(0, 4).map((i: any) => (
                      <InterestBadge key={i.id} name={i.interest.name} />
                    ))}
                  </div>
                </div>

                {student.preferredRoles?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Preferred Roles</p>
                    <div className="flex flex-wrap gap-1">
                      {student.preferredRoles.map((r: any) => (
                        <RoleBadge key={r.id} name={r.role.name} />
                      ))}
                    </div>
                  </div>
                )}

                {student.matchScore != null && <MatchReasons reasons={student.reasons} />}

                <div className="mt-auto pt-4">
                  <button
                    onClick={() => handleInvite(student.userId)}
                    disabled={inviting === student.userId || student.invited}
                    className="btn-primary w-full text-sm py-2 flex items-center justify-center space-x-1"
                  >
                    <Mail size={16} />
                    <span>{student.invited ? 'Invited' : inviting === student.userId ? 'Sending...' : 'Invite'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
