import api from './api';

export const userService = {
  getUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/auth/users/${id}`);
    return response.data;
  },
  updateUserStatus: async (id, status) => {
    const response = await api.patch(`/auth/users/${id}/status`, { status });
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  }
};
