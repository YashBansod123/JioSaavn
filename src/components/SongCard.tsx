import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SaavnSong, getArtistName, getBestImage } from "../api/saavn";

import { useThemeStore } from "../store/themeStore";
import { themeColors } from "../theme/theme";

type Props = {
  song: SaavnSong;
  onPress: () => void;
  onAddToQueue?: () => void;
};

export default function SongCard({ song, onPress, onAddToQueue }: Props) {
  const img = getBestImage(song);

  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? themeColors.dark : themeColors.light;

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onAddToQueue}
      activeOpacity={0.9}
      style={{
        flexDirection: "row",
        padding: 12,
        borderRadius: 12,
        backgroundColor: colors.card,
        marginBottom: 10,
        alignItems: "center",
        elevation: 2,
      }}
    >
      <Image
        source={{ uri: img }}
        style={{
          width: 55,
          height: 55,
          borderRadius: 10,
          marginRight: 12,
          backgroundColor: isDark ? "#111" : "#eee",
        }}
      />

      <View style={{ flex: 1 }}>
        <Text
          style={{ fontSize: 16, fontWeight: "800", color: colors.text }}
          numberOfLines={1}
        >
          {song.name}
        </Text>

        <Text
          style={{ fontSize: 13, color: colors.subText, marginTop: 3 }}
          numberOfLines={1}
        >
          {getArtistName(song)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
