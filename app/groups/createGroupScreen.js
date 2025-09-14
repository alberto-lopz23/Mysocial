// app/groups/createGroupScreen.js
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

export default function CreateGroupScreen() {
  const [groupName, setGroupName] = useState("");
  const router = useRouter();
  const auth = getAuth();

  const generateId = () => {
    return Math.random().toString(36).substring(2, 9); // ID random
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert("Error", "Ponle un nombre al grupo");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "Debes estar logueado para crear un grupo");
      return;
    }

    const newGroupId = generateId();

    const newGroup = {
      id: newGroupId,
      name: groupName,
      creator: user.uid,
      members: [user.uid],
      createdAt: new Date().toISOString(),
    };

    try {
      // Crear el grupo en Firestore
      await setDoc(doc(db, "groups", newGroupId), newGroup);

      // Agregar grupo a la lista de grupos seguidos del usuario
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const followedGroups = userSnap.data().followedGroups || [];
        if (!followedGroups.includes(newGroupId)) {
          await updateDoc(userRef, {
            followedGroups: [...followedGroups, newGroupId],
          });
        }
      } else {
        // Si el usuario no tiene doc, crearlo
        await setDoc(userRef, { followedGroups: [newGroupId] });
      }

      Alert.alert("Éxito", `Grupo "${groupName}" creado y añadido a tus grupos ✅`);
      router.push(`/groups/${newGroupId}`); // Ir al grupo recién creado
    } catch (error) {
      console.error("Error creando el grupo:", error);
      Alert.alert("Error", "No se pudo crear el grupo. Intenta de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear un nuevo grupo</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del grupo"
        value={groupName}
        onChangeText={setGroupName}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
        <Text style={styles.buttonText}>Crear Grupo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
