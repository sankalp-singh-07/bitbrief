import { create } from 'zustand';
import { syncUser, upgradeToPro } from '@/app/actions/user.actions';

interface UserState {
  plan: 'FREE' | 'PRO';
  name: string;
  email: string;
  isSynced: boolean;
  isLoading: boolean;
  
  initializeUser: () => Promise<void>;
  upgradePlan: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  plan: 'FREE',
  name: '',
  email: '',
  isSynced: false,
  isLoading: false,

  initializeUser: async () => {
    set({ isLoading: true });
    try {
      const dbUser = await syncUser();
      set({ 
        plan: dbUser.plan, 
        name: dbUser.name, 
        email: dbUser.email, 
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
      set({ plan: dbUser.plan, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  }
}));
