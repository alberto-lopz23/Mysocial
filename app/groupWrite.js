import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useLocalSearchParams, useRouter } from "expo-router";

const GroupWrite = () => {
  const [text, setText] = useState("");
  const { groupId } = useLocalSearchParams();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!text.trim()) {
      Alert.alert("Error", "No puedes publicar vacío");
      return;
    }

    try {
      await addDoc(collection(db, "groups", groupId, "posts"), {
        content: text,
        createdAt: serverTimestamp(),
      });
      setText("");
      Alert.alert("Publicado", "Tu secreto se compartió en el grupo", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("Error al escribir:", error);
      Alert.alert("Error", "No se pudo publicar");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Escribe tu secreto en este grupo..."
        value={text}
        onChangeText={setText}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 10,
          borderRadius: 8,
        }}
      />
      <Button title="Publicar en el grupo" onPress={handleSubmit} />
    </View>
  );
};

export default GroupWrite;
