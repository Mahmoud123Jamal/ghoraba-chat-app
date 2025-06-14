import { create } from 'zustand';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { UserData, UserStore } from '../types';

export const useUserStore = create<UserStore>((set) => ({
  currentUser: null,
  isLoading: true,

  fetchUserInfo: async (uid) => {
    set({ isLoading: true }); 

    if (!uid) {
      return set({ currentUser: null, isLoading: false });
    }

    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        set({
          currentUser: {
            id: uid, 
            username: userData.username,
            email: userData.email,
            avatar: userData.avatar,
            blocked: userData.blocked || [],
          },
          isLoading: false,
        });
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.error("Failed to fetch user info:", err);
      set({ currentUser: null, isLoading: false });
    }
  },
}));
