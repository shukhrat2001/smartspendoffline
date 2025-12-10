import React, { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowRight, Wallet, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { db } from '../services/db';
import { formatCurrency, cn } from '../services/utils';
import { AppView } from '../types';
import { useTranslation } from '../services/i18n';

interface DashboardProps {
  onNavigate: (view: AppView) => void;
  onTriggerPremium: (reason: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, onTriggerPremium }) => {
  const { t, getCategoryName } = useTranslation();
  const expenses = useLiveQuery(() => 
    db.expenses.orderBy('date').reverse().limit(10).toArray()
  );

  const userSettings = useLiveQuery(() => db.settings.toArray());
  const isPremium = userSettings?.[0]?.isPremium || false;

  const todayTotal = useMemo(() => {
    if (!expenses) return 0;
    return expenses
      .filter(e => isToday(new Date(e.date)))
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  return (
    <div className="pb-24">
      {/* Header / Summary Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-indigo-100 text-sm font-medium mb-1">{t('total_spent_today')}</p>
              <h1 className="text-4xl font-bold tracking-tight">{formatCurrency(todayTotal)}</h1>
            </div>
            {!isPremium && (
              <button 
                onClick={() => onTriggerPremium(t('upgrade_cloud'))}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg backdrop-blur-md transition-colors"
              >
                <Wallet size={20} className="text-indigo-100" />
              </button>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/10">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-green-400/20 rounded-lg text-green-300">
                 <TrendingUp size={18} />
               </div>
               <div>
                 <p className="text-xs text-indigo-200">{t('this_month')}</p>
                 <p className="font-semibold text-sm">{t('on_track')}</p>
               </div>
             </div>
             <div className="h-8 w-px bg-white/10 mx-2"></div>
             <div className="flex items-center gap-3">
               <div className="p-2 bg-yellow-400/20 rounded-lg text-yellow-300">
                 <AlertCircle size={18} />
               </div>
               <div onClick={() => onTriggerPremium(t('unlock_analytics_msg'))}>
                 <p className="text-xs text-indigo-200">{t('budget')}</p>
                 <p className="font-semibold text-sm">{t('set_limit')}</p>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Quick Upsell Banner for Free Users */}
      {!isPremium && (
        <div className="mx-4 -mt-6 mb-6 relative z-20">
          <div className="bg-white p-4 rounded-xl shadow-lg border border-indigo-100 flex items-center justify-between">
            <div>
              <p className="text-indigo-900 font-bold text-sm">{t('upgrade_premium')}</p>
              <p className="text-gray-500 text-xs">{t('unlock_features')}</p>
            </div>
            <button 
              onClick={() => onTriggerPremium(t('unlock_all'))}
              className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md"
            >
              {t('view_plan')}
            </button>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="px-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">{t('recent_expenses')}</h2>
          <button 
            onClick={() => onNavigate(AppView.HISTORY)}
            className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:text-indigo-700"
          >
            {t('view_all')} <ArrowRight size={14} />
          </button>
        </div>

        <div className="space-y-3">
          {expenses?.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
              <div className="bg-gray-50 p-3 rounded-full inline-block mb-3">
                <RefreshCw size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">{t('no_expenses')}</p>
              <p className="text-gray-400 text-xs mt-1">{t('tap_add')}</p>
            </div>
          ) : (
            expenses?.map((expense) => (
              <div key={expense.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex items-center justify-between active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                    getColorForCategory(expense.categoryId)
                  )}>
                    {getIconForCategory(expense.categoryId)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 capitalize">
                      {getCategoryName(expense.categoryId, expense.categoryName)}
                    </p>
                    <p className="text-xs text-gray-500">{format(new Date(expense.date), 'MMM d')} • {expense.note || 'No note'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatCurrency(expense.amount)}</p>
                  {!expense.synced && (
                    <span className="text-[10px] text-orange-400 flex items-center justify-end gap-1">
                      <RefreshCw size={8} /> {t('pending')}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Helpers for visual flair
const getColorForCategory = (id: string) => {
  const map: Record<string, string> = {
    food: 'bg-orange-100 text-orange-600',
    transport: 'bg-blue-100 text-blue-600',
    bills: 'bg-red-100 text-red-600',
    shopping: 'bg-purple-100 text-purple-600',
    other: 'bg-gray-100 text-gray-600'
  };
  return map[id] || 'bg-gray-100 text-gray-600';
};

const getIconForCategory = (id: string) => {
  const map: Record<string, string> = {
    food: '🍔',
    transport: '🚗',
    bills: '⚡',
    shopping: '🛍️',
    other: '📝'
  };
  return map[id] || '📝';
};