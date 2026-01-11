import React, { useEffect, useState } from "react";
import { usePlayerStore } from "../store/playerStore";
import { useQueueStore } from "../store/queueStore";
import { Ionicons } from "@expo/vector-icons";

import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import SongCard from "../components/SongCard";
import { SaavnSong, searchSongs } from "../api/saavn";

export default function HomeScreen({ navigation }: any) {
  const [query, setQuery] = useState("arijit");
  const [songs, setSongs] = useState<SaavnSong[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const playSong = usePlayerStore((s) => s.playSong);
  const setQueue = useQueueStore((s) => s.setQueue);

  async function loadSongs(isLoadMore = false) {
    try {
      if (loading || loadingMore) return;

      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      const res = await searchSongs(query, isLoadMore ? page + 1 : 1);

      if (isLoadMore) {
        setSongs((prev) => [...prev, ...res.results]);
        setPage((p) => p + 1);
      } else {
        setSongs(res.results);
        setPage(1);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadSongs(false);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5", paddingTop: 40 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "800" }}>Music</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Queue")}
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            elevation: 2,
          }}
        >
          <Ionicons name="list" size={22} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Search Box */}
      <View
        style={{
          margin: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search songs..."
          style={{
            flex: 1,
            backgroundColor: "#fff",
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        />

        <TouchableOpacity
          onPress={() => loadSongs(false)}
          style={{
            backgroundColor: "orange",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          data={songs}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <SongCard
              song={item}
              onPress={async () => {
                const index = songs.findIndex((s) => s.id === item.id);

                await setQueue(songs, index);
                await playSong(item);

                navigation.navigate("Player");
              }}
            />
          )}
          onEndReached={() => loadSongs(true)}
          onEndReachedThreshold={0.7}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator style={{ marginVertical: 15 }} />
            ) : null
          }
        />
      )}
    </View>
  );
}
