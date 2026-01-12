import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useQueueStore } from "../store/queueStore";
import { usePlayerStore } from "../store/playerStore";
import { getArtistName, getBestImage } from "../api/saavn";
import { Ionicons } from "@expo/vector-icons";

import { useThemeStore } from "../store/themeStore";
import { themeColors } from "../theme/theme";

export default function QueueScreen({ navigation }: any) {
  const queue = useQueueStore((s) => s.queue);
  const currentIndex = useQueueStore((s) => s.currentIndex);
  const loadQueue = useQueueStore((s) => s.loadQueue);
  const removeFromQueue = useQueueStore((s) => s.removeFromQueue);
  const moveUp = useQueueStore((s) => s.moveUp);
  const moveDown = useQueueStore((s) => s.moveDown);
  const setCurrentIndex = useQueueStore((s) => s.setCurrentIndex);

  const playSong = usePlayerStore((s) => s.playSong);

  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? themeColors.dark : themeColors.light;

  useEffect(() => {
    loadQueue();
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 16, backgroundColor: colors.bg }}>
      <Text style={{ fontSize: 22, fontWeight: "900", color: colors.text }}>Queue</Text>

      <FlatList
        style={{ marginTop: 16 }}
        data={queue}
        keyExtractor={(item, idx) => `${item.id}-${idx}`}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item, index }) => {
          const isCurrent = index === currentIndex;

          return (
            <TouchableOpacity
              onPress={async () => {
                await setCurrentIndex(index);
                await playSong(item);
                navigation.navigate("Player");
              }}
              activeOpacity={0.9}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                borderRadius: 14,
                backgroundColor: isCurrent
                  ? (isDark ? "#2a1a00" : "#ffe9cc")
                  : colors.card,
                marginBottom: 10,
                elevation: 1,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Image
                source={{ uri: getBestImage(item) }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  marginRight: 10,
                  backgroundColor: isDark ? "#111" : "#eee",
                }}
              />

              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "900", color: colors.text }} numberOfLines={1}>
                  {item.name}
                </Text>

                <Text style={{ color: colors.subText, fontSize: 12 }} numberOfLines={1}>
                  {getArtistName(item)}
                </Text>
              </View>

              {/* reorder + remove */}
              <View style={{ gap: 6 }}>
                <TouchableOpacity onPress={() => moveUp(index)}>
                  <Ionicons name="arrow-up" size={20} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => moveDown(index)}>
                  <Ionicons name="arrow-down" size={20} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => removeFromQueue(index)}>
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={{ marginTop: 40, textAlign: "center", color: colors.subText }}>
            Queue empty. Play a song to build queue.
          </Text>
        }
      />
    </View>
  );
}
