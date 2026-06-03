import { create } from 'zustand';
import { syncUser, upgradeToPro } from '@/app/actions/user.actions';

interface UserState {
  plan: 'FREE' | 'PRO';
  name: string;
  email: string;
  isSynced: boolean;
  isLoading: boolean;
  subscriptionStart?: string;
  subscriptionExpiry?: string;
  
  initializeUser: () => Promise<void>;
  upgradePlan: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  plan: 'FREE',
  name: '',
  email: '',
  isSynced: false,
  isLoading: false,
  subscriptionStart: undefined,
  subscriptionExpiry: undefined,

  initializeUser: async () => {
    if (get().isSynced) return;
    set({ isLoading: true });
    try {
      const dbUser = await syncUser();
      set({ 
        plan: dbUser.plan, 
        name: dbUser.name, 
        email: dbUser.email, 
        subscriptionStart: dbUser.subscriptionStart,
        subscriptionExpiry: dbUser.subscriptionExpiry,
        isSynced: true,
        isLoading: false 
      });
    } catch (error) {
      console.error('User initialization failed', error);
      set({ isLoading: false });
    }
  },

  upgradePlan: async () => {
    set({ isLoading: true });
    try {
      const dbUser = await upgradeToPro();
      set({ 
        plan: dbUser.plan, 
        subscriptionStart: dbUser.subscriptionStart,
        subscriptionExpiry: dbUser.subscriptionExpiry,
        isLoading: false 
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  }
}));
