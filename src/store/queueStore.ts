import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SaavnSong } from "../api/saavn";

const STORAGE_KEY = "@queue_v1";

type QueueState = {
  queue: SaavnSong[];
  currentIndex: number;

  loadQueue: () => Promise<void>;
  saveQueue: () => Promise<void>;
  

  setQueue: (songs: SaavnSong[], startIndex?: number) => Promise<void>;
  addToQueue: (song: SaavnSong) => Promise<void>;
  removeFromQueue: (index: number) => Promise<void>;

  moveUp: (index: number) => Promise<void>;
  moveDown: (index: number) => Promise<void>;

  setCurrentIndex: (index: number) => Promise<void>;
  next: () => Promise<void>;
prev: () => Promise<void>;
};

export const useQueueStore = create<QueueState>((set, get) => ({
  queue: [],
  currentIndex: 0,

  loadQueue: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);

      set({
        queue: parsed.queue || [],
        currentIndex: parsed.currentIndex || 0,
      });
    } catch (e) {
      console.log("loadQueue error:", e);
    }
  },

  saveQueue: async () => {
    try {
      const { queue, currentIndex } = get();
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ queue, currentIndex })
      );
    } catch (e) {
      console.log("saveQueue error:", e);
    }
  },

  setQueue: async (songs, startIndex = 0) => {
    set({ queue: songs, currentIndex: startIndex });
    await get().saveQueue();
  },

  addToQueue: async (song) => {
    const { queue } = get();
    set({ queue: [...queue, song] });
    await get().saveQueue();
  },

  removeFromQueue: async (index) => {
    const { queue, currentIndex } = get();
    const newQueue = queue.filter((_, i) => i !== index);

    let newIndex = currentIndex;
    if (index < currentIndex) newIndex = currentIndex - 1;
    if (newIndex >= newQueue.length) newIndex = Math.max(0, newQueue.length - 1);

    set({ queue: newQueue, currentIndex: newIndex });
    await get().saveQueue();
  },

  moveUp: async (index) => {
    const { queue, currentIndex } = get();
    if (index <= 0) return;

    const newQueue = [...queue];
    [newQueue[index - 1], newQueue[index]] = [newQueue[index], newQueue[index - 1]];

    let newIndex = currentIndex;
    if (currentIndex === index) newIndex = index - 1;
    else if (currentIndex === index - 1) newIndex = index;

    set({ queue: newQueue, currentIndex: newIndex });
    await get().saveQueue();
  },
next: async () => {
  const { queue, currentIndex } = get();
  if (queue.length === 0) return;

  const nextIndex = currentIndex + 1;
  if (nextIndex >= queue.length) return; // no repeat for now

  set({ currentIndex: nextIndex });
  await get().saveQueue();
},

prev: async () => {
  const { queue, currentIndex } = get();
  if (queue.length === 0) return;

  const prevIndex = currentIndex - 1;
  if (prevIndex < 0) return;

  set({ currentIndex: prevIndex });
  await get().saveQueue();
},

  moveDown: async (index) => {
    const { queue, currentIndex } = get();
    if (index >= queue.length - 1) return;

    const newQueue = [...queue];
    [newQueue[index + 1], newQueue[index]] = [newQueue[index], newQueue[index + 1]];

    let newIndex = currentIndex;
    if (currentIndex === index) newIndex = index + 1;
    else if (currentIndex === index + 1) newIndex = index;

    set({ queue: newQueue, currentIndex: newIndex });
    await get().saveQueue();
  },

  setCurrentIndex: async (index) => {
    set({ currentIndex: index });
    await get().saveQueue();
  },
}));

