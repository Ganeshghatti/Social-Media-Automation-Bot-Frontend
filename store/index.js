import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: null, // Initial state of the token
  updateToken: (newToken) => set(() => ({ token: newToken })), // Action to update the token
  clearToken: () => set(() => ({ token: null })), // Action to clear the token
}));

export default useAuthStore;
