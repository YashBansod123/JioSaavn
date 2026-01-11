import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import MiniPlayer from "./src/components/MiniPlayer";

export default function App() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <AppNavigator />
        <MiniPlayer />
      </View>
    </NavigationContainer>
  );
}
