import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Search, Users, FolderOpen, ArrowRight, Plus, Clock, Target, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [memberProjects, setMemberProjects] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => { loadDashboard(); }, []);

  const loadDashboard = async () => {
    try {
      const [p, mp, mem, inv, notifs] = await Promise.allSettled([
        api.profile.get(), api.projects.my(), api.projects.member(),
        api.invitations.received(), api.notifications.list(),
      ]);
      if (p.status === 'fulfilled') setProfile(p.value);
      if (mp.status === 'fulfilled') setMyProjects(mp.value);
      if (mem.status === 'fulfilled') setMemberProjects(mem.value);
      if (inv.status === 'fulfilled') setInvitations(inv.value);
      if (notifs.status === 'fulfilled') setNotifications(notifs.value);
    } catch {}
    setLoading(false);
  };

  if (loading) return <div className="p-8"><div className="text-gray-500 text-sm">Loading...</div></div>;

  const pendingInvites = invitations.filter((i: any) => i.status === 'pending');
  const isCreator = user?.role === 'PROJECT_CREATOR' || user?.role === 'BOTH';
  const isStudent = user?.role === 'STUDENT' || user?.role === 'BOTH';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{greeting}, {user?.name?.split(' ')[0]}</h1>
        <p className="text-gray-500 mt-1 text-sm">Find the right project. Build the right team.</p>
      </div>

      <div className="flex gap-3 mb-8">
        <Link to="/discover-projects" className="btn-primary flex items-center gap-2">
          <Search size={16} /> Discover Projects
        </Link>
        <Link to="/find-teammates" className="btn-secondary flex items-center gap-2">
          <Users size={16} /> Find Teammates
        </Link>
        {isCreator && (
          <Link to="/create-project" className="btn-secondary flex items-center gap-2">
            <Plus size={16} /> Create Project
          </Link>
        )}
      </div>

      {!profile && isStudent && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-900">Complete your profile</p>
            <p className="text-xs text-blue-700 mt-0.5">Add your skills and interests to get better project recommendations</p>
          </div>
          <Link to="/student-profile" className="btn-primary text-xs py-2">Complete Profile</Link>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'My Projects', value: myProjects.length, icon: FolderOpen, color: 'text-blue-600' },
          { label: 'Team Projects', value: memberProjects.length, icon: Users, color: 'text-green-600' },
          { label: 'Invitations', value: pendingInvites.length, icon: FolderOpen, color: 'text-orange-600' },
          { label: 'Profile', value: profile ? 'Complete' : 'Incomplete', icon: Target, color: 'text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">{stat.label}</span>
              <stat.icon size={16} className={stat.color} />
            </div>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {isCreator && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">My Projects</h2>
              <Link to="/create-project" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                New Project <Plus size={12} />
              </Link>
            </div>
            {myProjects.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <p className="text-sm text-gray-500 mb-2">No projects yet</p>
                <Link to="/create-project" className="text-sm text-blue-600 hover:underline">Create your first project</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {myProjects.slice(0, 4).map((project: any) => (
                  <Link key={project.id} to={`/projects/${project.id}`} className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-200 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{project.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{project.members?.length || 0}/{project.teamSize} members</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.joinRequests?.filter((r: any) => r.status === 'pending').length > 0 && (
                          <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {project.joinRequests.filter((r: any) => r.status === 'pending').length}
                          </span>
                        )}
                        <ChevronRight size={14} className="text-gray-400" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {isStudent && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Recent Invitations</h2>
              <Link to="/invitations" className="text-xs text-blue-600 hover:underline">View all</Link>
            </div>
            {pendingInvites.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <p className="text-sm text-gray-500 mb-2">No pending invitations</p>
                <Link to="/discover-projects" className="text-sm text-blue-600 hover:underline">Discover projects</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingInvites.slice(0, 4).map((inv: any) => (
                  <div key={inv.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{inv.project?.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">From {inv.sender?.name}</p>
                      </div>
                      {inv.matchScore && (
                        <span className="text-sm font-semibold text-blue-600">{inv.matchScore}%</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isStudent && memberProjects.length > 0 && (
          <div>
            <h2 className="section-title mb-3">My Teams</h2>
            <div className="space-y-2">
              {memberProjects.slice(0, 4).map((project: any) => (
                <Link key={project.id} to={`/projects/${project.id}`} className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-200 transition-all">
                  <p className="text-sm font-medium text-gray-900">{project.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{project.members?.length || 0} members</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="section-title mb-3">Recent Activity</h2>
          {notifications.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
              <p className="text-sm text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.slice(0, 4).map((n: any) => (
                <div key={n.id} className={`bg-white rounded-xl border border-gray-200 p-3 ${!n.read ? 'border-l-2 border-l-blue-500' : ''}`}>
                  <p className="text-sm font-medium text-gray-900">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
