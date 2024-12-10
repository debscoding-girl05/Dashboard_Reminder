export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Boutique {
  id: string;
  name: string;
  address: string;
  businessId: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  boutiqueId: string;
}

export interface Subscription {
  id: string;
  name: string;
  price: number;
  startDate: string;
  endDate: string;
  clientId: string;
}

export interface Reminder {
  id: string;
  subscriptionId: string;
  interval: 'day' | 'week' | 'month';
  channels: ('sms' | 'email')[];
  message: string;
}