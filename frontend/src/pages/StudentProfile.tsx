import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { SkillBadge, InterestBadge, RoleBadge } from '../components/UI';
import { User, BookOpen, Briefcase, Target, Plus, Trash2 } from 'lucide-react';

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

export default function StudentProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [experience, setExperience] = useState('Beginner');
  const [availability, setAvailability] = useState('');
  const [bio, setBio] = useState('');

  const [selectedSkills, setSelectedSkills] = useState<{ name: string; level: string }[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState('Intermediate');

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [learningGoals, setLearningGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');

  const [previousProjects, setPreviousProjects] = useState<{ name: string; description: string; skills: string }[]>([]);
  const [newProject, setNewProject] = useState({ name: '', description: '', skills: '' });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const profile = await api.profile.get();
      if (profile) {
        setCollege(profile.college || '');
        setDepartment(profile.department || '');
        setYear(profile.year || '');
        setExperience(profile.experience || 'Beginner');
        setAvailability(profile.availability || '');
        setBio(profile.bio || '');
        setSelectedSkills(profile.skills?.map((s: any) => ({ name: s.skill.name, level: s.level })) || []);
        setSelectedInterests(profile.interests?.map((i: any) => i.interest.name) || []);
        setSelectedRoles(profile.preferredRoles?.map((r: any) => r.role.name) || []);
        setLearningGoals(profile.learningGoals?.map((g: any) => g.skill) || []);
        setPreviousProjects(profile.previousProjects?.map((p: any) => ({ name: p.name, description: p.description || '', skills: p.skills || '' })) || []);
      }
    } catch {}
    setLoading(false);
  };

  const toggleSkill = (name: string) => {
    if (selectedSkills.find((s) => s.name === name)) {
      setSelectedSkills(selectedSkills.filter((s) => s.name !== name));
    } else {
      setSelectedSkills([...selectedSkills, { name, level: skillLevel }]);
    }
  };

  const addCustomSkill = () => {
    if (customSkill && !selectedSkills.find((s) => s.name === customSkill)) {
      setSelectedSkills([...selectedSkills, { name: customSkill, level: skillLevel }]);
      setCustomSkill('');
    }
  };

  const toggleInterest = (name: string) => {
    setSelectedInterests(
      selectedInterests.includes(name) ? selectedInterests.filter((i) => i !== name) : [...selectedInterests, name]
    );
  };

  const addCustomInterest = () => {
    if (customInterest && !selectedInterests.includes(customInterest)) {
      setSelectedInterests([...selectedInterests, customInterest]);
      setCustomInterest('');
    }
  };

  const toggleRole = (name: string) => {
    setSelectedRoles(
      selectedRoles.includes(name) ? selectedRoles.filter((r) => r !== name) : [...selectedRoles, name]
    );
  };

  const addGoal = () => {
    if (newGoal && !learningGoals.includes(newGoal)) {
      setLearningGoals([...learningGoals, newGoal]);
      setNewGoal('');
    }
  };

  const addPreviousProject = () => {
    if (newProject.name) {
      setPreviousProjects([...previousProjects, newProject]);
      setNewProject({ name: '', description: '', skills: '' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.profile.save({
        college, department, year, experience, availability, bio,
        skills: selectedSkills,
        interests: selectedInterests,
        preferredRoles: selectedRoles,
        learningGoals,
        previousProjects,
      });
      setMessage('Profile saved successfully!');
    } catch (err: any) {
      setMessage('Error: ' + err.message);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
          <p className="text-gray-600 mt-1">Tell us about your skills, interests, and experience</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <User size={20} className="text-primary-600" />
              <h2 className="text-lg font-bold">Basic Information</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">College / University</label>
                <input value={college} onChange={(e) => setCollege(e.target.value)} className="input-field" placeholder="e.g., MIT" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input value={department} onChange={(e) => setDepartment(e.target.value)} className="input-field" placeholder="e.g., Computer Science" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select value={year} onChange={(e) => setYear(e.target.value)} className="input-field">
                  <option value="">Select year</option>
                  <option>1st</option><option>2nd</option><option>3rd</option><option>4th</option><option>5th</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                <select value={experience} onChange={(e) => setExperience(e.target.value)} className="input-field">
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <input value={availability} onChange={(e) => setAvailability(e.target.value)} className="input-field" placeholder="e.g., Monday, Wednesday, Friday" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="input-field" rows={3} placeholder="Tell us about yourself..." />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen size={20} className="text-primary-600" />
              <h2 className="text-lg font-bold">Skills</h2>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level for New Skills</label>
              <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className="input-field w-auto">
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {SKILL_OPTIONS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    selectedSkills.find((s) => s.name === skill)
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-primary-300'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                className="input-field flex-1"
                placeholder="Add custom skill..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
              />
              <button type="button" onClick={addCustomSkill} className="btn-secondary text-sm py-2">Add</button>
            </div>
            {selectedSkills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedSkills.map((s) => (
                  <span key={s.name} className="badge badge-blue flex items-center space-x-1">
                    <span>{s.name} ({s.level})</span>
                    <button type="button" onClick={() => setSelectedSkills(selectedSkills.filter((sk) => sk.name !== s.name))} className="text-blue-600 hover:text-blue-800">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Target size={20} className="text-primary-600" />
              <h2 className="text-lg font-bold">Interests</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {INTEREST_OPTIONS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    selectedInterests.includes(interest)
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-purple-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <input
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                className="input-field flex-1"
                placeholder="Add custom interest..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomInterest())}
              />
              <button type="button" onClick={addCustomInterest} className="btn-secondary text-sm py-2">Add</button>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase size={20} className="text-primary-600" />
              <h2 className="text-lg font-bold">Preferred Roles</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    selectedRoles.includes(role)
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-green-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold mb-4">Learning Goals</h2>
            <div className="flex items-center space-x-2 mb-4">
              <input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="input-field flex-1"
                placeholder="Skill you want to learn..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
              />
              <button type="button" onClick={addGoal} className="btn-secondary text-sm py-2">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {learningGoals.map((goal) => (
                <span key={goal} className="badge badge-orange flex items-center space-x-1">
                  <span>{goal}</span>
                  <button type="button" onClick={() => setLearningGoals(learningGoals.filter((g) => g !== goal))} className="text-orange-600 hover:text-orange-800">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold mb-4">Previous Projects</h2>
            <div className="grid md:grid-cols-3 gap-2 mb-4">
              <input value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} className="input-field" placeholder="Project name" />
              <input value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} className="input-field" placeholder="Description" />
              <div className="flex space-x-2">
                <input value={newProject.skills} onChange={(e) => setNewProject({ ...newProject, skills: e.target.value })} className="input-field flex-1" placeholder="Skills used" />
                <button type="button" onClick={addPreviousProject} className="btn-secondary text-sm py-2"><Plus size={16} /></button>
              </div>
            </div>
            {previousProjects.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg mb-2">
                <div>
                  <span className="font-medium">{p.name}</span>
                  {p.description && <span className="text-gray-500 ml-2">— {p.description}</span>}
                </div>
                <button type="button" onClick={() => setPreviousProjects(previousProjects.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {message}
            </div>
          )}

          <button type="submit" className="btn-primary w-full text-lg py-4" disabled={saving}>
            {saving ? 'Saving Profile...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
