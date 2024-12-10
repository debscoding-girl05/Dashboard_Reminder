import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useClientStore } from '../store/clientStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Subscription } from '../types';
import { format } from 'date-fns';

const subscriptionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.string().transform((val) => Number(val)),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  clientId: z.string().min(1, 'Client is required'),
});

type SubscriptionForm = z.infer<typeof subscriptionSchema>;

export const Subscriptions = () => {
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription } =
    useSubscriptionStore();
  const { clients } = useClientStore();
  const [isEditing, setIsEditing] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriptionForm>({
    resolver: zodResolver(subscriptionSchema),
  });

  const onSubmit = (data: SubscriptionForm) => {
    if (isEditing) {
      updateSubscription(isEditing, data);
      setIsEditing(null);
    } else {
      addSubscription(data);
    }
    reset();
    setShowForm(false);
  };

  const getClientName = (clientId: string) => {
    return clients.find((c) => c.id === clientId)?.name || 'Unknown Client';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Subscription
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
                placeholder="Subscription name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                {...register('price')}
                type="number"
                step="0.01"
                className="w-full p-2 border rounded"
                placeholder="Price"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                {...register('startDate')}
                type="date"
                className="w-full p-2 border rounded"
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                {...register('endDate')}
                type="date"
                className="w-full p-2 border rounded"
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Client</label>
              <select
                {...register('clientId')}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              {errors.clientId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.clientId.message}
                </p>
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
                {isEditing ? 'Update' : 'Add'} Subscription
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map((subscription: Subscription) => (
          <div
            key={subscription.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{subscription.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  ${subscription.price.toFixed(2)}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {format(new Date(subscription.startDate), 'PP')} -{' '}
                  {format(new Date(subscription.endDate), 'PP')}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Client: {getClientName(subscription.clientId)}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(subscription.id);
                    setShowForm(true);
                    reset(subscription);
                  }}
                  className="p-2 text-gray-600 hover:text-indigo-600 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteSubscription(subscription.id)}
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