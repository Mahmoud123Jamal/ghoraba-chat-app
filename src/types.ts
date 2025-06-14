// User types
export interface UserData {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  blocked?: string[];
}

export interface UserStore {
  currentUser: UserData | null;
  isLoading: boolean;
  fetchUserInfo: (uid: string | null) => Promise<void>;
}

// Chat types
export type ChatUser = {
  uid: string;
  username: string;
  avatar?: string;
  blocked: string[];
};

export interface chatStore {
  chatId: string | null;
  user: ChatUser | null;
  isCurrentUserBlocked: boolean;
  isReciverBlocked: boolean;
  changeChat: (user: ChatUser | null) => void;
  changeBlocked: () => void;
}

export interface chatData {
  chatId: string;
  user: ChatUser;
  lastMessage?: string;
  timestamp?: number;
}

export interface Chat {
  chatId: string;
  username: string;
  avatar: string;
  lastMessage: string;
  updatedAt: any;
  unreadCount: number;
  receiverId: string;
}


export interface ChatListProps {
  onChatSelect?: () => void;
}

export interface SelectedUserType {
  uid: string;
  avatar?: string;
  username?: string;
}

export interface ListProps {
  onChatSelect?: () => void;
}
