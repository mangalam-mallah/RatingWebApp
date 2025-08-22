import { create } from "zustand";
import api from "../api/axios.js";

const useAdminStore = create((set) => ({
  dashboardStats: null,
  users: [],
  stores: [],
  loading: false,
  error: null,

  fetchDashboard: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/admin/dashboard");
      set({ dashboardStats: res.data.stats, loading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Error fetching dashboard stats", 
        loading: false 
      });
    }
  },

  fetchUsers: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await api.get(`/admin/users?${queryParams}`);
      set({ users: res.data, loading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Error fetching users", 
        loading: false 
      });
    }
  },

  fetchStores: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await api.get(`/admin/stores?${queryParams}`);
      set({ stores: res.data, loading: false });
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Error fetching stores", 
        loading: false 
      });
    }
  },

  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/admin/create-user", userData);
      set((state) => ({ users: [...state.users, res.data.user], loading: false }));
      return res.data.user;
    } catch (err) {
      set({ 
        error: err.response?.data?.message || "Error creating user", 
        loading: false 
      });
      throw err.response?.data?.message || "Error creating user";
    }
  },
}));

export default useAdminStore;
