import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentProfile from './pages/StudentProfile';
import CreateProject from './pages/CreateProject';
import DiscoverProjects from './pages/DiscoverProjects';
import FindTeammates from './pages/FindTeammates';
import ProjectDetail from './pages/ProjectDetail';
import Invitations from './pages/Invitations';
import JoinRequests from './pages/JoinRequests';
import Notifications from './pages/Notifications';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-500 text-sm">Loading...</div></div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-500 text-sm">Loading...</div></div>;
  if (user) return <Navigate to="/dashboard" />;
  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-56">
        {children}
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/student-profile" element={<ProtectedRoute><AppLayout><StudentProfile /></AppLayout></ProtectedRoute>} />
      <Route path="/create-project" element={<ProtectedRoute><AppLayout><CreateProject /></AppLayout></ProtectedRoute>} />
      <Route path="/discover-projects" element={<ProtectedRoute><AppLayout><DiscoverProjects /></AppLayout></ProtectedRoute>} />
      <Route path="/find-teammates" element={<ProtectedRoute><AppLayout><FindTeammates /></AppLayout></ProtectedRoute>} />
      <Route path="/projects/:id" element={<ProtectedRoute><AppLayout><ProjectDetail /></AppLayout></ProtectedRoute>} />
      <Route path="/projects/:projectId/find-teammates" element={<ProtectedRoute><AppLayout><FindTeammates /></AppLayout></ProtectedRoute>} />
      <Route path="/invitations" element={<ProtectedRoute><AppLayout><Invitations /></AppLayout></ProtectedRoute>} />
      <Route path="/join-requests" element={<ProtectedRoute><AppLayout><JoinRequests /></AppLayout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><AppLayout><Notifications /></AppLayout></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
