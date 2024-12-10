import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useReminderStore } from '../store/reminderStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { useClientStore } from '../store/clientStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Reminder } from '../types';

const reminderSchema = z.object({
  subscriptionId: z.string().min(1, 'Subscription is required'),
  interval: z.enum(['day', 'week', 'month'], {
    required_error: 'Please select an interval',
  }),
  channels: z.array(z.enum(['sms', 'email'])).min(1, 'Select at least one channel'),
  message: z.string().min(1, 'Message is required'),
});

type ReminderForm = z.infer<typeof reminderSchema>;

export const Reminders = () => {
  const { reminders, addReminder, updateReminder, deleteReminder } =
    useReminderStore();
  const { subscriptions } = useSubscriptionStore();
  const { clients } = useClientStore();
  const [isEditing, setIsEditing] = React.useState<string | null>(null);
  const [showForm, setShowForm] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReminderForm>({
    resolver: zodResolver(reminderSchema),
  });

  const selectedChannels = watch('channels', []);

  const onSubmit = (data: ReminderForm) => {
    if (isEditing) {
      updateReminder(isEditing, data);
      setIsEditing(null);
    } else {
      addReminder(data);
    }
    reset();
    setShowForm(false);
  };

  const getSubscriptionName = (subscriptionId: string) => {
    const subscription = subscriptions.find((s) => s.id === subscriptionId);
    if (!subscription) return 'Unknown Subscription';
    const client = clients.find((c) => c.id === subscription.clientId);
    return `${subscription.name} (${client?.name || 'Unknown Client'})`;
  };

  const toggleChannel = (channel: 'sms' | 'email') => {
    const currentChannels = selectedChannels || [];
    const newChannels = currentChannels.includes(channel)
      ? currentChannels.filter((c) => c !== channel)
      : [...currentChannels, channel];
    setValue('channels', newChannels);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reminders</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reminder
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Subscription
              </label>
              <select
                {...register('subscriptionId')}
                className="w-full p-2 border rounded"
              >
                <option value="">Select a subscription</option>
                {subscriptions.map((subscription) => (
                  <option key={subscription.id} value={subscription.id}>
                    {getSubscriptionName(subscription.id)}
                  </option>
                ))}
              </select>
              {errors.subscriptionId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.subscriptionId.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Interval</label>
              <select
                {...register('interval')}
                className="w-full p-2 border rounded"
              >
                <option value="">Select an interval</option>
                <option value="day">1 Day Before</option>
                <option value="week">1 Week Before</option>
                <option value="month">1 Month Before</option>
              </select>
              {errors.interval && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.interval.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Communication Channels
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedChannels?.includes('email')}
                    onChange={() => toggleChannel('email')}
                    className="mr-2"
                  />
                  Email
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedChannels?.includes('sms')}
                    onChange={() => toggleChannel('sms')}
                    className="mr-2"
                  />
                  SMS
                </label>
              </div>
              {errors.channels && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.channels.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                {...register('message')}
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Reminder message"
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.message.message}
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
                {isEditing ? 'Update' : 'Add'} Reminder
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reminders.map((reminder: Reminder) => (
          <div
            key={reminder.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {getSubscriptionName(reminder.subscriptionId)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  Remind {reminder.interval} before expiration
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Channels: {reminder.channels.join(', ')}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  {reminder.message}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(reminder.id);
                    setShowForm(true);
                    reset(reminder);
                  }}
                  className="p-2 text-gray-600 hover:text-indigo-600 rounded"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteReminder(reminder.id)}
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