import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

// Trae todos los secretos activos
export async function fetchActiveSecrets() {
  try {
    const secretsRef = collection(db, "secrets");
    const q = query(secretsRef, where("active", "==", true));
    const snapshot = await getDocs(q);

    const secrets = [];
    snapshot.forEach((docSnap) => {
      secrets.push({ id: docSnap.id, ...docSnap.data() });
    });

    return secrets;
  } catch (error) {
    console.error("Error fetching secrets:", error);
    return [];
  }
}

// Marca un secreto como leído
export async function markAsRead(secretId, uid) {
  try {
    const secretRef = doc(db, "secrets", secretId);

    // Aquí decides: lo eliminas o lo marcas como leído
    await updateDoc(secretRef, {
      active: false,
      readBy: uid,
      readAt: new Date(),
    });

    // 👉 Si prefieres borrarlo totalmente:
    // await deleteDoc(secretRef);

    return true;
  } catch (error) {
    console.error("Error marking secret as read:", error);
    return false;
  }
}
