import { create } from "zustand";
import { Audio } from "expo-av";
import { SaavnSong, getBestAudioUrl } from "../api/saavn";

type PlayerState = {
  currentSong: SaavnSong | null;
  isPlaying: boolean;
  sound: Audio.Sound | null;

  playSong: (song: SaavnSong) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  stopSong: () => Promise<void>;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  sound: null,

  playSong: async (song) => {
    try {
      const url = getBestAudioUrl(song);
      if (!url) {
        console.log("No audio url found");
        return;
      }

      // ✅ enable background audio (works in most cases)
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // unload old song
      const oldSound = get().sound;
      if (oldSound) {
        await oldSound.stopAsync();
        await oldSound.unloadAsync();
      }

      // create & play
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );

      set({ currentSong: song, isPlaying: true, sound });
    } catch (err) {
      console.log("playSong error:", err);
    }
  },

  togglePlayPause: async () => {
    try {
      const { sound, isPlaying } = get();
      if (!sound) return;

      if (isPlaying) {
        await sound.pauseAsync();
        set({ isPlaying: false });
      } else {
        await sound.playAsync();
        set({ isPlaying: true });
      }
    } catch (err) {
      console.log("togglePlayPause error:", err);
    }
  },

  stopSong: async () => {
    try {
      const { sound } = get();
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }
      set({ sound: null, currentSong: null, isPlaying: false });
    } catch (err) {
      console.log("stopSong error:", err);
    }
  },
}));
