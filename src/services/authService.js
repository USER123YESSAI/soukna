import { api } from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      return api.post('/auth/profile', data);
    }
    return api.put('/auth/profile', data);
  },
  acceptTerms: (data = { terms_version: '1.0' }) => api.post('/auth/accept-terms', data),
};
