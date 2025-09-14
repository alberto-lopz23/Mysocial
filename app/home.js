import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Switch,
  Pressable,
} from "react-native";
import { useState, useContext } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import SecretCard from "../components/SecretCard";
import FooterNav from "../components/FooterNav";
import { SecretsContext } from "../context/secretsContext";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
export default function Home() {
  const { secrets } = useContext(SecretsContext);
  const [showExpiringOnly, setShowExpiringOnly] = useState(false);
const auth = getAuth();
const user = auth.currentUser;

const userId = user ? user.uid : "guest";

  const filteredSecrets = secrets
    .filter((secret) => {
      if (!showExpiringOnly) return true;
      if (!secret.expiry) return false;
      const now = new Date();
      const expiryDate = secret.expiry.toDate
        ? secret.expiry.toDate()
        : new Date(secret.expiry);
      return expiryDate > now;
    })
    .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.title}>Secretos</Text>
        
        <Pressable onPress={() => router.push("/groups/groupsScreen")}>
          <Text style={{ color: "#007AFF", marginBottom: 10 }}>
            Ver mis grupos
          </Text>
        </Pressable>
        

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Switch
            value={showExpiringOnly}
            onValueChange={setShowExpiringOnly}
            trackColor={{ false: "#ccc", true: "#4CAF50" }}
            thumbColor={showExpiringOnly ? "#fff" : "#fff"}
          />
          <Text style={{ marginLeft: 10 }}>
            Mostrar solo secretos que expiran
          </Text>
        </View>

        {filteredSecrets.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
            No hay secretos para mostrar
          </Text>
        ) : (
          <FlatList
            data={filteredSecrets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <SecretCard secret={item} userId={userId} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={7}
          />
        )}

        <FooterNav />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});
