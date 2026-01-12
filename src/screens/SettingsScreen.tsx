import React from "react";
import { View, Text, Switch } from "react-native";
import { useThemeStore } from "../store/themeStore";

export default function SettingsScreen() {
  const isDark = useThemeStore((s) => s.isDark);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 20,
        backgroundColor: isDark ? "#000" : "#fff",
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "900", color: isDark ? "#fff" : "#111" }}>
        Settings
      </Text>

      {/* ✅ Dark Mode Toggle */}
      <View
        style={{
          marginTop: 25,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
          borderRadius: 14,
          backgroundColor: isDark ? "#111" : "#f2f2f2",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "800", color: isDark ? "#fff" : "#111" }}>
          Dark Mode
        </Text>

        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <Text
        style={{
          marginTop: 20,
          fontSize: 13,
          color: isDark ? "#aaa" : "#666",
        }}
      >
        Toggle dark theme for better experience at night.
      </Text>
    </View>
  );
}
