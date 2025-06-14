import { useEffect, useState } from "react";
import List from "../components/List";
import Chat from "../components/Chat";
import { useChatStore } from "../lib/chatStore";
import chat from "../assets/chat.png";

export default function Home() {
  const { chatId } = useChatStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setShowChat(true);
    };

    window.addEventListener("resize", updateLayout);
    updateLayout();

    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  useEffect(() => {
    if (chatId) setShowChat(true);
  }, [chatId]);

  return (
    <div className="home-container d-flex h-100">
      {(!isMobile || !showChat) && (
        <div className="sidebar border-end">
          <List onChatSelect={() => setShowChat(true)} />
        </div>
      )}

      {(!isMobile || showChat) && (
        <div className="main-chat flex-grow-1">
          {chatId ? (
            <Chat onBack={() => setShowChat(false)} />
          ) : (
            <div className="welcome-screen d-flex flex-column align-items-center justify-content-center text-center h-100 p-4">
              <img
                src={chat}
                alt="Chat"
                width={100}
                height={100}
                className="mb-3"
              />
              <h3>Welcome to ChatApp</h3>
              <p className="text-muted">
                Select a chat to start messaging or create a new conversation.
              </p>
            </div>
          )}
        </div>
      )}

      {!isMobile && chatId && (
        <div className="details-panel border-start">
          {/* Placeholder for future components */}
        </div>
      )}
    </div>
  );
}
