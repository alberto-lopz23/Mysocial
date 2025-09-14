// app/groups/groupsScreen.js
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function GroupsScreen() {
  const router = useRouter();

  // Datos de ejemplo (puedes traerlos de Firestore después)
  const groups = [
    { id: "amigos", name: "Amigos de la Uni" },
    { id: "work", name: "Oficina 🤫" },
    { id: "random", name: "Random Secrets" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Grupos</Text>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupItem}
            onPress={() => router.push(`/groups/${item.id}`)}
          >
            <Text style={styles.groupText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/groups/createGroupScreen")}
      >
        <Text style={styles.createButtonText}>+ Crear Grupo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  groupItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
  },
  groupText: {
    fontSize: 18,
  },
  createButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
