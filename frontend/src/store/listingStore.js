import { create } from 'zustand';
import { listingService } from '../services/listingService';

export const useListingStore = create((set) => ({
  listings: [],
  myListings: [],
  selectedListing: null,
  loading: false,
  error: null,

  fetchListings: async (params) => {
    set({ loading: true, error: null });
    try {
      const data = await listingService.getListings(params);
      set({ listings: data.listings, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch listings', loading: false });
    }
  },

  fetchMyListings: async () => {
    set({ loading: true, error: null });
    try {
      const data = await listingService.getMyListings();
      set({ myListings: data.listings, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch your listings', loading: false });
    }
  },

  fetchListingById: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await listingService.getListing(id);
      set({ selectedListing: data.listing, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch listing', loading: false });
    }
  },

  createListing: async (formData) => {
    set({ loading: true, error: null });
    try {
      const data = await listingService.createListing(formData);
      set((state) => ({ 
        myListings: [data.listing, ...state.myListings],
        loading: false 
      }));
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create listing', loading: false });
      throw error;
    }
  },

  deleteListing: async (id) => {
    set({ loading: true, error: null });
    try {
      await listingService.deleteListing(id);
      set((state) => ({
        myListings: state.myListings.filter((l) => l.id !== id),
        listings: state.listings.filter((l) => l.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete listing', loading: false });
      throw error;
    }
  },
}));
