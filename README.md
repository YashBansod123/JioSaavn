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

### 1) Node.js (LTS)
Download from: https://nodejs.org  
Verify installation:
```bash
node -v
npm -v
2) Expo CLI
Install globally:

bash
Copy code
npm install -g expo
3) Expo Go (Mobile App)
Install Expo Go on your phone:

Android: Play Store

iOS: App Store

🚀 Getting Started (Run Locally)
1) Clone the repository
bash
Copy code
git clone https://github.com/YashBansod123/JioSaavn.git
cd JioSaavn
2) Install dependencies
bash
Copy code
npm install
3) Start the development server
bash
Copy code
npx expo start
If the app is not updating properly / gives cache issues:

bash
Copy code
npx expo start -c
📱 Run on Mobile (Expo Go)
Open Expo Go on your mobile

Scan the QR code shown in terminal / browser (Expo Dev Tools)

The app will open on your phone

✅ Tip: Ensure your laptop and mobile are on the same WiFi network.
If campus WiFi blocks Expo, use a mobile hotspot.

🛠 Troubleshooting
Problem: App stuck on loading / QR not working
Ensure phone + laptop are on same network

Restart Expo with cache clear:

bash
Copy code
npx expo start -c
Problem: Dependencies error
Reinstall packages:

Windows

bash
Copy code
rmdir /s /q node_modules
npm install
npx expo start -c
macOS/Linux

bash
Copy code
rm -rf node_modules
npm install
npx expo start -c
🌐 API Reference
Example endpoint used:

txt
Copy code
https://saavn.sumit.co/api/search/songs?query=arijit
👤 Author
Yash Bansod

yaml
Copy code

---

Bro ✅ now this README will look **clean and professional** when anyone opens your GitHub repo.

If you want, I can also add:
✅ screenshots section  
✅ demo video link section  
✅ “Project Structure” section  
to make it even more impressive for reviewers.
