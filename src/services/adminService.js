import { api } from './api';

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  suspendUser: (userId) => api.post(`/admin/users/${userId}/suspend`),
  activateUser: (userId) => api.post(`/admin/users/${userId}/activate`),
  updateProductStatus: (id, status) =>
    api.patch(`/admin/products/${id}/status`, { status }),
  forceDeleteProduct: (id) => api.delete(`/admin/products/${id}/force`),
  getCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
  exportUsersCsv: () => api.get('/admin/users/export-csv', { responseType: 'blob' }),
  exportOrdersCsv: () => api.get('/admin/orders/export-csv', { responseType: 'blob' }),
};
