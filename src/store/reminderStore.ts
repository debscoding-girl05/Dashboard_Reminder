import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Reminder } from '../types';

interface ReminderState {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  getRemindersBySubscription: (subscriptionId: string) => Reminder[];
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set, get) => ({
      reminders: [],
      addReminder: (reminder) => {
        set((state) => ({
          reminders: [...state.reminders, { ...reminder, id: crypto.randomUUID() }],
        }));
      },
      updateReminder: (id, reminder) => {
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, ...reminder } : r
          ),
        }));
      },
      deleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        }));
      },
      getRemindersBySubscription: (subscriptionId) => {
        return get().reminders.filter((reminder) => reminder.subscriptionId === subscriptionId);
      },
    }),
    {
      name: 'reminder-storage',
    }
  )
);