// app/groups/[groupId].js
import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function GroupScreen() {
  const { groupId } = useLocalSearchParams();
  const [secrets, setSecrets] = useState([]);
  const [text, setText] = useState("");

  // Escuchar secretos en tiempo real
  useEffect(() => {
    const q = query(
      collection(db, "groups", groupId, "posts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const arr = [];
      snapshot.forEach((doc) => arr.push({ id: doc.id, content: doc.data().content }));
      setSecrets(arr);
    });

    return () => unsubscribe();
  }, [groupId]);

  // Publicar secreto
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
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo publicar");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grupo: {groupId}</Text>

      {/* Input para publicar secreto */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Escribe tu secreto..."
          value={text}
          onChangeText={setText}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.publishButton}>
          <Text style={styles.publishButtonText}>Publicar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de secretos o mensaje de vacío */}
      {secrets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Este grupo aún está tranquilo 😶‍🌫️. ¡Sé el primero en compartir un secreto!
          </Text>
        </View>
      ) : (
        <FlatList
          data={secrets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.secretCard}>
              <Text style={styles.secretText}>{item.content}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F9FA" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  inputContainer: { flexDirection: "row", marginBottom: 15 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 },
  publishButton: { marginLeft: 10, backgroundColor: "#007AFF", padding: 12, borderRadius: 8, justifyContent: "center" },
  publishButtonText: { color: "#fff", fontWeight: "bold" },
  secretCard: { backgroundColor: "#fff", padding: 15, marginBottom: 10, borderRadius: 12, elevation: 2 },
  secretText: { fontSize: 16, color: "#333" },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", marginTop: 50 },
  emptyText: { fontSize: 16, color: "#888", fontStyle: "italic", textAlign: "center" },
});
