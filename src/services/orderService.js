import { api } from './api';

export const orderService = {
  create: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
  getInvoice: (id) => api.get(`/orders/${id}/invoice`, { headers: { Accept: 'text/html' }, responseType: 'text' }),
};
