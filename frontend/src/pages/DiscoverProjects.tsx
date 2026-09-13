import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { MatchScore, SkillBadge, InterestBadge, MatchReasons, ProgressBar } from '../components/UI';
import { Search, Filter, Users, Clock, Target } from 'lucide-react';

export default function DiscoverProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDomain, setFilterDomain] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  const [joining, setJoining] = useState<string | null>(null);

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      const data = await api.recommendations.projects();
      setProjects(data);
    } catch {
      const data = await api.projects.list();
      setProjects(data.map((p: any) => ({ ...p, matchScore: null, reasons: [] })));
    }
    setLoading(false);
  };

  const handleJoin = async (projectId: string) => {
    setJoining(projectId);
    try {
      await api.joinRequests.send({ projectId });
      setProjects(projects.map((p) => p.id === projectId ? { ...p, hasRequested: true } : p));
    } catch (err: any) {
      alert(err.message);
    }
    setJoining(null);
  };

  const domains = [...new Set(projects.map((p) => p.domain).filter(Boolean))];
  const allSkills = [...new Set(projects.flatMap((p) => p.skills?.map((s: any) => s.skill.name) || []))];
  const allRoles = [...new Set(projects.flatMap((p) => p.roles?.map((r: any) => r.role.name) || []))];

  const filtered = projects.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterDomain && p.domain !== filterDomain) return false;
    if (filterSkill && !p.skills?.some((s: any) => s.skill.name === filterSkill)) return false;
    if (filterRole && !p.roles?.some((r: any) => r.role.name === filterRole)) return false;
    if (filterExperience && p.experienceLevel !== filterExperience) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Discover Projects</h1>
          <p className="text-gray-600 mt-1">Find projects that match your skills and interests</p>
        </div>

        <div className="card mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-10" placeholder="Search projects..." />
              </div>
            </div>
            <select value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)} className="input-field w-auto">
              <option value="">All Domains</option>
              {domains.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={filterSkill} onChange={(e) => setFilterSkill(e.target.value)} className="input-field w-auto">
              <option value="">All Skills</option>
              {allSkills.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="input-field w-auto">
              <option value="">All Roles</option>
              {allRoles.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={filterExperience} onChange={(e) => setFilterExperience(e.target.value)} className="input-field w-auto">
              <option value="">All Levels</option>
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading projects...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No projects found matching your criteria</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <div key={project.id} className="card-hover flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <Link to={`/projects/${project.id}`} className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors">
                      {project.title}
                    </Link>
                    {project.domain && <p className="text-sm text-gray-500 mt-1">{project.domain}</p>}
                  </div>
                  {project.matchScore != null && <MatchScore score={project.matchScore} />}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                {project.matchScore != null && project.reasons && (
                  <div className="mb-4">
                    <ProgressBar value={project.skillMatch || 0} label="Skill Match" color="bg-blue-500" />
                    <ProgressBar value={project.interestMatch || 0} label="Interest Match" color="bg-purple-500" />
                  </div>
                )}

                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Required Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {project.skills?.slice(0, 5).map((s: any) => (
                      <SkillBadge key={s.id} name={s.skill.name} />
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Roles</p>
                  <div className="flex flex-wrap gap-1">
                    {project.roles?.map((r: any) => (
                      <InterestBadge key={r.id} name={r.role.name} />
                    ))}
                  </div>
                </div>

                {project.matchScore != null && <MatchReasons reasons={project.reasons} />}

                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>{project.members?.length || 0}/{project.teamSize}</span>
                    </span>
                    {project.experienceLevel && (
                      <span className="flex items-center space-x-1">
                        <Target size={14} />
                        <span>{project.experienceLevel}</span>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleJoin(project.id)}
                    disabled={joining === project.id || project.hasRequested}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    {project.hasRequested ? 'Requested' : joining === project.id ? 'Sending...' : 'Request to Join'}
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
