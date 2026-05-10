export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  subscription: 'free' | 'pro';
  stripeCustomerId?: string;
  createdAt: number;
}

export interface ApiKey {
  id: string;
  userId: string;
  key: string; // prefixed
  name: string;
  usageCount: number;
  createdAt: number;
}

export interface ComponentItem {
  id: string;
  name: string;
  description: string;
  category: string;
  isPro: boolean;
  code: string;
  previewImage?: string;
}

export interface WaitlistEntry {
  email: string;
  createdAt: number;
  status: 'pending' | 'converted';
}
