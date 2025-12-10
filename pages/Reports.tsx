import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { useLiveQuery } from 'dexie-react-hooks';
import { Lock } from 'lucide-react';
import { db } from '../services/db';
import { formatCurrency } from '../services/utils';

interface ReportsProps {
  onTriggerPremium: (reason: string) => void;
}

const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#f97316', '#84cc16', '#64748b'];

export const Reports: React.FC<ReportsProps> = ({ onTriggerPremium }) => {
  const settings = useLiveQuery(() => db.settings.toArray());
  const isPremium = settings?.[0]?.isPremium || false;

  const expenses = useLiveQuery(() => db.expenses.toArray());

  // Aggregate data for Pie Chart
  const categoryData = React.useMemo(() => {
    if (!expenses) return [];
    const map = new Map<string, number>();
    expenses.forEach(e => {
      const current = map.get(e.categoryName) || 0;
      map.set(e.categoryName, current + e.amount);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const totalSpent = categoryData.reduce((acc, curr) => acc + curr.value, 0);

  // Mock data for the "Trend" chart which is a premium feature
  const mockTrendData = [
    { name: 'Mon', amt: 40 }, { name: 'Tue', amt: 30 }, { name: 'Wed', amt: 20 },
    { name: 'Thu', amt: 27 }, { name: 'Fri', amt: 18 }, { name: 'Sat', amt: 23 },
    { name: 'Sun', amt: 34 },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50 pb-20">
      <div className="bg-white p-6 pb-4 mb-2 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Spending Reports</h1>
        <p className="text-sm text-gray-500">Total Spent: <span className="font-bold text-gray-900">{formatCurrency(totalSpent)}</span></p>
      </div>

      <div className="p-4 space-y-6">
        {/* Category Breakdown - Free */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Category Breakdown</h3>
          <div className="h-64 relative">
             {categoryData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={categoryData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {categoryData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip formatter={(value: number) => formatCurrency(value)} />
                 </PieChart>
               </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                 No data to display
               </div>
             )}
             {/* Center Label */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
               <span className="text-xs text-gray-400 font-medium">Total</span>
               <div className="font-bold text-gray-800 text-sm">{formatCurrency(totalSpent)}</div>
             </div>
          </div>
          
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="text-gray-600">{cat.name}</span>
                </div>
                <span className="font-medium text-gray-900">{formatCurrency(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend - Premium Only */}
        <div className="relative overflow-hidden rounded-2xl shadow-sm border border-gray-100 bg-white">
          <div className="p-5 blur-sm opacity-50 select-none pointer-events-none">
            <h3 className="font-bold text-gray-800 mb-4">Weekly Spending Trend</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockTrendData}>
                  <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Bar dataKey="amt" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {!isPremium && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 z-10 p-6 text-center">
              <div className="bg-indigo-600 text-white p-3 rounded-full mb-3 shadow-lg">
                <Lock size={24} />
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Advanced Analytics</h4>
              <p className="text-xs text-gray-600 mb-4 max-w-[200px]">
                Unlock weekly trends, budget forecasting, and more.
              </p>
              <button 
                onClick={() => onTriggerPremium("Unlock advanced analytics and trends.")}
                className="bg-gray-900 text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-black transition-colors"
              >
                Unlock Premium
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
