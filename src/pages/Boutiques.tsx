import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useBoutiqueStore } from '../store/boutiqueStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Boutique } from '../types';

const boutiqueSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  businessId: z.string().min(1, 'Business ID is required'),
});

type BoutiqueForm = z.infer<typeof boutiqueSchema>;

export const Boutiques = () => {
  const { boutiques, addBoutique, updateBoutique, deleteBoutique } = useBoutiqueStore();
  const [isEditing, setIsEditing] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BoutiqueForm>({
    resolver: zodResolver(boutiqueSchema),
  });

  const onSubmit = (data: BoutiqueForm) => {
    if (isEditing) {
      updateBoutique(isEditing, data);
      setIsEditing(null);
    } else {
      addBoutique(data);
    }
    reset();
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Boutiques</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Boutique
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                {...register('name')}
                className="w-full p-2 border rounded"
                placeholder="Boutique name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                {...register('address')}
                className="w-full p-2 border rounded"
                placeholder="Address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Business ID</label>
              <input
                {...register('businessId')}
                className="w-full p-2 border rounded"
                placeholder="Business ID"
              />
              {errors.businessId && (
                <p className="text-red-500 text-sm mt-1">{errors.businessId.message}</p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setIsEditing(null);
                  reset();
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {isEditing ? 'Update' : 'Add'} Boutique
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {boutiques.map((boutique: Boutique) => (
          <div
            key={boutique.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{boutique.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  {boutique.address}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  ID: {boutique.businessId}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(boutique.id);
                    setShowForm(true);
                    reset(boutique);
                  }}
                  className="p-2 text-gray-600 hover:text-indigo-600 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteBoutique(boutique.id)}
                  className="p-2 text-gray-600 hover:text-red-600 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};