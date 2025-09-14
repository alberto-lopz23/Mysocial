// import React, { useEffect, useRef, useState, useMemo } from "react";
// import { View, Text, Pressable, StyleSheet } from "react-native";
// import { Camera } from "expo-camera";
// import * as Location from "expo-location";
// import { fetchActiveSecrets, markAsRead } from "../services/secrets";
// import { withinRadius } from "../utils/geo";
// import { getProfile, addPoints, canSeeSecret } from "../services/points.js";
// import { auth } from "../firebaseConfig.js";

// export default function ARHuntScreen() {
//   const camRef = useRef(null);
//   const [hasCam, setHasCam] = useState(false);
//   const [pos, setPos] = useState(null);
//   const [secrets, setSecrets] = useState([]);
//   const [target, setTarget] = useState(null);
//   const [profile, setProfile] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasCam(status === "granted");

//       const loc = await Location.requestForegroundPermissionsAsync();
//       if (loc.status === "granted") {
//         const cur = await Location.getCurrentPositionAsync({});
//         setPos({ lat: cur.coords.latitude, lng: cur.coords.longitude });
//       }

//       const uid = auth.currentUser?.uid || "demo-user";
//       const p = await getProfile(uid);
//       setProfile(p);

//       const s = await fetchActiveSecrets();
//       setSecrets(s);
//     })();
//   }, []);

//   const nearby = useMemo(() => {
//     if (!pos || !profile) return [];
//     return secrets.filter((s) => {
//       if (!canSeeSecret(s.requiredPoints, profile.points)) return false;
//       return withinRadius(pos, s, s.radius);
//     });
//   }, [pos, secrets, profile]);

//   useEffect(() => {
//     setTarget(nearby[0] || null);
//   }, [nearby]);

//   const onMarkRead = async () => {
//     if (!target || !profile) return;
//     const uid = auth.currentUser?.uid || "demo-user";
//     await markAsRead(target.id, uid);
//     await addPoints(uid, 10);
//     setSecrets((prev) => prev.filter((s) => s.id !== target.id));
//   };

//   if (!hasCam)
//     return (
//       <View style={styles.center}>
//         <Text>Permite la cámara para cazar secretos.</Text>
//       </View>
//     );

//   if (!target)
//     return (
//       <View style={{ flex: 1 }}>
//         <Camera ref={camRef} style={{ flex: 1 }} />
//         <View style={styles.banner}>
//           <Text style={styles.bannerText}>
//             Busca… no hay secreto en tu radio ahora mismo.
//           </Text>
//         </View>
//       </View>
//     );

//   return (
//     <View style={{ flex: 1 }}>
//       <Camera ref={camRef} style={{ flex: 1 }} />
//       <View style={styles.overlay}>
//         <View style={styles.orb} />
//         <Text style={styles.title}>Secreto cerca</Text>
//         <Text style={styles.meta}>
//           {target.content.type === "text" ? target.content.value : "Contenido"}
//         </Text>
//         {target.requiredPoints ? (
//           <Text style={styles.meta}>Requiere {target.requiredPoints} pts</Text>
//         ) : null}

//         <Pressable style={styles.btn} onPress={onMarkRead}>
//           <Text style={styles.btnTxt}>Lo leí</Text>
//         </Pressable>

//         <Text style={styles.tip}>
//           Al salir del radio sin leer, este secreto se pierde.
//         </Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   center: { flex: 1, alignItems: "center", justifyContent: "center" },
//   overlay: {
//     position: "absolute",
//     bottom: 24,
//     left: 16,
//     right: 16,
//     backgroundColor: "rgba(0,0,0,0.55)",
//     padding: 16,
//     borderRadius: 16,
//   },
//   title: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 8 },
//   meta: { color: "#eee", marginBottom: 6 },
//   btn: {
//     backgroundColor: "#fff",
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: "center",
//     marginTop: 8,
//   },
//   btnTxt: { fontWeight: "700" },
//   tip: { color: "#ddd", fontSize: 12, marginTop: 8, textAlign: "center" },
//   banner: {
//     position: "absolute",
//     bottom: 24,
//     left: 16,
//     right: 16,
//     backgroundColor: "rgba(0,0,0,0.55)",
//     borderRadius: 12,
//     padding: 12,
//   },
//   bannerText: { color: "#fff", textAlign: "center" },
//   orb: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#fff",
//     opacity: 0.9,
//     alignSelf: "center",
//     marginBottom: 8,
//   },
// });
