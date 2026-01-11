import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useQueueStore } from "../store/queueStore";
import { usePlayerStore } from "../store/playerStore";
import { getBestImage } from "../api/saavn";
import { Ionicons } from "@expo/vector-icons";

export default function QueueScreen({ navigation }: any) {
  const queue = useQueueStore((s) => s.queue);
  const currentIndex = useQueueStore((s) => s.currentIndex);
  const loadQueue = useQueueStore((s) => s.loadQueue);
  const removeFromQueue = useQueueStore((s) => s.removeFromQueue);
  const moveUp = useQueueStore((s) => s.moveUp);
  const moveDown = useQueueStore((s) => s.moveDown);
  const setCurrentIndex = useQueueStore((s) => s.setCurrentIndex);

  const playSong = usePlayerStore((s) => s.playSong);

  useEffect(() => {
    loadQueue();
  }, []);

  return (
    <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "800" }}>Queue</Text>

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
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                borderRadius: 14,
                backgroundColor: isCurrent ? "#ffe9cc" : "#fff",
                marginBottom: 10,
                elevation: 1,
              }}
            >
              <Image
                source={{ uri: getBestImage(item) }}
                style={{ width: 50, height: 50, borderRadius: 12, marginRight: 10 }}
              />

              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: "800" }} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={{ color: "#666", fontSize: 12 }} numberOfLines={1}>
                  {item.primaryArtists || "Unknown Artist"}
                </Text>
              </View>

              {/* reorder + remove */}
              <View style={{ gap: 6 }}>
                <TouchableOpacity onPress={() => moveUp(index)}>
                  <Ionicons name="arrow-up" size={20} color="#111" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => moveDown(index)}>
                  <Ionicons name="arrow-down" size={20} color="#111" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => removeFromQueue(index)}>
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={{ marginTop: 40, textAlign: "center", color: "#666" }}>
            Queue empty. Play a song to build queue.
          </Text>
        }
      />
    </View>
  );
}
