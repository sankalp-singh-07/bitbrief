import { create } from 'zustand';
import { getNewsletters, saveNewsletter, deleteNewsletter } from '@/app/actions/newsletter.actions';

interface NewsletterState {
  newsletters: any[];
  isLoaded: boolean;
  
  fetchNewsletters: () => Promise<void>;
  addNewsletter: (data: any) => Promise<any>;
  removeNewsletter: (id: string) => Promise<void>;
}

export const useNewsletterStore = create<NewsletterState>((set) => ({
  newsletters: [],
  isLoaded: false,

  fetchNewsletters: async () => {
    try {
      const data = await getNewsletters();
      set({ newsletters: data, isLoaded: true });
    } catch (error) {
      console.error('Failed to fetch newsletters', error);
      set({ isLoaded: true });
    }
  },

  addNewsletter: async (data) => {
    try {
      const newEntry = await saveNewsletter(data);
      set((state) => ({
        newsletters: [newEntry, ...state.newsletters]
      }));
      return newEntry;
    } catch (error) {
      console.error('Failed to add newsletter', error);
    }
  },

  removeNewsletter: async (id) => {
    try {
      await deleteNewsletter(id);
      set((state) => ({
        newsletters: state.newsletters.filter(n => n._id !== id)
      }));
    } catch (error) {
      console.error('Failed to remove newsletter', error);
    }
  }
}));
