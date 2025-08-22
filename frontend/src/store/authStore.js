  import { create } from "zustand";
  import api from "../api/axios.js";

  const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    accessToken: localStorage.getItem("accessToken") || null,
    isAuthenticated: !!localStorage.getItem("accessToken"),

    login: async (email, password) => {
      try {
        const res = await api.post("/user/login", { email, password });
        const { accessToken, user } = res.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        set({
          user,
          accessToken,
          isAuthenticated: true,
        });
      } catch (error) {
        throw error.response?.data?.message || "Login failed";
      }
    },

    signupByUser: async (name, email, password, address) => {
      try {
        await api.post("/user/signup", { name, email, password, address });
      } catch (err) {
        throw err.response?.data?.message || "Signup failed";
      }
    },

    signupByAdmin: async (name, email, password, address, role) => {
      try {
        await api.post("/admin/create-user", {
          name,
          email,
          password,
          address,
          role,
        });
      } catch (err) {
        throw err.response?.data?.message || "Admin user creation failed";
      }
    },

    logout: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      set({ user: null, accessToken: null, isAuthenticated: false });
    },

    getUserProfile: async (id) => {
      try {
        const res = await api.get(`/user/${id}`);
        set({ user: res.data });
        return res.data;
      } catch (error) {
        throw error.response?.data?.message || "Get user failed";
      }
    },

    updateProfile: async (id, updates) => {
      try {
        const res = await api.put(`/user/${id}`, updates);
        set({ user: res.data.user });
        return res.data.user;
      } catch (error) {
        throw error.response?.data?.message || "Update Profile failed";
      }
    },

    updatePassword: async (id, { oldPassword, newPassword }) => {
      try {
        const res = await api.put(`/user/${id}/password`, {
          oldPassword,
          newPassword,
        });
        return res.data;
      } catch (error) {
        throw error.response?.data?.message || "Update Password failed";
      }
    },
  }));

  export default useAuthStore;
