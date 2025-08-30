import { StyleSheet, Text, View, TextInput, Switch } from "react-native";
import React, { useState, useContext } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import FooterNav from "../components/FooterNav";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Buttom from "../components/Button";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { SecretsContext } from "../context/secretsContext";

export default function Write() {
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [selfDestruct, setSelfDestruct] = useState(false);
  const { secrets, setSecrets } = useContext(SecretsContext);

  const onSubmit = async () => {
    if (!secret.trim()) {
      alert("Escribe algo antes de publicar");
      return;
    }

    setLoading(true);
    try {
      const data = {
        text: secret,
        createdAt: serverTimestamp(),
      };

      if (selfDestruct) {
        data.expiry = Timestamp.fromDate(
          new Date(Date.now() + 24 * 60 * 60 * 1000)
        );
      }

      const docRef = await addDoc(collection(db, "secrets"), data);

      // Actualizamos context para que Home lo vea sin recargar
      setSecrets([{ id: docRef.id, ...data }, ...secrets]);

      setSecret("");
      setSelfDestruct(false);
      alert("Secreto publicado!");
    } catch (error) {
      console.error("Error al guardar secreto:", error.message);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.title}>Escribe tu secreto</Text>
        <TextInput
          style={styles.input}
          placeholder="Escribe aquí..."
          value={secret}
          onChangeText={setSecret}
          multiline
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: hp(3),
          }}
        >
          <Switch
            value={selfDestruct}
            onValueChange={setSelfDestruct}
            trackColor={{ false: "#ccc", true: "#4CAF50" }}
            thumbColor={selfDestruct ? "#fff" : "#fff"}
          />
          <Text
            style={{
              marginLeft: wp(2),
              fontSize: hp(2),
              color: theme.Colors.text,
            }}
          >
            Autodestruir en 24 horas
          </Text>
        </View>

        <Buttom title="Publicar" loading={loading} onPress={onSubmit} />
      </View>

      <FooterNav />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(5),
  },
  title: {
    fontSize: hp(3),
    fontWeight: theme.font.bold,
    color: theme.Colors.text,
    marginBottom: hp(2),
  },
  input: {
    height: hp(20),
    borderWidth: 1,
    borderColor: theme.Colors.gray,
    borderRadius: 12,
    padding: wp(3),
    marginBottom: hp(3),
    textAlignVertical: "top",
    fontSize: hp(2),
    color: theme.Colors.text,
  },
});
