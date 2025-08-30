// context/SecretsContext.js
import React, { createContext, useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export const SecretsContext = createContext();

export const SecretsProvider = ({ children }) => {
  const [secrets, setSecrets] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "secrets"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSecrets(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SecretsContext.Provider value={{ secrets, setSecrets }}>
      {children}
    </SecretsContext.Provider>
  );
};
