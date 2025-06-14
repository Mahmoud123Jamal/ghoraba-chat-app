import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig: Record<string, string> = {
  apiKey: import.meta.env.VITE_API_KEY as string,
  authDomain: "react-chat-app-33d10.firebaseapp.com",
  projectId: "react-chat-app-33d10",
  storageBucket: "react-chat-app-33d10.firebasestorage.app",
  messagingSenderId: "951507233541",
  appId: "1:951507233541:web:cf8851332c38203a44256c",
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const authService = getAuth();
export const storage = getStorage(app);
