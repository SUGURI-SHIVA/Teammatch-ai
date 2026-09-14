import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
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
          <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-sm text-gray-500">Sign in to continue discovering projects and building teams.</p>
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
          <h1 className="text-xl font-bold text-gray-900 mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 mb-6">Enter your email and password to continue</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 px-3 py-2 rounded-lg text-sm border border-red-200">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">Sign up</Link>
          </p>
          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="text-xs text-gray-400 text-center mb-2">Demo accounts (password: password123)</p>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
              <div>alice@college.edu</div>
              <div>bob@college.edu</div>
              <div>carol@college.edu</div>
              <div>dave@college.edu</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
