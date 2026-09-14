import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { ArrowLeft, Sparkles } from 'lucide-react';

const domains = ['Web Development', 'Mobile Development', 'AI/ML', 'Data Science', 'Game Development', 'Cybersecurity', 'DevOps', 'UI/UX', 'Cloud Computing', 'IoT'];
const allSkills = ['JavaScript', 'TypeScript', 'Python', 'React', 'ReactJS', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Java', 'C++', 'Go', 'Rust', 'Swift', 'Kotlin', 'SQL', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'HTML/CSS', 'Tailwind', 'GraphQL', 'REST API', 'Git', 'CI/CD', 'Firebase', 'Figma', 'Adobe XD', 'Unity', 'Unreal Engine', 'Flutter', 'React Native'];
const allRoles = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'ML Developer', 'Data Analyst', 'UI/UX Designer', 'Project Manager', 'Mobile Developer', 'DevOps Engineer', 'QA Tester'];

export default function CreateProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', domain: '', teamSize: 4,
    experienceLevel: 'Intermediate', availability: 'Flexible', requirements: '',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const project = await api.projects.create({ ...form, requiredSkills: skills, requiredRoles: roles, interests });
      navigate(`/projects/${project.id}`);
    } catch (err: any) { setError(err.message || 'Failed to create project'); }
    setLoading(false);
  };

  const addToList = (item: string, list: string[], setList: (v: string[]) => void, setter: (v: string) => void) => {
    if (item && !list.includes(item)) { setList([...list, item]); setter(''); }
  };

  return (
    <div className="p-8 max-w-3xl">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">
        <ArrowLeft size={14} /> Back
      </button>
      <div className="mb-6">
        <h1 className="page-title">Create a Project</h1>
        <p className="page-subtitle">Tell us about your idea and the teammates you need</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm border border-red-200">{error}</div>}

        <section className="card">
          <h2 className="section-title mb-3">Project Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Project Title</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. Smart Campus Assistant" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[100px]" placeholder="Describe your project idea..." required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Domain</label>
                <select value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} className="input-field">
                  <option value="">Select domain</option>
                  {domains.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Team Size</label>
                <input type="number" min={2} max={20} value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: Number(e.target.value) })} className="input-field" />
              </div>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="section-title mb-3">Team Requirements</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Required Skills</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {skills.map((s) => <span key={s} className="badge badge-blue flex items-center gap-1">{s} <button type="button" onClick={() => setSkills(skills.filter((sk) => sk !== s))} className="hover:text-blue-900">×</button></span>)}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(newSkill, skills, setSkills, setNewSkill))} className="input-field flex-1" placeholder="Add a skill" list="skills-list" />
                <datalist id="skills-list">{allSkills.filter((s) => !skills.includes(s)).map((s) => <option key={s} value={s} />)}</datalist>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Required Roles</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {roles.map((r) => <span key={r} className="badge badge-purple flex items-center gap-1">{r} <button type="button" onClick={() => setRoles(roles.filter((ro) => ro !== r))} className="hover:text-purple-900">×</button></span>)}
              </div>
              <div className="flex gap-2">
                <input type="text" value={newRole} onChange={(e) => setNewRole(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(newRole, roles, setRoles, setNewRole))} className="input-field flex-1" placeholder="Add a role" list="roles-list" />
                <datalist id="roles-list">{allRoles.filter((r) => !roles.includes(r)).map((r) => <option key={r} value={r} />)}</datalist>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Experience Level</label>
                <select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })} className="input-field">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Availability</label>
                <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} className="input-field">
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="section-title mb-3">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Project Interests</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {interests.map((i) => <span key={i} className="badge badge-green flex items-center gap-1">{i} <button type="button" onClick={() => setInterests(interests.filter((it) => it !== i))} className="hover:text-green-900">×</button></span>)}
              </div>
              <input type="text" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(newInterest, interests, setInterests, setNewInterest))} className="input-field" placeholder="Add an interest and press Enter" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Other Requirements</label>
              <textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} className="input-field min-h-[60px]" placeholder="Any other requirements or notes..." />
            </div>
          </div>
        </section>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            <Sparkles size={16} /> {loading ? 'Creating...' : 'Create Project & Find Teammates'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
