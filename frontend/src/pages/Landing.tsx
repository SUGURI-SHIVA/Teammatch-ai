import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Search, Users, Sparkles, CheckCircle } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">TM</span>
            </div>
            <span className="text-sm font-bold text-gray-900">TeamMatch AI</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="btn-primary text-sm py-2">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Have an idea?<br />Find the right team.
          </h1>
          <p className="text-gray-500 mt-4 text-lg leading-relaxed">
            TeamMatch AI connects students with projects, skills, and teammates using smart matching. Create a project and find teammates, or discover projects that match your skills.
          </p>
          <div className="flex gap-3 mt-8">
            {user ? (
              <>
                <Link to="/create-project" className="btn-primary flex items-center gap-2">
                  Create a Project <ArrowRight size={16} />
                </Link>
                <Link to="/discover-projects" className="btn-secondary">Find a Project</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary flex items-center gap-2">
                  Get Started Free <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="btn-secondary">Login</Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Search size={18} className="text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Discover Projects</h3>
              <p className="text-sm text-gray-500">Find projects that match your skills and interests. See your match percentage and why it fits.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                <Users size={18} className="text-green-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Find Teammates</h3>
              <p className="text-sm text-gray-500">Create a project and AI recommends the best students. Invite them and build your team.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center mb-4">
                <Sparkles size={18} className="text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Smart Matching</h3>
              <p className="text-sm text-gray-500">AI considers skills, interests, roles, experience, and availability to find the best matches.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">How it works</h2>
        <div className="grid md:grid-cols-5 gap-4">
          {['Create Project', 'AI Analyzes', 'Find Matches', 'Invite / Request', 'Build Together'].map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                {i + 1}
              </div>
              <p className="text-sm font-medium text-gray-900">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to find your team?</h2>
          <p className="text-gray-500 mb-6 text-sm">Join students using TeamMatch AI to build better project teams.</p>
          <Link to={user ? '/dashboard' : '/register'} className="btn-primary inline-flex items-center gap-2">
            {user ? 'Go to Dashboard' : 'Start Now'} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-[8px]">TM</span>
            </div>
            <span className="text-xs font-medium text-gray-500">TeamMatch AI</span>
          </div>
          <p className="text-xs text-gray-400">AI-powered team formation for students</p>
        </div>
      </footer>
    </div>
  );
}
