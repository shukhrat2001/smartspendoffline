import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Search, Filter, Lock, Download } from 'lucide-react';
import { format, subDays, isBefore } from 'date-fns';
import { db } from '../services/db';
import { formatCurrency, cn } from '../services/utils';
import { FREE_LIMITS } from '../types';
import { useTranslation } from '../services/i18n';

interface HistoryProps {
  onTriggerPremium: (reason: string) => void;
}

export const History: React.FC<HistoryProps> = ({ onTriggerPremium }) => {
  const { t, getCategoryName } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  
  const settings = useLiveQuery(() => db.settings.toArray());
  const isPremium = settings?.[0]?.isPremium || false;

  // Fetch all expenses, we will filter in memory for simplicity in this demo
  // Real app would use DB query limits for performance
  const expenses = useLiveQuery(() => 
    db.expenses.orderBy('date').reverse().toArray()
  );

  const filteredExpenses = expenses?.filter(e => {
    // Search filter
    const matchesSearch = 
      e.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.note && e.note.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const handleExport = () => {
    if (!isPremium) {
      onTriggerPremium(t('export_premium'));
      return;
    }
    alert("Exporting data... (Mock)");
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Detect if user scrolls to bottom to trigger history limit message if needed
    // Simplified for this implementation
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900">{t('history_title')}</h1>
          <button 
            onClick={handleExport}
            className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Download size={20} />
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={t('search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl text-sm border-transparent focus:bg-white focus:border-indigo-500 transition-all outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4" onScroll={handleScroll}>
        <div className="space-y-3">
          {filteredExpenses?.map((expense, index) => {
            // Logic to blur/hide expenses older than 30 days for free users
            const expenseDate = new Date(expense.date);
            const limitDate = subDays(new Date(), FREE_LIMITS.MAX_HISTORY_DAYS);
            const isLocked = !isPremium && isBefore(expenseDate, limitDate);

            if (isLocked) {
              // Only show one "Locked" banner instead of blurring every item individually 
              // to make it look cleaner, but strictly this logic iterates.
              // For simplicity, we blur individual items here.
              return (
                <div 
                  key={expense.id} 
                  onClick={() => onTriggerPremium(t('upgrade_history_msg'))}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between opacity-60 relative overflow-hidden group cursor-pointer"
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[1px] z-10 group-hover:bg-white/20 transition-all">
                     <div className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Lock size={10} /> {t('premium_history')}
                     </div>
                  </div>
                  <div className="flex items-center gap-3 filter blur-sm">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={expense.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-full text-xl">
                   {/* Simple icon mapping based on name */}
                   {['Food', 'Lunch', 'Dinner'].some(s => expense.categoryName.includes(s)) ? '🍔' : '📄'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {getCategoryName(expense.categoryId, expense.categoryName)}
                    </p>
                    <p className="text-xs text-gray-500">{format(expenseDate, 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
                </div>
              </div>
            );
          })}
          
          {filteredExpenses?.length === 0 && (
             <div className="text-center text-gray-400 mt-10">
               <p>{t('no_expenses_found')}</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};