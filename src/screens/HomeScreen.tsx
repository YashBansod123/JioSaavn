import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import SongCard from "../components/SongCard";
import SuggestedHome from "../components/SuggestedHome";

import { usePlayerStore } from "../store/playerStore";
import { useQueueStore } from "../store/queueStore";

import { useThemeStore } from "../store/themeStore";
import { themeColors } from "../theme/theme";

import {
  SaavnSong,
  SaavnArtist,
  searchSongs,
  searchArtists,
} from "../api/saavn";

export default function HomeScreen({ navigation }: any) {
  const [query, setQuery] = useState("arijit");
  const [songs, setSongs] = useState<SaavnSong[]>([]);
  const [artists, setArtists] = useState<SaavnArtist[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const playSong = usePlayerStore((s) => s.playSong);
  const setQueue = useQueueStore((s) => s.setQueue);

  // theme
  const isDark = useThemeStore((s) => s.isDark);
  const colors = isDark ? themeColors.dark : themeColors.light;

  // tabs + sorting
  const tabs = ["Suggested", "Songs", "Artists", "Albums"] as const;
  type TabType = (typeof tabs)[number];

  const sortOptions = [
    "Ascending",
    "Descending",
    "Artist",
    "Album",
    "Year",
    "Date Added",
    "Date Modified",
    "Composer",
  ] as const;

  type SortType = (typeof sortOptions)[number];

  const [activeTab, setActiveTab] = useState<TabType>("Suggested");
  const [sortType, setSortType] = useState<SortType>("Ascending");
  const [showSort, setShowSort] = useState(false);

  async function loadSongs(isLoadMore = false) {
    try {
      if (loading || loadingMore) return;

      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      const nextPage = isLoadMore ? page + 1 : 1;
      const res = await searchSongs(query, nextPage);

      // ✅ fetch artists only when fresh search (not pagination)
      if (!isLoadMore) {
        const artistRes = await searchArtists(query, 1);
        setArtists(artistRes?.results || []);
      }

      if (isLoadMore) {
        setSongs((prev) => {
          const merged = [...prev, ...res.results];
          return Array.from(new Map(merged.map((s) => [s.id, s])).values());
        });
        setPage(nextPage);
      } else {
        const unique = Array.from(
          new Map(res.results.map((s) => [s.id, s])).values()
        );
        setSongs(unique);
        setPage(1);
      }
    } catch (err) {
      console.log("loadSongs error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadSongs(false);
  }, []);

  // ✅ sorting
  const sortedSongs = useMemo(() => {
    const copy = [...songs];

    if (sortType === "Ascending") {
      copy.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === "Descending") {
      copy.sort((a, b) => b.name.localeCompare(a.name));
    }

    return copy;
  }, [songs, sortType]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: 40 }}>
      {/* ✅ Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "900", color: colors.text }}>
          Music
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Queue")}
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            backgroundColor: colors.card,
            justifyContent: "center",
            alignItems: "center",
            elevation: 2,
          }}
        >
          <Ionicons name="list" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* ✅ Tabs */}
      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: "row", gap: 22, paddingHorizontal: 16 }}>
          {tabs.map((t) => {
            const isActive = activeTab === t;

            return (
              <TouchableOpacity
                key={t}
                onPress={() => {
                  setActiveTab(t);
                  setShowSort(false);
                }}
                style={{ paddingBottom: 10 }}
              >
                <Text
                  style={{
                    fontWeight: isActive ? "900" : "600",
                    color: isActive ? colors.orange : colors.subText,
                  }}
                >
                  {t}
                </Text>

                {isActive && (
                  <View
                    style={{
                      height: 3,
                      backgroundColor: colors.orange,
                      marginTop: 6,
                      borderRadius: 10,
                      width: 26,
                    }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ✅ Suggested Tab */}
      {activeTab === "Suggested" ? (
        <SuggestedHome
          songs={sortedSongs}
          artists={artists}
          onPressSong={async (song) => {
            const index = sortedSongs.findIndex((s) => s.id === song.id);
            await setQueue(sortedSongs, index);
            await playSong(song);
            navigation.navigate("Player");
          }}
        />
      ) : (
        <>
          {/* ✅ Search Box */}
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
              placeholderTextColor={colors.subText}
              style={{
                flex: 1,
                backgroundColor: colors.card,
                color: colors.text,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            />

            <TouchableOpacity
              onPress={() => loadSongs(false)}
              style={{
                backgroundColor: colors.orange,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "white", fontWeight: "900" }}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* ✅ Songs count + Sort */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 16,
              marginTop: 2,
            }}
          >
            <Text style={{ fontWeight: "800", color: colors.text }}>
              {sortedSongs.length} songs
            </Text>

            <TouchableOpacity
              onPress={() => setShowSort((p) => !p)}
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Text style={{ color: colors.orange, fontWeight: "900" }}>
                {sortType}
              </Text>
              <Ionicons name="swap-vertical" size={18} color={colors.orange} />
            </TouchableOpacity>
          </View>

          {/* ✅ Sort Dropdown */}
          {showSort && (
            <View
              style={{
                position: "absolute",
                top: 175,
                right: 16,
                width: 200,
                backgroundColor: colors.card,
                borderRadius: 14,
                padding: 10,
                elevation: 6,
                zIndex: 999,
              }}
            >
              {sortOptions.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => {
                    setSortType(opt);
                    setShowSort(false);
                  }}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                  }}
                >
                  <Text style={{ fontWeight: "700", color: colors.text }}>
                    {opt}
                  </Text>

                  <View
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      borderWidth: 2,
                      borderColor: colors.orange,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {sortType === opt && (
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: colors.orange,
                        }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ✅ List */}
          {loading ? (
            <ActivityIndicator size="large" style={{ marginTop: 30 }} />
          ) : (
            <FlatList
              contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
              data={sortedSongs}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={({ item }) => (
                <SongCard
                  song={item}
                  onPress={async () => {
                    const index = sortedSongs.findIndex((s) => s.id === item.id);
                    await setQueue(sortedSongs, index);
                    await playSong(item);
                    navigation.navigate("Player");
                  }}
                />
              )}
              onScrollBeginDrag={() => setShowSort(false)}
              onEndReached={() => loadSongs(true)}
              onEndReachedThreshold={0.7}
              ListFooterComponent={
                loadingMore ? (
                  <ActivityIndicator style={{ marginVertical: 15 }} />
                ) : null
              }
            />
          )}
        </>
      )}
    </View>
  );
}
