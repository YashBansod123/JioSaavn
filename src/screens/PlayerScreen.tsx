import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";

import { usePlayerStore } from "../store/playerStore";
import { useQueueStore } from "../store/queueStore";
import { getBestImage } from "../api/saavn";

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default function PlayerScreen() {
  const navigation: any = useNavigation();

  // player store
  const song = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const toggle = usePlayerStore((s) => s.togglePlayPause);
  const stop = usePlayerStore((s) => s.stop);
  const playSong = usePlayerStore((s) => s.playSong);

  // seekbar
  const positionMillis = usePlayerStore((s) => s.positionMillis);
  const durationMillis = usePlayerStore((s) => s.durationMillis);
  const seekTo = usePlayerStore((s) => s.seekTo);

  // queue store
  const queue = useQueueStore((s) => s.queue);
  const currentIndex = useQueueStore((s) => s.currentIndex);
  const setCurrentIndex = useQueueStore((s) => s.setCurrentIndex);

  if (!song) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16 }}>No song selected</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 50,
        paddingHorizontal: 18,
        backgroundColor: "#fff",
      }}
    >
      {/* ✅ Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#111" />
        </TouchableOpacity>

        <Text style={{ fontWeight: "900" }}>Now Playing</Text>

        <TouchableOpacity onPress={() => navigation.navigate("Queue")}>
          <Ionicons name="list" size={24} color="#111" />
        </TouchableOpacity>
      </View>

      {/* ✅ Artwork */}
      <Image
        source={{ uri: getBestImage(song) }}
        style={{
          width: "100%",
          height: 330,
          borderRadius: 22,
          marginTop: 10,
          backgroundColor: "#eee",
        }}
      />

      {/* ✅ Song info */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "900",
          marginTop: 18,
          textAlign: "center",
        }}
        numberOfLines={2}
      >
        {song.name}
      </Text>

      <Text
        style={{ fontSize: 14, color: "#666", marginTop: 6 }}
        numberOfLines={1}
      >
        {song.primaryArtists || "Unknown Artist"}
      </Text>

      {/* ✅ Seekbar */}
      <View style={{ marginTop: 20 }}>
        <Slider
          value={positionMillis}
          minimumValue={0}
          maximumValue={durationMillis || 1}
          onSlidingComplete={(value) => seekTo(value)}
          minimumTrackTintColor="orange"
          maximumTrackTintColor="#ddd"
          thumbTintColor="orange"
        />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ color: "#666", fontSize: 12 }}>
            {formatTime(positionMillis)}
          </Text>
          <Text style={{ color: "#666", fontSize: 12 }}>
            {formatTime(durationMillis)}
          </Text>
        </View>
      </View>

      {/* ✅ Play/Pause */}
      {/* ✅ Controls Row (Figma Style) */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 25,
        }}
      >
        {/* Prev */}
        <TouchableOpacity
          onPress={async () => {
            const newIndex = currentIndex - 1;
            if (newIndex >= 0 && queue[newIndex]) {
              await setCurrentIndex(newIndex);
              await playSong(queue[newIndex]);
            }
          }}
          style={{
            width: 55,
            height: 55,
            borderRadius: 27.5,
            backgroundColor: "#111",
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 20,
          }}
        >
          <Ionicons name="play-skip-back" size={22} color="white" />
        </TouchableOpacity>

        {/* Play / Pause Center */}
        <TouchableOpacity
          onPress={toggle}
          style={{
            width: 78,
            height: 78,
            borderRadius: 39,
            backgroundColor: "orange",
            justifyContent: "center",
            alignItems: "center",
            elevation: 4,
          }}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={34}
            color="white"
          />
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity
          onPress={async () => {
            const newIndex = currentIndex + 1;
            if (newIndex < queue.length && queue[newIndex]) {
              await setCurrentIndex(newIndex);
              await playSong(queue[newIndex]);
            }
          }}
          style={{
            width: 55,
            height: 55,
            borderRadius: 27.5,
            backgroundColor: "#111",
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 20,
          }}
        >
          <Ionicons name="play-skip-forward" size={22} color="white" />
        </TouchableOpacity>
      </View>
      {/* ✅ Bottom small icons row (Figma style) */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 18,
          paddingHorizontal: 20,
        }}
      >
        {/* Shuffle */}
        <TouchableOpacity
          onPress={() => {
            // TODO: implement shuffle later
            alert("Shuffle (coming soon)");
          }}
        >
          <Ionicons name="shuffle" size={22} color="#111" />
        </TouchableOpacity>

        {/* Timer */}
        <TouchableOpacity
          onPress={() => {
            // TODO: implement sleep timer later
            alert("Sleep Timer (coming soon)");
          }}
        >
          <Ionicons name="timer-outline" size={22} color="#111" />
        </TouchableOpacity>

        {/* Device / Cast */}
        <TouchableOpacity
          onPress={() => {
            alert("Devices (coming soon)");
          }}
        >
          <Ionicons name="headset-outline" size={22} color="#111" />
        </TouchableOpacity>

        {/* More menu */}
        <TouchableOpacity
          onPress={() => {
            alert("More Options (coming soon)");
          }}
        >
          <Ionicons name="ellipsis-vertical" size={22} color="#111" />
        </TouchableOpacity>
      </View>
      {/* ✅ Lyrics section */}
      <View
        style={{
          marginTop: 22,
          borderTopWidth: 1,
          borderTopColor: "#eee",
          paddingTop: 12,
          alignItems: "center",
        }}
      >
        <Ionicons name="chevron-up" size={22} color="#111" />
        <Text style={{ fontSize: 14, fontWeight: "800", marginTop: 4 }}>
          Lyrics
        </Text>
      </View>
    </View>
  );
}
