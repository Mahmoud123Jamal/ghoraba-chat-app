import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

interface SendMessageProps {
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
}

export const sendMessage = async ({
  chatId,
  senderId,
  receiverId,
  text,
}: SendMessageProps) => {
  const time = Timestamp.now();

  const message = {
    sender: senderId,
    text,
    time,
    isSeen: senderId === receiverId,
  };

  const chatRef = doc(db, "chats", chatId);

  try {
    // Create chat document if it doesn't exist
    const chatDoc = await getDoc(chatRef);
    if (!chatDoc.exists()) {
      await setDoc(chatRef, { chats: [message] });
    } else {
      await updateDoc(chatRef, {
        chats: arrayUnion(message),
      });
    }

    // Fetch user info for both users
    const [senderDoc, receiverDoc] = await Promise.all([
      getDoc(doc(db, "users", senderId)),
      getDoc(doc(db, "users", receiverId)),
    ]);

    // Default fallback for user info if missing
    const senderInfo = senderDoc.exists()
      ? { uid: senderId, ...senderDoc.data() }
      : { uid: senderId, username: "User", avatar: "" };

    const receiverInfo = receiverDoc.exists()
      ? { uid: receiverId, ...receiverDoc.data() }
      : { uid: receiverId, username: "User", avatar: "" };

    // Unified update for userchats
    const updateUserChats = async (userId: string, otherUserInfo: any, isReceiver: boolean) => {
      const userChatsRef = doc(db, "userchats", userId);
      const userChatsDoc = await getDoc(userChatsRef);

      const newUnreadCount = isReceiver ? 1 : 0;

      const chatData = {
        receiverId: otherUserInfo.uid,
        lastMessage: text,
        updatedAt: serverTimestamp(),
        unreadCount: newUnreadCount,
        userInfo: {
          uid: otherUserInfo.uid,
          username: otherUserInfo.username || "User",
          avatar: otherUserInfo.avatar || "",
        },
      };

      if (userChatsDoc.exists()) {
        const currentData = userChatsDoc.data();
        const existingChat = currentData[chatId] || {};

        await updateDoc(userChatsRef, {
          [`${chatId}`]: {
            ...existingChat,
            ...chatData,
            unreadCount: (existingChat.unreadCount || 0) + newUnreadCount,
          },
        });
      } else {
        await setDoc(userChatsRef, {
          [chatId]: chatData,
        });
      }
    };

    // Update sender and receiver chat overviews
    await Promise.all([
      updateUserChats(senderId, receiverInfo, false),
      updateUserChats(receiverId, senderInfo, true),
    ]);
  } catch (err) {
    console.error("Error sending message:", err);
    throw err;
  }
};
