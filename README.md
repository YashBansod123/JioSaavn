# 🎵 JioSaavn Music Player (React Native + Expo)

A React Native music player app built as a company assignment using the **JioSaavn API**.

---

## ✨ Features
- 🔍 Search songs (JioSaavn API)
- 📜 Pagination / Infinite Scroll
- ▶️ Play / Pause audio
- ⏩ Next / Previous (Queue based)
- 🎚 Seek bar with current time + duration
- 📌 Mini Player (persistent bottom player synced with playback)
- 🎶 Queue Management
  - Highlight currently playing song
  - Remove songs from queue
  - Reorder queue (Up/Down)
  - Persist queue locally using AsyncStorage
- 🔁 Auto-play next song when current ends

---

## 🧑‍💻 Tech Stack
- **React Native** (Expo + TypeScript)
- **React Navigation**
- **Zustand** (State management)
- **expo-av** (Audio playback)
- **AsyncStorage** (Local persistence)

---

## ✅ Requirements
Make sure you have these installed:

## ✅ Requirements
Make sure you have these installed:

### 1) Node.js (LTS)
Download from: https://nodejs.org  
Verify installation:
```bash
node -v
npm -v

2) Expo CLI

Install globally:
npm install -g expo
3) Expo Go (Mobile App)

Install Expo Go on your phone:

Android: Play Store

iOS: App Store

🚀 Getting Started (Run Locally)
1) Clone the repository
git clone https://github.com/YashBansod123/JioSaavn.git
cd JioSaavn

2) Install dependencies
npm install

3) Start the development server
npx expo start

If the app is not updating properly / gives cache issues:
npx expo start -c

📱 Run on Mobile (Expo Go)

Open Expo Go on your mobile

Scan the QR code shown in terminal / browser (Expo Dev Tools)

The app will open on your phone

✅ Tip: Ensure your laptop and mobile are on the same WiFi network.
If campus WiFi blocks Expo, use a mobile hotspot.
