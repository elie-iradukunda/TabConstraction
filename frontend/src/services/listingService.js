import api from './api';

export const listingService = {
  getListings: async (params) => {
    const response = await api.get('/listings', { params });
    return response.data;
  },
  getListing: async (id) => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },
  getMyListings: async () => {
    const response = await api.get('/listings/my');
    return response.data;
  },
  createListing: async (formData) => {
    const response = await api.post('/listings', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  updateListing: async (id, formData) => {
    const response = await api.put(`/listings/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  deleteListing: async (id) => {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  },
  getAdminListings: async () => {
    const response = await api.get('/listings/admin');
    return response.data;
  },
  updateListingStatus: async (id, status) => {
    const response = await api.patch(`/listings/${id}/status`, { status });
    return response.data;
  },
};
