import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Notification from "./components/Notification";
import { authService } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";

export default function App() {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authService, (user) => {
      fetchUserInfo(user?.uid ?? null);
    });

    return () => unsubscribe();
  }, [fetchUserInfo]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!currentUser ? <Login /> : <Navigate to="/" />}
        />
      </Routes>
      <Notification />
    </>
  );
}
