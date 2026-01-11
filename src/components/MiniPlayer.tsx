import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { usePlayerStore } from "../store/playerStore";
import { getBestImage } from "../api/saavn";
import { Ionicons } from "@expo/vector-icons";

export default function MiniPlayer() {
  const navigation: any = useNavigation();

  const song = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const toggle = usePlayerStore((s) => s.togglePlayPause);

  // ✅ don’t show mini player if nothing is playing
  if (!song) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate("Player")}
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 12,
        height: 70,
        borderRadius: 16,
        backgroundColor: "#111",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
      }}
    >
      <Image
        source={{ uri: getBestImage(song) }}
        style={{ width: 50, height: 50, borderRadius: 12, marginRight: 12 }}
      />

      <View style={{ flex: 1 }}>
        <Text
          style={{ color: "white", fontWeight: "800", fontSize: 14 }}
          numberOfLines={1}
        >
          {song.name}
        </Text>
        <Text style={{ color: "#ccc", marginTop: 3, fontSize: 12 }} numberOfLines={1}>
          {song.primaryArtists || "Unknown Artist"}
        </Text>
      </View>

      {/* Play Pause Button */}
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation(); // ✅ prevent opening Player when clicking play
          toggle();
        }}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: "orange",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={22}
          color="white"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
