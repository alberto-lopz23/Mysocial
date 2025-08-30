import { View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SecretsProvider } from "../context/secretsContext"; // importa tu context

const _layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SecretsProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </SecretsProvider>
    </GestureHandlerRootView>
  );
};

export default _layout;
