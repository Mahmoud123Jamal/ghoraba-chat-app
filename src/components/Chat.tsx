//production update
import "../styles/components/Chat.css";
import { useState, useRef, useEffect } from "react";
import avatar from "../assets/avatar.png";
import phone from "../assets/phone.png";
import camera from "../assets/camera.png";
import info from "../assets/info.png";
import image from "../assets/img.png";
import mic from "../assets/mic.png";
import emoji from "../assets/emoji.png";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { db } from "../lib/firebase";
import {
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useChatStore } from "../lib/chatStore";
import { useUserStore } from "../lib/userStore";
import { sendMessage } from "../lib/sendMessage";
import { SelectedUserType } from "../types";

type MessageType = {
  sender: string;
  text: string;
  time?: { seconds: number };
  isSeen?: boolean;
};

export default function Chat({ onBack }: { onBack?: () => void }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<MessageType[]>([]);
  const { user: selectedUser } = useChatStore() as { user: SelectedUserType | null };
  const { currentUser } = useUserStore();
  const endRef = useRef<HTMLDivElement>(null);

  const chatId =
    currentUser && selectedUser
      ? [currentUser.id, selectedUser.uid].sort().join("_")
      : null;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleEmoji = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  const handleSend = async () => {
    if (!input.trim() || !currentUser?.id || !selectedUser?.uid || !chatId) return;

    try {
      await sendMessage({
        chatId,
        senderId: currentUser.id,
        receiverId: selectedUser.uid,
        text: input,
      });

      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Mark messages as seen
  useEffect(() => {
    if (!chatId || !currentUser || !selectedUser) return;

    const markAsSeen = async () => {
      const chatRef = doc(db, "chats", chatId);
      const userChatsRef = doc(db, "userchats", currentUser.id);

      try {
        let chatDoc = await getDoc(chatRef);
        if (!chatDoc.exists()) {
          await setDoc(chatRef, { chats: [] });
          chatDoc = await getDoc(chatRef);
        }

        const messages = chatDoc.data()?.chats || [];
        let updated = false;

        const updatedMessages = messages.map((msg: MessageType) => {
          if (msg.sender === selectedUser.uid && msg.isSeen === false) {
            updated = true;
            return { ...msg, isSeen: true };
          }
          return msg;
        });

        if (updated) {
          await Promise.all([
            updateDoc(chatRef, { chats: updatedMessages }),
            updateDoc(userChatsRef, {
              [`${chatId}.unreadCount`]: 0,
            }).catch(() => {}),
          ]);
        }
      } catch (error) {
        console.error("Error marking messages as seen:", error);
      }
    };

    markAsSeen();
  }, [chatId, currentUser, selectedUser]);

  // Listen for new messages
  useEffect(() => {
    if (!chatId) {
      setChat([]);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "chats", chatId),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setChat(Array.isArray(data?.chats) ? data.chats : []);
        } else {
          setChat([]);
        }
      },
      (error) => {
        console.error("Error fetching chat:", error);
        setChat([]);
      }
    );

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  return (
    <div className="chat-container d-flex flex-column overflow-auto">
      {/* Header */}
      <div className="chat-header d-flex justify-content-between align-items-center p-3">
        <div className="d-flex align-items-center">
          {onBack && (
            <button
              className="btn text-bold btn-outline-light d-md-none me-2 border-0 fs-1"
              onClick={onBack}
            >
              &larr;
            </button>
          )}
          <img
  src={
    selectedUser?.avatar && selectedUser.avatar.startsWith("http")
      ? selectedUser.avatar
      : avatar
  }
  alt="avatar"
  className="chat-avatar rounded-circle me-3"
/>
          <div>
            <h5 className="mb-0 fw-bold text-light">
              {selectedUser?.username || "User"}
            </h5>
            <small className="text-success">Online</small>
          </div>
        </div>
        <div className="chat-actions d-flex gap-2">
          <button className="btn btn-sm btn-icon">
            <img src={phone} alt="Call" width={20} height={20} />
          </button>
          <button className="btn btn-sm btn-icon">
            <img src={camera} alt="Video" width={20} height={20} />
          </button>
          <button className="btn btn-sm btn-icon">
            <img src={info} alt="Info" width={20} height={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container flex-grow-1 overflow-auto p-3">
        {chat.length === 0 ? (
          <div className="d-flex flex-column align-items-center justify-content-center h-100">
            <div className=" 
            bg-dark text-light
            rounded-circle p-3 mb-3">
              <img 
                src={
                  selectedUser?.avatar && selectedUser.avatar.startsWith("http")
                    ? selectedUser.avatar
                    : avatar
                }
              alt="Chat" width={60} height={60} />
            </div>
            <h5 className="text-light">Start a conversation</h5>
            <p className="text-light text-center">
              Send your first message to begin chatting
            </p>
          </div>
        ) : (
          chat.map((msg, i) => (
            <div
              key={i}
              className={`d-flex mb-3 ${
                msg.sender === currentUser?.id
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              {msg.sender !== currentUser?.id && (
                <img
                  src={
                    selectedUser?.avatar && selectedUser.avatar.startsWith("http")
                     ? selectedUser.avatar
                      : avatar
                  }
                  alt="avatar"
                  className="message-avatar rounded-circle me-2"
                />
              )}
              <div
                className={`message-bubble px-3 py-2 ${
                  msg.sender === currentUser?.id
                    ? "bg-primary text-white"
                    : "bg-light text-dark"
                }`}
              >
                <div className="message-text">{msg.text}</div>
                <div className="message-time text-end mt-1 small">
                  {msg.time?.seconds
                    ? new Date(msg.time.seconds * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Now"}
                  {msg.sender === currentUser?.id && (
                    <span className="ms-2">{msg.isSeen ? "✓✓" : "✓"}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={endRef}></div>
      </div>

      {/* Input */}
      <div className="input-area p-3">
        <div className="input-group">
          <div className="input-actions">
            <button className="btn btn-sm btn-icon">
              <img src={image} alt="Image" width={20} height={20} />
            </button>
            <button className="btn btn-sm btn-icon">
              <img src={camera} alt="Camera" width={20} height={20} />
            </button>
            <button className="btn btn-sm btn-icon">
              <img src={mic} alt="Mic" width={20} height={20} />
            </button>
          </div>

          <div className="emoji-container position-relative flex-grow-1">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={input}
              onChange={handleInput}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="btn btn-sm btn-icon position-absolute end-0 top-50 translate-middle-y"
              onClick={() => setOpen(!open)}
            >
              <img src={emoji} alt="Emoji" width={20} height={20} />
            </button>
            {open && (
              <div className="emoji-picker">
                <EmojiPicker onEmojiClick={handleEmoji} />
              </div>
            )}
          </div>

          <button
            className="btn btn-primary rounded-pill px-4 mx-auto"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
