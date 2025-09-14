// components/FooterNav.js
import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Expo vector icons
import { useRouter, usePathname } from "expo-router";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";

const FooterNav = () => {
  const router = useRouter();
  const pathname = usePathname(); // Para marcar el tab activo

  const tabs = [
    { name: "Home", icon: "home-outline", route: "/home" },
    { name: "Write", icon: "add-circle-outline", route: "/write" },
    { name: "ChatRandom", icon: "person-outline", route: "/chatRandom" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isActive = pathname === tab.route;
        return (
          <Pressable
            key={index}
            style={styles.tab}
            onPress={() => router.push(tab.route)} // forza navegación
          >
            <Ionicons
              name={tab.icon}
              size={28}
              color={isActive ? theme.Colors.primary : theme.Colors.textLight}
            />
            <Text
              style={[
                styles.label,
                {
                  color: isActive
                    ? theme.Colors.primary
                    : theme.Colors.textLight,
                },
              ]}
            >
              {tab.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default FooterNav;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: hp(2),
    borderTopWidth: 1,
    borderTopColor: theme.Colors.gray,
    backgroundColor: theme.Colors.background,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: hp(1.5),
    marginTop: 2,
  },
});
