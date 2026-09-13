import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, Lightbulb, Zap, ArrowRight, Search, Sparkles, Target } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles size={16} />
              <span className="text-sm font-medium">AI-Powered Team Formation</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              TeamMatch AI
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-4">
              "Have an idea? Find the right team to build it."
            </p>
            <p className="text-lg text-primary-200 mb-10 max-w-2xl">
              Connect students with the right projects, skills, interests, and teammates using AI-powered two-way matching.
            </p>
            <div className="flex flex-wrap gap-4">
              {user ? (
                <>
                  <Link to="/create-project" className="bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-50 transition-all shadow-lg flex items-center space-x-2">
                    <Lightbulb size={20} />
                    <span>Create a Project</span>
                  </Link>
                  <Link to="/discover-projects" className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all flex items-center space-x-2">
                    <Search size={20} />
                    <span>Find a Project</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/register" className="bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-50 transition-all shadow-lg flex items-center space-x-2">
                    <span>Get Started Free</span>
                    <ArrowRight size={20} />
                  </Link>
                  <Link to="/login" className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From project idea to balanced team — powered by AI
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 items-center">
            {[
              { icon: <Lightbulb className="w-8 h-8" />, title: 'Project Idea', desc: 'Create your project & specify requirements' },
              { icon: <Sparkles className="w-8 h-8" />, title: 'AI Matching', desc: 'AI analyzes skills, interests & roles' },
              { icon: <Search className="w-8 h-8" />, title: 'Right Students', desc: 'Get ranked recommendations with reasons' },
              { icon: <Target className="w-8 h-8" />, title: 'Better Team', desc: 'Optimized for skill coverage & balance' },
              { icon: <Users className="w-8 h-8" />, title: 'Build Together', desc: 'Invite, accept, and start building' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-primary-600 mb-1">Step {i + 1}</div>
                <h3 className="font-bold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
                {i < 4 && (
                  <div className="hidden md:block mt-4">
                    <ArrowRight className="w-5 h-5 text-gray-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Two-Way Matching</h2>
              <p className="text-gray-600 mb-8">
                TeamMatch AI doesn't just recommend teammates. It creates a two-way connection between project ideas and students who want to build them.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Project → Student</h3>
                    <p className="text-sm text-gray-600">Create a project, specify requirements, and AI finds the best students to invite.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Student → Project</h3>
                    <p className="text-sm text-gray-600">Build your profile, discover matching projects, and request to join the ones you love.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">A</div>
                    <div>
                      <p className="font-bold text-sm">AI-Based Smart Campus</p>
                      <p className="text-xs text-gray-500">Python, ML, React</p>
                    </div>
                  </div>
                  <span className="text-accent-600 font-bold">94%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">B</div>
                    <div>
                      <p className="font-bold text-sm">HealthTrack App</p>
                      <p className="text-xs text-gray-500">Flutter, ML, Firebase</p>
                    </div>
                  </div>
                  <span className="text-accent-600 font-bold">87%</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">C</div>
                    <div>
                      <p className="font-bold text-sm">FinSecure Banking</p>
                      <p className="text-xs text-gray-500">Python, Blockchain</p>
                    </div>
                  </div>
                  <span className="text-accent-600 font-bold">72%</span>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">AI-powered match recommendations</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Find Your Team?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              Join TeamMatch AI and connect with the right projects and teammates.
            </p>
            <Link to={user ? '/dashboard' : '/register'} className="btn-primary text-lg px-10 py-4 inline-flex items-center space-x-2">
              <Zap size={20} />
              <span>{user ? 'Go to Dashboard' : 'Start Now — It\'s Free'}</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-primary-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">TM</span>
            </div>
            <span className="font-bold text-white">TeamMatch AI</span>
          </div>
          <p className="text-sm">AI-powered team formation for students</p>
        </div>
      </footer>
    </div>
  );
}
