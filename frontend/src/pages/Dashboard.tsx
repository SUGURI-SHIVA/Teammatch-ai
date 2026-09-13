import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { MatchScore, SkillBadge, InterestBadge, ProgressBar } from '../components/UI';
import { LayoutDashboard, FolderOpen, Users, Mail, Send, Bell, Plus, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [memberProjects, setMemberProjects] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const [p, mp, mem, inv, jr, notifs] = await Promise.allSettled([
        api.profile.get(),
        api.projects.my(),
        api.projects.member(),
        api.invitations.received(),
        api.joinRequests.my(),
        api.notifications.list(),
      ]);
      if (p.status === 'fulfilled') setProfile(p.value);
      if (mp.status === 'fulfilled') setMyProjects(mp.value);
      if (mem.status === 'fulfilled') setMemberProjects(mem.value);
      if (inv.status === 'fulfilled') setInvitations(inv.value);
      if (jr.status === 'fulfilled') setJoinRequests(jr.value);
      if (notifs.status === 'fulfilled') setNotifications(notifs.value);
    } catch {}
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-500">Loading dashboard...</div></div>;

  const isStudent = user?.role === 'STUDENT' || user?.role === 'BOTH';
  const isCreator = user?.role === 'PROJECT_CREATOR' || user?.role === 'BOTH';
  const pendingInvites = invitations.filter((i: any) => i.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-1">Here's your TeamMatch AI overview</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">My Projects</p>
                <p className="text-2xl font-bold">{myProjects.length}</p>
              </div>
              <FolderOpen className="text-primary-500" size={24} />
            </div>
          </div>
          <div className="card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Team Projects</p>
                <p className="text-2xl font-bold">{memberProjects.length}</p>
              </div>
              <Users className="text-accent-500" size={24} />
            </div>
          </div>
          <div className="card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Invites</p>
                <p className="text-2xl font-bold">{pendingInvites.length}</p>
              </div>
              <Mail className="text-orange-500" size={24} />
            </div>
          </div>
          <div className="card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">My Requests</p>
                <p className="text-2xl font-bold">{joinRequests.filter((r: any) => r.status === 'pending').length}</p>
              </div>
              <Send className="text-purple-500" size={24} />
            </div>
          </div>
        </div>

        {!profile && isStudent && (
          <div className="card mb-6 bg-primary-50 border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-primary-900">Complete Your Profile</h3>
                <p className="text-sm text-primary-700">Add your skills and interests to get better project recommendations</p>
              </div>
              <Link to="/student-profile" className="btn-primary text-sm">Complete Profile</Link>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {isCreator && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">My Projects</h2>
                <Link to="/create-project" className="btn-primary text-sm py-2 flex items-center space-x-1">
                  <Plus size={16} /><span>New Project</span>
                </Link>
              </div>
              {myProjects.length === 0 ? (
                <p className="text-gray-500 text-sm">No projects yet. Create your first project!</p>
              ) : (
                <div className="space-y-3">
                  {myProjects.slice(0, 5).map((project: any) => (
                    <Link key={project.id} to={`/projects/${project.id}`} className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{project.title}</p>
                          <p className="text-xs text-gray-500">{project.members?.length || 0}/{project.teamSize} members</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {project.joinRequests?.filter((r: any) => r.status === 'pending').length > 0 && (
                            <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                              {project.joinRequests.filter((r: any) => r.status === 'pending').length}
                            </span>
                          )}
                          <ArrowRight size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {isStudent && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Recent Invitations</h2>
                <Link to="/invitations" className="text-sm text-primary-600 hover:underline">View All</Link>
              </div>
              {pendingInvites.length === 0 ? (
                <p className="text-gray-500 text-sm">No pending invitations</p>
              ) : (
                <div className="space-y-3">
                  {pendingInvites.slice(0, 5).map((inv: any) => (
                    <div key={inv.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{inv.project?.title}</p>
                          <p className="text-xs text-gray-500">From {inv.sender?.name}</p>
                        </div>
                        {inv.matchScore && <MatchScore score={inv.matchScore} size="sm" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {isStudent && profile && (
            <div className="card">
              <h2 className="text-lg font-bold mb-4">Your Skills</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills?.slice(0, 8).map((s: any) => (
                  <SkillBadge key={s.id} name={s.skill.name} level={s.level} />
                ))}
              </div>
              <h2 className="text-lg font-bold mb-4 mt-6">Your Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests?.slice(0, 6).map((i: any) => (
                  <InterestBadge key={i.id} name={i.interest.name} />
                ))}
              </div>
              <Link to="/student-profile" className="text-sm text-primary-600 hover:underline mt-4 inline-block">Edit Profile</Link>
            </div>
          )}

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Recent Notifications</h2>
              <Link to="/notifications" className="text-sm text-primary-600 hover:underline">View All</Link>
            </div>
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm">No notifications</p>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 5).map((n: any) => (
                  <div key={n.id} className={`p-3 rounded-lg text-sm ${n.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-100'}`}>
                    <p className="font-medium">{n.title}</p>
                    <p className="text-gray-600 text-xs">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
