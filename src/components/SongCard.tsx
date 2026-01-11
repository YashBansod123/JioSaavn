import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SaavnSong, getBestImage } from "../api/saavn";

type Props = {
  song: SaavnSong;
  onPress: () => void;
  onAddToQueue?: () => void;
};

export default function SongCard({ song, onPress, onAddToQueue }: Props) {
  const img = getBestImage(song);

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onAddToQueue}   // ✅ ADD HERE
      style={{
        flexDirection: "row",
        padding: 12,
        borderRadius: 12,
        backgroundColor: "#fff",
        marginBottom: 10,
        alignItems: "center",
        elevation: 2,
      }}
    >
      <Image
        source={{ uri: img }}
        style={{ width: 55, height: 55, borderRadius: 10, marginRight: 12 }}
      />

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: "700" }} numberOfLines={1}>
          {song.name}
        </Text>
        <Text
          style={{ fontSize: 13, color: "#666", marginTop: 3 }}
          numberOfLines={1}
        >
          {song.primaryArtists || "Unknown Artist"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
