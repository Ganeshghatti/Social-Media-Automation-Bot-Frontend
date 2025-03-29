import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
  clearUser: () => set({ user: null }),

  fetchUser: async (token) => {
    if (!token) return;

    try {
      const response = await axios.get(
        "https://api.bot.thesquirrel.tech/user/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ user: response.data.data });
    } catch (error) {
      toast.error("Error in fetch user");

      console.error("Failed to fetch user:", error);
      set({ user: null }); // Reset user if error
    }
  },

  logout: () => {
    localStorage.removeItem("token"); // Remove token from storage
    set({ user: null }); // Clear user state
  },
}));
