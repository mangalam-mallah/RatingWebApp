import { create } from "zustand";
import api from "../api/axios.js";

const useStoreStore = create((set) => ({
  stores: [],
  selectedStore: null,
  loading: false,
  error: null,

  fetchStores: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/store");
      set({ stores: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  fetchStoreById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/store/${id}`);
      set({ selectedStore: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  createStore: async (storeData) => {
    try {
      const res = await api.post("/store", storeData);
      set((state) => ({ stores: [...state.stores, res.data.store] }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    }
  },

  updateStore: async (id, updates) => {
    try {
      const res = await api.put(`/store/${id}`, updates);
      set((state) => ({
        stores: state.stores.map((s) => (s._id === id ? res.data.store : s)),
        selectedStore: res.data.store,
      }));
      return res.data;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    }
  },

  deleteStore: async (id) => {
    try {
      await api.delete(`/store/${id}`);
      set((state) => ({
        stores: state.stores.filter((s) => s._id !== id),
        selectedStore:
          state.selectedStore?._id === id ? null : state.selectedStore,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    }
  },
}));

export default useStoreStore;
