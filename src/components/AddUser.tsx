import "../styles/components/AddUser.css";
import avatar from "../assets/avatar.png";
import { useState } from "react";
import { useUserStore } from "../lib/userStore";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export default function AddUser({ onClose }: { onClose: () => void }) {
  const [users, setUsers] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const { currentUser } = useUserStore();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;

    if (!username) {
      setUsers([]);
      return;
    }

    try {
      setSearching(true);
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setUsers(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setUsers([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async (user: any) => {
    if (!currentUser) {
      alert("User not logged in.");
      return;
    }

    if (user.id === currentUser.id) {
      alert("You can't chat with yourself.");
      return;
    }

    try {
      const userChatsSnapshot = await getDoc(
        doc(db, "userchats", currentUser.id)
      );
      const userChatsData = userChatsSnapshot.exists()
        ? userChatsSnapshot.data()
        : {};

      const existingChatId = Object.keys(userChatsData || {}).find(
        (chatId) => {
          const chatInfo = userChatsData[chatId];
          return chatInfo.receiverId === user.id;
        }
      );

      if (existingChatId) {
        alert("Chat with this user already exists.");
        return;
      }

      const chatRef = collection(db, "chats");
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
        participants: [currentUser.id, user.id],
      });

      const chatId = newChatRef.id;

      const chatDataForCurrentUser = {
        chatId,
        receiverId: user.id,
        lastMessage: "",
        updatedAt: serverTimestamp(),
      };

      const chatDataForSelectedUser = {
        chatId,
        receiverId: currentUser.id,
        lastMessage: "",
        updatedAt: serverTimestamp(),
      };

      await setDoc(
        doc(db, "userchats", currentUser.id),
        {
          [chatId]: chatDataForCurrentUser,
        },
        { merge: true }
      );

      await setDoc(
        doc(db, "userchats", user.id),
        {
          [chatId]: chatDataForSelectedUser,
        },
        { merge: true }
      );

      onClose();
      setUsers([]);
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Failed to create chat.");
    }
  };

  return (
    <div className="addUser-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add New User</h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="input-group">
              <input
                type="text"
                name="username"
                placeholder="Search username..."
                className="form-control form-control-sm mt-3"
                autoFocus
              />
              <button
                className="btn btn-sm btn-primary mt-2"
                type="submit"
                disabled={searching}
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </div>
          </form>

          {users.length === 0 && !searching && (
            <div className="text-center py-3">
              <p className="text-light">No users found</p>
              <small className="text-light">Enter a username to search</small>
            </div>
          )}

          {searching && (
            <div className="d-flex justify-content-center py-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          <div className="search-results">
            {users.map((user) => (
              <div
                className="user-card d-flex align-items-center justify-content-between p-2"
                key={user.id}
              >
                <div className="d-flex align-items-center">
                  <img
                    src={user.avatar || avatar}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-circle me-2"
                  />
                  <div>
                    <div className="fw-bold">{user.username || "Unknown"}</div>
                    <small className="text-muted">{user.email || ""}</small>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-primary rounded-pill px-3"
                  onClick={() => handleAdd(user)}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
