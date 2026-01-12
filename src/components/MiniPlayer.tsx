import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { usePlayerStore } from "../store/playerStore";
import { getArtistName, getBestImage } from "../api/saavn";
import { Ionicons } from "@expo/vector-icons";

import { useThemeStore } from "../store/themeStore";
import { themeColors } from "../theme/theme";

export default function MiniPlayer() {
  const navigation: any = useNavigation();

  const song = usePlayerStore((s) => s.currentSong);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const toggle = usePlayerStore((s) => s.togglePlayPause);

  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? themeColors.dark : themeColors.light;

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
        backgroundColor: colors.card,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 6,
      }}
    >
      <Image
        source={{ uri: getBestImage(song) }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 12,
          marginRight: 12,
          backgroundColor: isDark ? "#111" : "#eee",
        }}
      />

      <View style={{ flex: 1 }}>
        <Text
          style={{ color: colors.text, fontWeight: "900", fontSize: 14 }}
          numberOfLines={1}
        >
          {song.name}
        </Text>
        <Text
          style={{ color: colors.subText, marginTop: 3, fontSize: 12 }}
          numberOfLines={1}
        >
          {getArtistName(song)}
        </Text>
      </View>

      {/* ✅ Play Pause Button */}
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          toggle();
        }}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.orange,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name={isPlaying ? "pause" : "play"} size={22} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
