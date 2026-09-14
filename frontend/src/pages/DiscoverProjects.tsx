import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Search, Filter, Users, X } from 'lucide-react';

const domains = ['Web Development', 'Mobile Development', 'AI/ML', 'Data Science', 'Game Development', 'Cybersecurity', 'DevOps', 'UI/UX', 'Cloud Computing', 'IoT'];
const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const availabilityOptions = ['Weekdays', 'Weekends', 'Flexible'];

export default function DiscoverProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    domain: '', experience: '', availability: '', minMatch: 0,
  });

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      const data = await api.discovery.projects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message || 'Failed to load projects');
      setProjects([]);
    }
    setLoading(false);
  };

  const filtered = (Array.isArray(projects) ? projects : []).filter((p: any) => {
    if (search && !p.title?.toLowerCase().includes(search.toLowerCase()) && !p.description?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.domain && p.domain !== filters.domain) return false;
    if (filters.experience && p.experienceLevel !== filters.experience) return false;
    if (filters.availability && p.availability !== filters.availability) return false;
    if (filters.minMatch && (p.matchScore || 0) < filters.minMatch) return false;
    return true;
  });

  const getSkillName = (s: any) => typeof s === 'string' ? s : s.name || s.skill?.name || '';

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="page-title">Discover Projects</h1>
        <p className="page-subtitle">Find projects that match your skills, interests and goals</p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-blue-50 border-blue-300' : ''}`}>
          <Filter size={16} /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Domain</label>
              <select value={filters.domain} onChange={(e) => setFilters({ ...filters, domain: e.target.value })} className="input-field text-sm py-2">
                <option value="">All Domains</option>
                {domains.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Experience</label>
              <select value={filters.experience} onChange={(e) => setFilters({ ...filters, experience: e.target.value })} className="input-field text-sm py-2">
                <option value="">Any Level</option>
                {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Availability</label>
              <select value={filters.availability} onChange={(e) => setFilters({ ...filters, availability: e.target.value })} className="input-field text-sm py-2">
                <option value="">Any</option>
                {availabilityOptions.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Min Match</label>
              <select value={filters.minMatch} onChange={(e) => setFilters({ ...filters, minMatch: Number(e.target.value) })} className="input-field text-sm py-2">
                <option value={0}>Any</option>
                <option value={50}>50%+</option>
                <option value={70}>70%+</option>
                <option value={80}>80%+</option>
                <option value={90}>90%+</option>
              </select>
            </div>
          </div>
          {Object.values(filters).some(v => v) && (
            <button onClick={() => setFilters({ domain: '', experience: '', availability: '', minMatch: 0 })} className="text-xs text-blue-600 hover:underline mt-2 flex items-center gap-1">
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-200 mb-6">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-12 text-sm text-gray-500">Finding projects...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm mb-2">No projects found</p>
          <p className="text-xs text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((project: any) => (
            <Link key={project.id} to={`/projects/${project.id}`} className="block card-hover">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{project.title}</h3>
                    {project.domain && <span className="badge badge-blue">{project.domain}</span>}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(Array.isArray(project.skills) ? project.skills : []).slice(0, 5).map((s: any) => (
                      <span key={s.id || s} className="badge badge-gray">{getSkillName(s)}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Users size={12} /> {Array.isArray(project.members) ? project.members.length : 0}/{project.teamSize} members</span>
                    <span>{Array.isArray(project.roles) ? project.roles.length : 0} open roles</span>
                    {project.availability && <span>{project.availability}</span>}
                  </div>
                </div>
                {project.matchScore != null && (
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-blue-600">{project.matchScore}%</div>
                    <div className="text-[10px] text-gray-500">Match</div>
                  </div>
                )}
              </div>
              {Array.isArray(project.reasons) && project.reasons.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Why this matches you</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.reasons.slice(0, 3).map((reason: string, i: number) => (
                      <span key={i} className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">{reason}</span>
                    ))}
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
