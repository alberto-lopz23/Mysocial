// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// Función que corre cada 24 horas
exports.deleteExpiredSecrets = functions.pubsub.schedule("every 24 hours").onRun(async (context) => {
  try {
    const now = admin.firestore.Timestamp.now();

    // 24 horas en milisegundos
    const oneDayAgo = admin.firestore.Timestamp.fromMillis(now.toMillis() - 24 * 60 * 60 * 1000);
    // 7 días en milisegundos
    const sevenDaysAgo = admin.firestore.Timestamp.fromMillis(now.toMillis() - 7 * 24 * 60 * 60 * 1000);

    // 1️⃣ Secretos con toggle 24h activo y creados hace más de 24h
    const snap24h = await db.collection("secrets")
      .where("toggle24h", "==", true)
      .where("createdAt", "<", oneDayAgo)
      .get();

    // 2️⃣ Secretos con más de 7 días
    const snap7d = await db.collection("secrets")
      .where("createdAt", "<", sevenDaysAgo)
      .get();

    const batch = db.batch();

    snap24h.docs.forEach(doc => batch.delete(doc.ref));
    snap7d.docs.forEach(doc => batch.delete(doc.ref));

    await batch.commit();

    console.log(`Se borraron ${snap24h.size + snap7d.size} secretos expirados`);
    return null;
  } catch (error) {
    console.error("Error borrando secretos expirados:", error);
  }
});
            