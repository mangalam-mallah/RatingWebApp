import { create } from "zustand";
import api from "../api/axios.js";

const useRatingStore = create((set) => ({
  ratings: [],
  avgRating: 0,
  loading: false,
  error: null,

  addOrUpdateRating: async (ratingData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/rating/", ratingData);

      set((state) => {
        const updatedRatings = state.ratings.filter(
          (r) => !(r.userId._id === res.data.userId && r.storeId === res.data.storeId)
        );
        return { ratings: [...updatedRatings, res.data], loading: false };
      });
    } catch (err) {
      console.error("Error adding/updating rating:", err);
      set({
        error: err.response?.data?.message || "Error updating rating",
        loading: false,
      });
    }
  },

  fetchRatings: async (storeId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/rating/${storeId}`);
      set({ ratings: res.data, loading: false });
    } catch (err) {
      console.error("Error fetching ratings:", err);
      set({
        error: err.response?.data?.message || "Error fetching ratings",
        loading: false,
      });
    }
  },

  fetchAverageRating: async (storeId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/rating/${storeId}/average`);
      set({ avgRating: res.data.avgRating, loading: false });
    } catch (err) {
      console.error("Error fetching average rating:", err);
      set({
        error: err.response?.data?.message || "Error fetching average rating",
        loading: false,
      });
    }
  },
}));

export default useRatingStore;
