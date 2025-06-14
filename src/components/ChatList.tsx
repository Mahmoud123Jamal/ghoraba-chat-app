//production update
import "../styles/components/ChatList.css";
import searchIcon from "../assets/search.png";
import plusIcon from "../assets/plus.png";
import minusIcon from "../assets/minus.png";
import defaultAvatar from "../assets/avatar.png";

import { useState, useEffect } from "react";
import AddUser from "./AddUser";
import { useUserStore } from "../lib/userStore";
import { useChatStore } from "../lib/chatStore";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Chat, ChatListProps } from "../types";

export default function ChatList({ onChatSelect }: ChatListProps) {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    const uid = currentUser?.id;
    if (!uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsub = onSnapshot(doc(db, "userchats", uid), async (docSnap) => {
      try {
        const data = docSnap.data();
        if (!data) {
          setChats([]);
          setLoading(false);
          return;
        }

        const chatMap = new Map<string, Chat>();
        const userInfoCache = new Map<string, any>();

        const allUserIds = new Set<string>();
        Object.values(data).forEach((chatInfo: any) => {
          const userId = chatInfo.receiverId || chatInfo.userInfo?.uid;
          if (userId) allUserIds.add(userId);
        });

        const userResults = await Promise.all(
          Array.from(allUserIds).map(async (userId) => {
            const userDoc = await getDoc(doc(db, "users", userId));
            return [userId, userDoc.exists() ? userDoc.data() : null];
          })
        );

        userResults.forEach(([userId, userData]) => {
          if (userData) userInfoCache.set(userId as string, userData);
        });

        Object.entries(data).forEach(([chatId, chatInfo]: [string, any]) => {
          const receiverId = chatInfo.receiverId || chatInfo.userInfo?.uid;
          if (!receiverId) return;

          const userInfo = userInfoCache.get(receiverId);
          const chatEntry: Chat = {
            chatId,
            username:
              userInfo?.username || userInfo?.displayName || "Unknown",
            avatar:
              userInfo?.avatar || userInfo?.photoURL || defaultAvatar,
            lastMessage: chatInfo.lastMessage || "",
            updatedAt: chatInfo.updatedAt || null,
            unreadCount: chatInfo.unreadCount ?? 0,
            receiverId,
          };

          const existing = chatMap.get(receiverId);
          if (
            !existing ||
            (chatEntry.updatedAt?.toMillis?.() || 0) >
              (existing.updatedAt?.toMillis?.() || 0)
          ) {
            chatMap.set(receiverId, chatEntry);
          }
        });

        const sortedChats = Array.from(chatMap.values()).sort((a, b) => {
          const aTime = a.updatedAt?.toMillis?.() || 0;
          const bTime = b.updatedAt?.toMillis?.() || 0;
          return bTime - aTime;
        });

        setChats(sortedChats);
      } catch (err) {
        console.error("Error loading chats:", err);
        setChats([]);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, [currentUser?.id]);

  const handleSelectChat = (chat: Chat) => {
    if (!chat.receiverId) return;

    const user = {
      uid: chat.receiverId,
      username: chat.username,
      avatar: chat.avatar,
      blocked: [],
    };

    changeChat(user);
    if (onChatSelect && window.innerWidth < 768) onChatSelect();
  };

  const filteredChats = chats.filter((chat) =>
    chat.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chat-list-container">
      <div className="chat-list-header p-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 text-light">Messages</h5>
        <button
          className="btn btn-sm btn-icon"
          onClick={() => setAddMode(!addMode)}
          title="Add or remove user"
        >
          <img
            src={addMode ? minusIcon : plusIcon}
            alt={addMode ? "Remove" : "Add"}
            width={20}
            height={20}
          />
        </button>
      </div>

      <div className="mt-3 p-3">
        <div className="position-relative flex-grow-1">
          <img
            src={searchIcon}
            alt="Search icon"
            width={16}
            height={16}
            className="position-absolute top-50 start-0 translate-middle-y ms-2"
          />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control form-control-sm ps-5 rounded-pill bg-transparent text-light"
          />
        </div>
      </div>

      <div className="chats-list">
        {loading ? (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center py-4 text-light">
            <p>No chats found</p>
            <small className="text-light">Start a new conversation</small>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              className={`chat-item ${
                chat.unreadCount && chat.unreadCount > 0 ? "unread" : ""
              }`}
              key={chat.chatId}
              onClick={() => handleSelectChat(chat)}
            >
              <img
  src={chat.avatar && chat.avatar.startsWith("http") ? chat.avatar : defaultAvatar}
  alt="avatar"
  className="chat-avatar"
/>
              <div className="chat-info">
                <div className="d-flex justify-content-between">
                  <h6 className="chat-name">{chat.username}</h6>
                  <small className="chat-time">
                    {chat.updatedAt?.toDate?.().toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }) || ""}
                  </small>
                </div>
                <p className="chat-preview text-truncate mb-0">
                  {chat.lastMessage?.trim() || "No messages yet"}
                </p>
                {chat.unreadCount && chat.unreadCount > 0 && (
                  <span className="unread-badge">{chat.unreadCount}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {addMode && <AddUser onClose={() => setAddMode(false)} />}
    </div>
  );
}
