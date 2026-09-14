import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Save, Plus, X } from 'lucide-react';

const allSkills = ['JavaScript', 'TypeScript', 'Python', 'React', 'ReactJS', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Java', 'C++', 'Go', 'Rust', 'Swift', 'Kotlin', 'SQL', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'HTML/CSS', 'Tailwind', 'GraphQL', 'REST API', 'Git', 'CI/CD', 'Firebase', 'Figma', 'Adobe XD', 'Unity', 'Unreal Engine', 'Flutter', 'React Native'];
const allInterests = ['Web Development', 'Mobile Development', 'AI/ML', 'Data Science', 'Game Development', 'Cybersecurity', 'DevOps', 'Cloud Computing', 'IoT', 'Blockchain', 'AR/VR', 'UI/UX Design', 'Open Source', 'Research', 'Healthcare Tech', 'FinTech', 'EdTech', 'Sustainability'];
const allRoles = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'ML Developer', 'Data Analyst', 'UI/UX Designer', 'Project Manager', 'Mobile Developer', 'DevOps Engineer', 'QA Tester'];
const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function StudentProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', course: '', year: '', bio: '',
    experienceLevel: 'Intermediate',
    preferredRoles: [] as string[],
    availability: 'Flexible',
    learningGoals: '',
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    try {
      const data = await api.profile.get();
      setProfile(data);
      setForm({
        name: data.name || '', email: data.email || '', course: data.course || '', year: data.year || '',
        bio: data.bio || '', experienceLevel: data.experienceLevel || 'Intermediate',
        preferredRoles: data.preferredRoles?.map((r: any) => r.name) || [],
        availability: data.availability || 'Flexible', learningGoals: data.learningGoals || '',
      });
      setSkills(data.skills?.map((s: any) => s.name) || []);
      setInterests(data.interests?.map((i: any) => i.name) || []);
    } catch {}
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true); setMessage('');
    try {
      await api.profile.save({ ...form, skills, interests });
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (e: any) { setMessage(e.message || 'Failed to save'); }
    setSaving(false);
  };

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) { setSkills([...skills, skill]); setNewSkill(''); }
  };
  const removeSkill = (skill: string) => setSkills(skills.filter((s) => s !== skill));
  const addInterest = (interest: string) => {
    if (interest && !interests.includes(interest)) { setInterests([...interests, interest]); setNewInterest(''); }
  };
  const removeInterest = (interest: string) => setInterests(interests.filter((i) => i !== interest));
  const toggleRole = (role: string) => {
    setForm({ ...form, preferredRoles: form.preferredRoles.includes(role) ? form.preferredRoles.filter((r) => r !== role) : [...form.preferredRoles, role] });
  };

  if (loading) return <div className="p-8 text-center text-sm text-gray-500">Loading profile...</div>;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">Manage your skills, interests, and preferences</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 px-3 py-2 rounded-lg text-sm border ${message.includes('success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        <section className="card">
          <h2 className="section-title mb-3">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input type="email" value={form.email} disabled className="input-field bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Course / Major</label>
              <input type="text" value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} className="input-field" placeholder="e.g. Computer Science" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
              <input type="text" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="input-field" placeholder="e.g. 3rd Year" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">About</label>
            <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field min-h-[80px]" placeholder="A brief description about yourself..." />
          </div>
        </section>

        <section className="card">
          <h2 className="section-title mb-3">Skills</h2>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {skills.map((skill) => (
              <span key={skill} className="badge badge-blue flex items-center gap-1">
                {skill} <button onClick={() => removeSkill(skill)} className="hover:text-blue-900"><X size={12} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(newSkill))} className="input-field flex-1" placeholder="Type a skill and press Enter" list="skills-list" />
            <datalist id="skills-list">{allSkills.filter((s) => !skills.includes(s)).map((s) => <option key={s} value={s} />)}</datalist>
            <button onClick={() => addSkill(newSkill)} className="btn-secondary px-3"><Plus size={16} /></button>
          </div>
        </section>

        <section className="card">
          <h2 className="section-title mb-3">Interests</h2>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {interests.map((interest) => (
              <span key={interest} className="badge badge-green flex items-center gap-1">
                {interest} <button onClick={() => removeInterest(interest)} className="hover:text-green-900"><X size={12} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={newInterest} onChange={(e) => setNewInterest(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest(newInterest))} className="input-field flex-1" placeholder="Type an interest and press Enter" list="interests-list" />
            <datalist id="interests-list">{allInterests.filter((i) => !interests.includes(i)).map((i) => <option key={i} value={i} />)}</datalist>
            <button onClick={() => addInterest(newInterest)} className="btn-secondary px-3"><Plus size={16} /></button>
          </div>
        </section>

        <section className="card">
          <h2 className="section-title mb-3">Preferred Roles</h2>
          <div className="grid grid-cols-2 gap-2">
            {allRoles.map((role) => (
              <button key={role} onClick={() => toggleRole(role)} className={`p-2.5 rounded-lg border text-left text-sm transition-all ${form.preferredRoles.includes(role) ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {role}
              </button>
            ))}
          </div>
        </section>

        <section className="card">
          <h2 className="section-title mb-3">Preferences</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Experience Level</label>
              <select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })} className="input-field">
                {experienceLevels.map((l) => <option key={l} value={l}>{l}</option>)}
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
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">Learning Goals</label>
            <textarea value={form.learningGoals} onChange={(e) => setForm({ ...form, learningGoals: e.target.value })} className="input-field min-h-[60px]" placeholder="What do you want to learn or improve?" />
          </div>
        </section>
      </div>
    </div>
  );
}
