import { create } from "zustand";
import { Audio } from "expo-av";
import { SaavnSong, getBestAudioUrl } from "../api/saavn";
import { useQueueStore } from "./queueStore";

type PlayerState = {
  currentSong: SaavnSong | null;
  isPlaying: boolean;
  sound: Audio.Sound | null;

  positionMillis: number;
  durationMillis: number;

  playSong: (song: SaavnSong) => Promise<void>;
  togglePlayPause: () => Promise<void>;
  stop: () => Promise<void>;
  seekTo: (millis: number) => Promise<void>;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  sound: null,

  positionMillis: 0,
  durationMillis: 1,

  playSong: async (song) => {
    try {
      const url = getBestAudioUrl(song);
      if (!url) return;

      // ✅ allow background audio
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // stop/unload old sound
      const oldSound = get().sound;
      if (oldSound) {
        await oldSound.stopAsync();
        await oldSound.unloadAsync();
      }

      // create + play
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );

      // ✅ Track progress + detect end
      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;

        set({
          isPlaying: status.isPlaying,
          positionMillis: status.positionMillis ?? 0,
          durationMillis: status.durationMillis ?? 1,
        });

        // ✅ autoplay next from queue when song ends
        if (status.didJustFinish) {
          const queueState = useQueueStore.getState();
          const nextIndex = queueState.currentIndex + 1;

          if (nextIndex < queueState.queue.length && queueState.queue[nextIndex]) {
            queueState.setCurrentIndex(nextIndex);
            get().playSong(queueState.queue[nextIndex]);
          } else {
            set({ isPlaying: false });
          }
        }
      });

      set({
        currentSong: song,
        isPlaying: true,
        sound,
        positionMillis: 0,
        durationMillis: 1,
      });
    } catch (e) {
      console.log("playSong error:", e);
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
    } catch (e) {
      console.log("togglePlayPause error:", e);
    }
  },

  stop: async () => {
    try {
      const { sound } = get();
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      set({
        sound: null,
        currentSong: null,
        isPlaying: false,
        positionMillis: 0,
        durationMillis: 1,
      });
    } catch (e) {
      console.log("stop error:", e);
    }
  },

  seekTo: async (millis) => {
    try {
      const { sound } = get();
      if (!sound) return;

      await sound.setPositionAsync(millis);
      set({ positionMillis: millis });
    } catch (e) {
      console.log("seekTo error:", e);
    }
  },
}));
