const API_BASE = '/api';

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (name: string, email: string, password: string, role: string) =>
      request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) }),
    me: () => request('/auth/me'),
  },
  profile: {
    get: () => request('/profile'),
    save: (data: any) => request('/profile', { method: 'POST', body: JSON.stringify(data) }),
    getAll: () => request('/profile/all'),
    getByUser: (userId: string) => request(`/profile/${userId}`),
  },
  projects: {
    list: () => request('/projects'),
    my: () => request('/projects/my'),
    member: () => request('/projects/member'),
    get: (id: string) => request(`/projects/${id}`),
    create: (data: any) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/projects/${id}`, { method: 'DELETE' }),
  },
  recommendations: {
    projects: () => request('/recommendations/projects'),
    students: (projectId: string) => request(`/recommendations/students/${projectId}`),
    teamCoverage: (projectId: string) => request(`/recommendations/team-coverage/${projectId}`),
  },
  match: {
    studentProject: (studentId: string, projectId: string) =>
      request(`/match/student-project/${studentId}/${projectId}`),
  },
  invitations: {
    received: () => request('/invitations/received'),
    sent: () => request('/invitations/sent'),
    send: (data: any) => request('/invitations', { method: 'POST', body: JSON.stringify(data) }),
    accept: (id: string) => request(`/invitations/${id}/accept`, { method: 'PUT' }),
    decline: (id: string) => request(`/invitations/${id}/decline`, { method: 'PUT' }),
  },
  joinRequests: {
    my: () => request('/join-requests/my'),
    forProject: (projectId: string) => request(`/join-requests/project/${projectId}`),
    send: (data: any) => request('/join-requests', { method: 'POST', body: JSON.stringify(data) }),
    accept: (id: string) => request(`/join-requests/${id}/accept`, { method: 'PUT' }),
    reject: (id: string) => request(`/join-requests/${id}/reject`, { method: 'PUT' }),
  },
  notifications: {
    list: () => request('/notifications'),
    unreadCount: () => request('/notifications/unread-count'),
    readAll: () => request('/notifications/read-all', { method: 'PUT' }),
    read: (id: string) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  },
};
