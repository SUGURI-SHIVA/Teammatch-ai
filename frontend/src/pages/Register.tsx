import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'PROJECT_CREATOR' | 'BOTH'>('BOTH');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center border-r border-gray-100">
        <div className="max-w-sm text-center px-8">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-lg">TM</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Join TeamMatch AI</h2>
          <p className="text-sm text-gray-500">Create a profile, discover projects, find teammates, and build amazing things together.</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">TM</span>
            </div>
            <span className="text-lg font-bold text-gray-900">TeamMatch AI</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Create account</h1>
          <p className="text-sm text-gray-500 mb-6">Fill in the details to get started</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm border border-red-200">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required minLength={6} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I want to</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'STUDENT', label: 'Find Projects', desc: 'Join a team' },
                  { value: 'PROJECT_CREATOR', label: 'Create Projects', desc: 'Build a team' },
                  { value: 'BOTH', label: 'Both', desc: 'Do everything' },
                ].map((opt) => (
                  <button key={opt.value} type="button" onClick={() => setRole(opt.value as any)}
                    className={`p-3 rounded-lg border text-center transition-all text-sm ${
                      role === opt.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}>
                    <p className="font-medium text-xs">{opt.label}</p>
                    <p className="text-[10px] mt-0.5 opacity-70">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
