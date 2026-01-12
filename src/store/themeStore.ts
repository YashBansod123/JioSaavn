import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeState = {
  isDark: boolean;
  loadTheme: () => Promise<void>;
  toggleTheme: () => Promise<void>;
};

const STORAGE_KEY = "@theme_mode_v1";

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: false,

  loadTheme: async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      set({ isDark: saved === "dark" });
    }
  },

  toggleTheme: async () => {
    const next = !get().isDark;
    set({ isDark: next });
    await AsyncStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  },
}));
