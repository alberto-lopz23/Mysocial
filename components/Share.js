import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Share, Alert } from "react-native";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";

const SecretCardShare = ({ secret }) => {
  const viewShotRef = useRef();

  const shareImage = async () => {
  try {
    // 1. Solicitar permisos de Media Library
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso Requerido",
        "Necesitamos permiso para acceder a tu galería para poder compartir la imagen."
      );
      return;
    }

    // 2. Capturar la vista como una URI de archivo
    const uri = await viewShotRef.current.capture();

    // 3. Guardar el archivo capturado en la galería del dispositivo
    const asset = await MediaLibrary.createAssetAsync(uri);
    
    // 4. Verificar que se creó el asset
    if (asset) {
      // 5. Compartir la imagen usando solo la URL del asset
      const shareOptions = {
        url: asset.uri,
      };
      await Share.share(shareOptions);
    } else {
      Alert.alert("Error", "No se pudo preparar la imagen para compartir.");
    }

  } catch (error) {
    console.log("Error al compartir:", error);
    Alert.alert("Error", "Ocurrió un error al intentar compartir el secreto.");
  }
};

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