import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet } from "react-native";
import { db } from "../firebaseConfig";
import { collection, query, getDocs, addDoc, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

const ChatRandom = ({ currentUserId }) => {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  const [currentPartner, setCurrentPartner] = useState(null);

  useEffect(() => {
    matchRandomUser();
  }, []);

  const matchRandomUser = async () => {
    // Obtener usuarios disponibles
    const usersSnapshot = await getDocs(collection(db, "users"));
    const availableUsers = usersSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(u => u.id !== currentUserId);

    if (availableUsers.length === 0) return alert("No hay usuarios disponibles");

    const randomUser = availableUsers[Math.floor(Math.random() * availableUsers.length)];
    setCurrentPartner(randomUser);

    // Crear nuevo chat
    const chatRef = await addDoc(collection(db, "chats"), {
      user1: currentUserId,
      user2: randomUser.id,
      createdAt: serverTimestamp()
    });

    setChatId(chatRef.id);
    setMessages([]);
    listenMessages(chatRef.id);
  };

  const listenMessages = (chatId) => {
    const messagesQuery = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt"));
    return onSnapshot(messagesQuery, snapshot => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      userId: currentUserId,
      text: newMessage,
      createdAt: serverTimestamp()
    });
    setNewMessage("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Text style={{ alignSelf: item.userId === currentUserId ? "flex-end" : "flex-start", margin: 5 }}>
            {item.text}
          </Text>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.input}
          placeholder="Escribe un mensaje..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendBtn}>
          <Text style={{ color: "#fff" }}>Enviar</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de siguiente persona */}
      <TouchableOpacity onPress={matchRandomUser} style={styles.nextBtn}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Siguiente persona</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  inputContainer: { flexDirection: "row", marginTop: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10 },
  sendBtn: { backgroundColor: "#007AFF", padding: 10, borderRadius: 8, marginLeft: 5, justifyContent: "center" },
  nextBtn: { backgroundColor: "#FF5722", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 }
});

export default ChatRandom;
