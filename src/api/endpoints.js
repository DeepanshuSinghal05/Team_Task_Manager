import api from './axios';

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const projectsApi = {
  list: () => api.get('/projects'),
  create: (payload) => api.post('/projects', payload),
  detail: (id) => api.get(`/projects/${id}`),
  update: (id, payload) => api.put(`/projects/${id}`, payload),
  remove: (id) => api.delete(`/projects/${id}`),
  invite: (id, payload) => api.post(`/projects/${id}/members`, payload),
  removeMember: (id, userId) => api.delete(`/projects/${id}/members/${userId}`),
};

export const tasksApi = {
  list: (projectId, params = {}) => api.get(`/projects/${projectId}/tasks`, { params }),
  create: (projectId, payload) => api.post(`/projects/${projectId}/tasks`, payload),
  detail: (projectId, taskId) => api.get(`/projects/${projectId}/tasks/${taskId}`),
  update: (projectId, taskId, payload) => api.put(`/projects/${projectId}/tasks/${taskId}`, payload),
  patchStatus: (projectId, taskId, status) => api.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status }),
  remove: (projectId, taskId) => api.delete(`/projects/${projectId}/tasks/${taskId}`),
};

export const dashboardApi = {
  get: () => api.get('/dashboard'),
};
