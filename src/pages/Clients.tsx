import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useClientStore } from '../store/clientStore';
import { useBoutiqueStore } from '../store/boutiqueStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Client } from '../types';

const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  boutiqueId: z.string().min(1, 'Boutique is required'),
});

type ClientForm = z.infer<typeof clientSchema>;

export const Clients = () => {
  const { clients, addClient, updateClient, deleteClient } = useClientStore();
  const { boutiques } = useBoutiqueStore();
  const [isEditing, setIsEditing] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = (data: ClientForm) => {
    if (isEditing) {
      updateClient(isEditing, data);
      setIsEditing(null);
    } else {
      addClient(data);
    }
    reset();
    setShowForm(false);
  };

  const getBoutiqueName = (boutiqueId: string) => {
    return boutiques.find((b) => b.id === boutiqueId)?.name || 'Unknown Boutique';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Client
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
                placeholder="Client name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full p-2 border rounded"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                {...register('phone')}
                className="w-full p-2 border rounded"
                placeholder="Phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Boutique</label>
              <select
                {...register('boutiqueId')}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a boutique</option>
                {boutiques.map((boutique) => (
                  <option key={boutique.id} value={boutique.id}>
                    {boutique.name}
                  </option>
                ))}
              </select>
              {errors.boutiqueId && (
                <p className="text-red-500 text-sm mt-1">{errors.boutiqueId.message}</p>
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
                {isEditing ? 'Update' : 'Add'} Client
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client: Client) => (
          <div
            key={client.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{client.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  {client.email}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {client.phone}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Boutique: {getBoutiqueName(client.boutiqueId)}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(client.id);
                    setShowForm(true);
                    reset(client);
                  }}
                  className="p-2 text-gray-600 hover:text-indigo-600 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteClient(client.id)}
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