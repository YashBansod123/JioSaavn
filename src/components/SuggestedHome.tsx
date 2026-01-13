import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";

import {
  SaavnSong,
  SaavnArtist,
  getBestImage,
  getBestArtistImage,
} from "../api/saavn";

import { useThemeStore } from "../store/themeStore";
import { themeColors } from "../theme/theme";

type Props = {
  songs: SaavnSong[];
  artists: SaavnArtist[];
  onPressSong: (song: SaavnSong) => void;
};

export default function SuggestedHome({ songs, artists, onPressSong }: Props) {
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? themeColors.dark : themeColors.light;

  const recentlyPlayed = songs.slice(0, 10);
  const mostPlayed = songs.slice(10, 20);

  return (
    <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
      {/* Recently Played */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "900", color: colors.text }}>
          Recently Played
        </Text>
        <Text style={{ color: colors.orange, fontWeight: "800" }}>See All</Text>
      </View>

      <FlatList
        data={recentlyPlayed}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, idx) => `${item.id}-${idx}`}
        style={{ marginTop: 10 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPressSong(item)} style={{ width: 120 }}>
            <Image
              source={{ uri: getBestImage(item) }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 18,
                backgroundColor: isDark ? "#111" : "#eee",
              }}
            />
            <Text
              style={{ marginTop: 6, fontWeight: "800", color: colors.text }}
              numberOfLines={2}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Artists */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 22,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "900", color: colors.text }}>
          Artists
        </Text>
        <Text style={{ color: colors.orange, fontWeight: "800" }}>See All</Text>
      </View>

      <FlatList
        data={(artists || []).slice(0, 10)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, idx) => `${item.id}-${idx}`}
        style={{ marginTop: 10 }}
        ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
        renderItem={({ item }) => {
          const img = getBestArtistImage(item);

          return (
            <View style={{ alignItems: "center", width: 90 }}>
              <Image
                source={{ uri: img }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: isDark ? "#111" : "#eee",
                }}
              />

              <Text
                style={{ marginTop: 6, fontWeight: "800", color: colors.text }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </View>
          );
        }}
      />

      {/* Most Played */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 22,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "900", color: colors.text }}>
          Most Played
        </Text>
        <Text style={{ color: colors.orange, fontWeight: "800" }}>See All</Text>
      </View>

      <FlatList
        data={mostPlayed}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, idx) => `${item.id}-${idx}`}
        style={{ marginTop: 10, marginBottom: 120 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPressSong(item)} style={{ width: 120 }}>
            <Image
              source={{ uri: getBestImage(item) }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 18,
                backgroundColor: isDark ? "#111" : "#eee",
              }}
            />
            <Text
              style={{ marginTop: 6, fontWeight: "800", color: colors.text }}
              numberOfLines={2}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
