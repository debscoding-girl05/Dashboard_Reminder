import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Client } from '../types';

interface ClientState {
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientsByBoutique: (boutiqueId: string) => Client[];
}

export const useClientStore = create<ClientState>()(
  persist(
    (set, get) => ({
      clients: [],
      addClient: (client) => {
        set((state) => ({
          clients: [...state.clients, { ...client, id: crypto.randomUUID() }],
        }));
      },
      updateClient: (id, client) => {
        set((state) => ({
          clients: state.clients.map((c) =>
            c.id === id ? { ...c, ...client } : c
          ),
        }));
      },
      deleteClient: (id) => {
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        }));
      },
      getClientsByBoutique: (boutiqueId) => {
        return get().clients.filter((client) => client.boutiqueId === boutiqueId);
      },
    }),
    {
      name: 'client-storage',
    }
  )
);