import { db } from "../firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";

// Trae el perfil del usuario o lo crea si no existe
export async function getProfile(uid) {
  try {
    const profileRef = doc(db, "profiles", uid);
    const snap = await getDoc(profileRef);

    if (!snap.exists()) {
      const newProfile = { points: 0, createdAt: new Date() };
      await setDoc(profileRef, newProfile);
      return newProfile;
    }

    return snap.data();
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { points: 0 };
  }
}

// Suma puntos al usuario
export async function addPoints(uid, n) {
  try {
    const profileRef = doc(db, "profiles", uid);
    await updateDoc(profileRef, {
      points: increment(n),
    });
  } catch (error) {
    console.error("Error adding points:", error);
  }
}

// Verifica si el usuario puede leer el secreto
export function canSeeSecret(requiredPoints = 0, currentPoints = 0) {
  return currentPoints >= requiredPoints;
}
