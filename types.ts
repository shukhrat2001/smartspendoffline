export interface Expense {
  id?: number;
  amount: number;
  categoryId: string;
  categoryName: string;
  date: Date; // Stored as Date object in Dexie
  note: string;
  receiptImage?: string; // Base64 string
  createdAt: Date;
  synced: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  isCustom: boolean;
}

export interface UserSettings {
  id?: number;
  isPremium: boolean;
  trialStartDate?: Date;
  currency: string;
  theme: 'light' | 'dark';
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ADD_EXPENSE = 'ADD_EXPENSE',
  HISTORY = 'HISTORY',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food', icon: 'Utensils', isCustom: false },
  { id: 'transport', name: 'Transport', icon: 'Car', isCustom: false },
  { id: 'bills', name: 'Bills', icon: 'Zap', isCustom: false },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', isCustom: false },
  { id: 'other', name: 'Other', icon: 'Circle', isCustom: false },
];

export const FREE_LIMITS = {
  MAX_CATEGORIES: 5,
  MAX_HISTORY_DAYS: 30,
  MAX_RECEIPT_PHOTOS: 10,
};
