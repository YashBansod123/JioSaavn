import React, { useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { View } from "react-native";

import AppNavigator from "./src/navigation/AppNavigator";
import MiniPlayer from "./src/components/MiniPlayer";
import { useThemeStore } from "./src/store/themeStore";

export default function App() {
  const isDark = useThemeStore((s) => s.isDark);
  const loadTheme = useThemeStore((s) => s.loadTheme);

  const [currentRoute, setCurrentRoute] = useState<string | undefined>();

  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <NavigationContainer
      theme={isDark ? DarkTheme : DefaultTheme}
      onStateChange={(state) => {
        const route = state?.routes?.[state.index]?.name;
        setCurrentRoute(route);
      }}
    >
      <View style={{ flex: 1 }}>
        <AppNavigator />

        {/* ✅ Hide MiniPlayer on Player screen */}
        {currentRoute !== "Player" && <MiniPlayer />}
      </View>
    </NavigationContainer>
  );
}
