import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Share, Alert } from "react-native";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

const SecretCardShare = ({ secret }) => {
  const viewShotRef = useRef();



  return (
    <View>
      {/* Card envuelta en ViewShot */}
      <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
        <View style={styles.card}>
          <Text style={styles.secretText}>{secret.text}</Text>
        </View>
      </ViewShot>

      + <TouchableOpacity style={styles.shareButton} onPress={() => shareImage()}>
        <Text style={styles.buttonText}>📸 Compartir como imagen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 5,
  },
  secretText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ff0066",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default SecretCardShare;