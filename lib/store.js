import { create } from 'zustand';

// Auth Store with localStorage persistence
const getStoredAuth = () => {
  if (typeof window === 'undefined') return { user: null, token: null };
  try {
    const stored = localStorage.getItem('auth-storage');
    return stored ? JSON.parse(stored) : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
};

const setStoredAuth = (user, token) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('auth-storage', JSON.stringify({ user, token }));
  } catch (error) {
    console.error('Failed to save auth to localStorage:', error);
  }
};

const clearStoredAuth = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('auth-storage');
  } catch (error) {
    console.error('Failed to clear auth from localStorage:', error);
  }
};

export const useAuthStore = create((set) => ({
  ...getStoredAuth(),
  setAuth: (user, token) => {
    setStoredAuth(user, token);
    set({ user, token });
  },
  logout: () => {
    clearStoredAuth();
    set({ user: null, token: null });
  },
}));

export const useChatStore = create((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setMessages: (messages) => set({ messages }),
  clearMessages: () => set({ messages: [] }),
}));

export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => {
    const existingItem = state.items.find((i) => i.id === item.id);
    if (existingItem) {
      return {
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    const state = useCartStore.getState();
    return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));
