import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Boutique } from '../types';

interface BoutiqueState {
  boutiques: Boutique[];
  addBoutique: (boutique: Omit<Boutique, 'id'>) => void;
  updateBoutique: (id: string, boutique: Partial<Boutique>) => void;
  deleteBoutique: (id: string) => void;
}

export const useBoutiqueStore = create<BoutiqueState>()(
  persist(
    (set) => ({
      boutiques: [],
      addBoutique: (boutique) => {
        set((state) => ({
          boutiques: [...state.boutiques, { ...boutique, id: crypto.randomUUID() }],
        }));
      },
      updateBoutique: (id, boutique) => {
        set((state) => ({
          boutiques: state.boutiques.map((b) =>
            b.id === id ? { ...b, ...boutique } : b
          ),
        }));
      },
      deleteBoutique: (id) => {
        set((state) => ({
          boutiques: state.boutiques.filter((b) => b.id !== id),
        }));
      },
    }),
    {
      name: 'boutique-storage',
    }
  )
);