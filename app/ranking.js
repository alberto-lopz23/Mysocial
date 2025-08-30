import { StyleSheet, Text, View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import SecretCard from "../components/SecretCard";
import FooterNav from "../components/FooterNav";

export default function Ranking() {
  const [topSecrets, setTopSecrets] = useState([]);
  const userId = "user123"; // tu usuario actual

  useEffect(() => {
    // Traemos solo los top 10 por likesCount
    const q = query(
      collection(db, "secrets"),
      orderBy("likesCount", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTopSecrets(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.title}>🔥 Top Secretos</Text>
        <FlatList
          data={topSecrets}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.rank}>{index + 1}°</Text>
              <SecretCard secret={item} userId={userId} />
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
      <FooterNav />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  rank: { fontSize: 18, fontWeight: "bold", marginBottom: 5, color: "#ff4500" },
});
