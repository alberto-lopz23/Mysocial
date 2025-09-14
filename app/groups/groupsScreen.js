// app/groups/groupsScreen.js
import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

export default function GroupsScreen() {
  const router = useRouter();
  const auth = getAuth();
  const [userGroups, setUserGroups] = useState([]);
  const [searchCode, setSearchCode] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const user = auth.currentUser;

  // Traer los grupos que sigue el usuario
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    const unsubscribe = onSnapshot(userRef, async (docSnap) => {
      if (docSnap.exists()) {
        const followedGroups = docSnap.data().followedGroups || [];
        const groupsData = [];

        // Traer los datos de cada grupo seguido
        for (const groupId of followedGroups) {
          const groupSnap = await getDoc(doc(db, "groups", groupId));
          if (groupSnap.exists()) {
            groupsData.push(groupSnap.data());
          }
        }
        setUserGroups(groupsData);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Buscar grupo por código
  const handleSearch = async () => {
    if (!searchCode.trim()) {
      setSearchResult(null);
      return;
    }

    const groupRef = doc(db, "groups", searchCode.trim());
    const groupSnap = await getDoc(groupRef);

    if (groupSnap.exists()) {
      setSearchResult(groupSnap.data());
    } else {
      setSearchResult("not-found");
    }
  };

  // Seguir grupo
  const handleFollowGroup = async (groupId) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const followedGroups = userSnap.data().followedGroups || [];
      if (!followedGroups.includes(groupId)) {
        await updateDoc(userRef, { followedGroups: [...followedGroups, groupId] });
      }
    }
    setSearchCode("");
    setSearchResult(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Grupos</Text>

      {/* Buscar grupo */}
      <TextInput
        style={styles.input}
        placeholder="Buscar grupo por código"
        value={searchCode}
        onChangeText={setSearchCode}
        onSubmitEditing={handleSearch}
      />

      {searchResult === "not-found" && (
        <Text style={styles.notFoundText}>No se encontró ningún grupo 😢</Text>
      )}

      {searchResult && searchResult !== "not-found" && (
        <View style={styles.searchResult}>
          <Text style={styles.groupText}>{searchResult.name}</Text>
          <TouchableOpacity
            style={styles.followButton}
            onPress={() => handleFollowGroup(searchResult.id)}
          >
            <Text style={styles.followButtonText}>Seguir grupo</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={userGroups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupItem}
            onPress={() => router.push(`/groups/${item.id}`)}
          >
            <Text style={styles.groupText}>{item.name}</Text>
            <Text style={styles.groupCode}>Código: {item.id}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No sigues ningún grupo 😢</Text>
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
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  groupItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
  },
  groupText: { fontSize: 18, fontWeight: "500" },
  groupCode: { fontSize: 14, color: "#555" },
  createButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  createButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  searchResult: {
    padding: 15,
    backgroundColor: "#e0f0ff",
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  followButton: {
    marginTop: 10,
    backgroundColor: "#34C759",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  followButtonText: { color: "#fff", fontWeight: "bold" },
  emptyText: { textAlign: "center", marginTop: 20, color: "#888" },
  notFoundText: { textAlign: "center", marginBottom: 10, color: "red" },
});
