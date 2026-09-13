import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { Lightbulb, Users, Target, Plus, Trash2 } from 'lucide-react';

const SKILL_OPTIONS = [
  'Python', 'Java', 'C', 'C++', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular',
  'Node.js', 'Django', 'Flask', 'HTML', 'CSS', 'UI/UX', 'Flutter', 'Swift', 'Kotlin',
  'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Data Science',
  'TensorFlow', 'PyTorch', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS', 'Firebase',
  'Git', 'Linux', 'REST API', 'GraphQL', 'Figma', 'IoT', 'Blockchain', 'Cybersecurity',
  'Go', 'Rust', 'Redis', 'Kafka', 'Supabase',
];

const INTEREST_OPTIONS = [
  'AI/ML', 'Web Development', 'Mobile Development', 'IoT', 'Cybersecurity',
  'Healthcare', 'Education', 'FinTech', 'Agriculture', 'Gaming', 'E-commerce',
  'Social Impact', 'Sustainability', 'Robotics', 'AR/VR', 'Cloud Computing',
  'DevOps', 'Open Source', 'Research', 'Startups',
];

const ROLE_OPTIONS = [
  'AI/ML Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'UI/UX Designer', 'Researcher', 'Project Manager', 'Presenter', 'DevOps Engineer',
  'Mobile Developer', 'Data Analyst', 'Security Analyst',
];

export default function CreateProject() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [teamSize, setTeamSize] = useState(4);
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [availability, setAvailability] = useState('');
  const [otherRequirements, setOtherRequirements] = useState('');

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleItem = <T,>(arr: T[], item: T, setter: (v: T[]) => void) => {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) { setError('Title and description are required'); return; }
    setSaving(true);
    setError('');
    try {
      const project = await api.projects.create({
        title, description, domain, teamSize, experienceLevel, availability, otherRequirements,
        skills: selectedSkills, roles: selectedRoles, interests: selectedInterests,
      });
      navigate(`/projects/${project.id}/find-teammates`);
    } catch (err: any) {
      setError(err.message);
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Project</h1>
          <p className="text-gray-600 mt-1">Describe your project and find the right teammates</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb size={20} className="text-primary-600" />
              <h2 className="text-lg font-bold">Project Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" placeholder="e.g., AI-Based Smart Campus" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" rows={5} placeholder="Describe your project, goals, and what you want to build..." required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                <input value={domain} onChange={(e) => setDomain(e.target.value)} className="input-field" placeholder="e.g., AI, Education, Healthcare" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Users size={20} className="text-primary-600" />
              <h2 className="text-lg font-bold">Team Requirements</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Members Needed</label>
                <input type="number" min={2} max={10} value={teamSize} onChange={(e) => setTeamSize(parseInt(e.target.value))} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className="input-field">
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <input value={availability} onChange={(e) => setAvailability(e.target.value)} className="input-field" placeholder="e.g., Monday, Wednesday, Friday" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Target size={20} className="text-primary-600" />
              <h2 className="text-lg font-bold">Required Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {SKILL_OPTIONS.map((skill) => (
                <button key={skill} type="button" onClick={() => toggleItem(selectedSkills, skill, setSelectedSkills)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    selectedSkills.includes(skill) ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-300 hover:border-primary-300'
                  }`}>{skill}</button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input value={customSkill} onChange={(e) => setCustomSkill(e.target.value)} className="input-field flex-1" placeholder="Add custom skill..."
                onKeyDown={(e) => { if (e.key === 'Enter' && customSkill) { e.preventDefault(); if (!selectedSkills.includes(customSkill)) setSelectedSkills([...selectedSkills, customSkill]); setCustomSkill(''); } }} />
              <button type="button" onClick={() => { if (customSkill && !selectedSkills.includes(customSkill)) { setSelectedSkills([...selectedSkills, customSkill]); setCustomSkill(''); } }} className="btn-secondary text-sm py-2">Add</button>
            </div>
            {selectedSkills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedSkills.map((s) => (
                  <span key={s} className="badge badge-blue flex items-center space-x-1">
                    <span>{s}</span>
                    <button type="button" onClick={() => setSelectedSkills(selectedSkills.filter((sk) => sk !== s))} className="text-blue-600 hover:text-blue-800">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-lg font-bold mb-4">Required Roles</h2>
            <div className="flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((role) => (
                <button key={role} type="button" onClick={() => toggleItem(selectedRoles, role, setSelectedRoles)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    selectedRoles.includes(role) ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-600 border-gray-300 hover:border-green-300'
                  }`}>{role}</button>
              ))}
            </div>
            {selectedRoles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedRoles.map((r) => (
                  <span key={r} className="badge badge-green flex items-center space-x-1">
                    <span>{r}</span>
                    <button type="button" onClick={() => setSelectedRoles(selectedRoles.filter((ro) => ro !== r))} className="text-green-600 hover:text-green-800">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-lg font-bold mb-4">Preferred Interests</h2>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => (
                <button key={interest} type="button" onClick={() => toggleItem(selectedInterests, interest, setSelectedInterests)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    selectedInterests.includes(interest) ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-600 border-gray-300 hover:border-purple-300'
                  }`}>{interest}</button>
              ))}
            </div>
            {selectedInterests.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedInterests.map((i) => (
                  <span key={i} className="badge badge-purple flex items-center space-x-1">
                    <span>{i}</span>
                    <button type="button" onClick={() => setSelectedInterests(selectedInterests.filter((int) => int !== i))} className="text-purple-600 hover:text-purple-800">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-lg font-bold mb-4">Other Requirements</h2>
            <textarea value={otherRequirements} onChange={(e) => setOtherRequirements(e.target.value)} className="input-field" rows={3} placeholder="Any other requirements or notes..." />
          </div>

          {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>}

          <button type="submit" className="btn-primary w-full text-lg py-4" disabled={saving}>
            {saving ? 'Creating Project...' : 'Create Project & Find Teammates'}
          </button>
        </form>
      </div>
    </div>
  );
}
