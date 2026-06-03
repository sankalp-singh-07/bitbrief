import { create } from 'zustand';
import { getNotifications, markAsRead, markAllAsRead } from '@/app/actions/notification.actions';

interface NotificationState {
  notifications: any[];
  isLoaded: boolean;
  
  fetchNotifications: () => Promise<void>;
  readNotification: (id: string) => Promise<void>;
  readAll: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  isLoaded: false,

  fetchNotifications: async () => {
    try {
      const data = await getNotifications();
      set({ notifications: data, isLoaded: true });
    } catch (error) {
      console.error('Failed to fetch notifications', error);
      set({ isLoaded: true });
    }
  },

  readNotification: async (id) => {
    // Optimistic cache
    set((state) => ({
      notifications: state.notifications.map(n => n._id === id ? { ...n, isRead: true } : n)
    }));
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification read', error);
    }
  },

  readAll: async () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true }))
    }));
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to read all notifications', error);
    }
  }
}));
