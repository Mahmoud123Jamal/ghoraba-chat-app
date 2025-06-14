import { create } from "zustand";
import { useUserStore } from "./userStore";
import { chatStore, ChatUser } from "../types";

export const useChatStore = create<chatStore>((set) => ({
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReciverBlocked: false,

  changeChat: (targetUser: ChatUser | null) => {
    const currentUser = useUserStore.getState().currentUser;

    // Reset state if users are missing
    if (!currentUser || !targetUser) {
      set({
        chatId: null,
        user: null,
        isCurrentUserBlocked: false,
        isReciverBlocked: false,
      });
      return;
    }

    const currentUserBlockedByTarget = (targetUser.blocked ?? []).includes(currentUser.id);
    const currentUserBlockedTarget = (currentUser.blocked ?? []).includes(targetUser.uid);

    if (currentUserBlockedByTarget) {
      set({
        chatId: null,
        user: null,
        isCurrentUserBlocked: true,
        isReciverBlocked: false,
      });
      return;
    }

    if (currentUserBlockedTarget) {
      set({
        chatId: null,
        user: targetUser,
        isCurrentUserBlocked: false,
        isReciverBlocked: true,
      });
      return;
    }

    const combinedId =
      currentUser.id > targetUser.uid
        ? currentUser.id + targetUser.uid
        : targetUser.uid + currentUser.id;

    set({
      chatId: combinedId,
      user: targetUser,
      isCurrentUserBlocked: false,
      isReciverBlocked: false,
    });
  },

  changeBlocked: () => {
    set((state) => ({
      ...state,
      isReciverBlocked: !state.isReciverBlocked,
    }));
  },
}));
