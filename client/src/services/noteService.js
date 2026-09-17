import api from './api';

export const noteService = {
  getNotes: (params = {}) => api.get('/notes', { params }),
  getNote: (id) => api.get(`/notes/${id}`),
  createNote: (payload) => api.post('/notes', payload),
  updateNote: (id, payload) => api.put(`/notes/${id}`, payload),
  deleteNote: (id) => api.delete(`/notes/${id}`),
  togglePin: (id) => api.patch(`/notes/${id}/pin`),
  toggleArchive: (id) => api.patch(`/notes/${id}/archive`),
};
