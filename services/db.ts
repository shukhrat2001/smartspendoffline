import Dexie, { type Table } from 'dexie';
import { Expense, Category, UserSettings, DEFAULT_CATEGORIES } from '../types';

export class ExpenseDatabase extends Dexie {
  expenses!: Table<Expense, number>;
  categories!: Table<Category, string>;
  settings!: Table<UserSettings, number>;

  constructor() {
    super('SmartSpendDB');
    
    // Define schema
    this.version(1).stores({
      expenses: '++id, date, categoryId, synced',
      categories: 'id, isCustom',
      settings: '++id'
    });

    // Populate default data if empty
    this.on('populate', () => {
      this.categories.bulkAdd(DEFAULT_CATEGORIES);
      this.settings.add({
        isPremium: false,
        currency: 'USD',
        theme: 'light',
        trialStartDate: new Date()
      });
    });
  }
}

export const db = new ExpenseDatabase();

// Helper to check premium limits
export const checkPremiumLimit = async (limitType: 'category' | 'photo' | 'history'): Promise<boolean> => {
  const settings = await db.settings.toArray();
  const user = settings[0];
  
  if (user?.isPremium) return true;

  if (limitType === 'category') {
    const count = await db.categories.count();
    return count < 5; // Limit is 5 for free users
  }
  
  if (limitType === 'photo') {
    const count = await db.expenses.filter(e => !!e.receiptImage).count();
    return count < 10;
  }

  // History check is usually done at query time, but this helps UI logic
  return false;
};