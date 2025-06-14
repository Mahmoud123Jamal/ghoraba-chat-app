import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig: Record<string, string> = {
  apiKey: import.meta.env.VITE_API_KEY as string,
  authDomain: "Your_authDomain",
  projectId: "Your_projectId",
  storageBucket: "Your_storageBucket",
  messagingSenderId: "Your_messagingSenderId",
  appId: "Your_appId",
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const authService = getAuth();
export const storage = getStorage(app);
