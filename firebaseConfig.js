// Importa las funciones del SDK que necesitas.
// Para autenticación, solo necesitas 'getAuth'.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // También lo necesitas para la base de datos

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBp3bdFt0N0UqbrkT1ypvjXAo51dBh_vc0",
  authDomain: "secreto-29fd5.firebaseapp.com",
  databaseURL: "https://secreto-29fd5-default-rtdb.firebaseio.com",
  projectId: "secreto-29fd5",
  storageBucket: "secreto-29fd5.firebasestorage.app",
  messagingSenderId: "675974327152",
  appId: "1:675974327152:web:97acb9a9f6e48bc1627db5",
  measurementId: "G-9Y99013XHM"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firebase Authentication y Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Exporta los servicios para usarlos en cualquier lugar de tu app
export { auth, db };