import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subscription } from '../types';

interface SubscriptionState {
  subscriptions: Subscription[];
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: string, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  getSubscriptionsByClient: (clientId: string) => Subscription[];
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      subscriptions: [],
      addSubscription: (subscription) => {
        set((state) => ({
          subscriptions: [...state.subscriptions, { ...subscription, id: crypto.randomUUID() }],
        }));
      },
      updateSubscription: (id, subscription) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, ...subscription } : s
          ),
        }));
      },
      deleteSubscription: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.id !== id),
        }));
      },
      getSubscriptionsByClient: (clientId) => {
        return get().subscriptions.filter((sub) => sub.clientId === clientId);
      },
    }),
    {
      name: 'subscription-storage',
    }
  )
);