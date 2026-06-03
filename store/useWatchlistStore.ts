import { create } from 'zustand';
import { 
  getWatchlist, 
  addWatchlistCoin as serverAddCoin, 
  removeWatchlistCoin as serverRemoveCoin,
  createAlert as serverAddAlert,
  removeAlert as serverRemoveAlert
} from '@/app/actions/watchlist.actions';

interface Alert {
  _id?: string;
  id?: string;
  targetPrice: number;
  type: 'above' | 'below';
  createdAt?: string;
}

interface WatchlistItem {
  coinId: string;
  priceAtAdd: number;
  addedAt: string;
  alerts: Alert[];
}

interface WatchlistState {
  watchlist: WatchlistItem[];
  isLoaded: boolean;
  
  fetchWatchlist: () => Promise<void>;
  addCoin: (coinId: string, priceAtAdd: number) => Promise<void>;
  removeCoin: (coinId: string) => Promise<void>;
  addAlert: (coinId: string, alert: Alert) => Promise<void>;
  removeAlert: (coinId: string, alertIndex: number) => Promise<void>;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  watchlist: [],
  isLoaded: false,

  fetchWatchlist: async () => {
    try {
      const data = await getWatchlist();
      set({ watchlist: data, isLoaded: true });
    } catch (error) {
      console.error('Failed to fetch watchlist', error);
      set({ isLoaded: true }); // Prevent indefinite loading
    }
  },

  addCoin: async (coinId, priceAtAdd) => {
    // Optimistic UI Update placeholder if wanted, but server action confirms structure
    try {
      const newEntry = await serverAddCoin(coinId, priceAtAdd);
      set((state) => ({
        watchlist: [newEntry, ...state.watchlist.filter(w => w.coinId !== coinId)]
      }));
    } catch (error) {
      console.error(error);
    }
  },

  removeCoin: async (coinId) => {
    // Optimistic update
    set((state) => ({
      watchlist: state.watchlist.filter(w => w.coinId !== coinId)
    }));
    try {
      await serverRemoveCoin(coinId);
    } catch (error) {
      console.error(error);
      // Revert would happen here on fail
    }
  },

  addAlert: async (coinId, alert) => {
    try {
      const updatedEntry = await serverAddAlert(coinId, alert);
      set((state) => ({
        watchlist: state.watchlist.map(w => w.coinId === coinId ? updatedEntry : w)
      }));
    } catch (error) {
      console.error(error);
    }
  },

  removeAlert: async (coinId, alertIndex) => {
    try {
      const updatedEntry = await serverRemoveAlert(coinId, alertIndex);
      set((state) => ({
        watchlist: state.watchlist.map(w => w.coinId === coinId ? updatedEntry : w)
      }));
    } catch (error) {
      console.error(error);
    }
  }
}));
