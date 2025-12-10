import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AddExpense } from './pages/AddExpense';
import { History } from './pages/History';
import { Reports } from './pages/Reports';
import { PremiumModal } from './components/PremiumModal';
import { AppView } from './types';
import { db } from './services/db';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [premiumReason, setPremiumReason] = useState('');

  // Initial seeding check
  useEffect(() => {
    // This is just to ensure DB is open
    db.open().catch(err => console.error(err));
  }, []);

  const handleTriggerPremium = (reason: string) => {
    setPremiumReason(reason);
    setIsPremiumModalOpen(true);
  };

  const handleUpgrade = async () => {
    // Mock Stripe Integration
    // In real app: Redirect to Stripe Checkout
    const isConfirmed = window.confirm("Mock Payment: Confirm $4.99 subscription?");
    if (isConfirmed) {
      await db.settings.update(1, { isPremium: true }); // Assuming ID 1 for single user
      setIsPremiumModalOpen(false);
      alert("Welcome to Premium! All features unlocked.");
      window.location.reload(); // Simple reload to refresh all state
    }
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard onNavigate={setCurrentView} onTriggerPremium={handleTriggerPremium} />;
      case AppView.ADD_EXPENSE:
        return <AddExpense onCancel={() => setCurrentView(AppView.DASHBOARD)} onSave={() => setCurrentView(AppView.DASHBOARD)} onTriggerPremium={handleTriggerPremium} />;
      case AppView.HISTORY:
        return <History onTriggerPremium={handleTriggerPremium} />;
      case AppView.REPORTS:
        return <Reports onTriggerPremium={handleTriggerPremium} />;
      case AppView.SETTINGS:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <button 
              onClick={() => handleTriggerPremium("Manage subscription")}
              className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold mb-4"
            >
              Upgrade / Manage Plan
            </button>
            <div className="space-y-2 text-sm text-gray-500">
               <div className="p-4 bg-white rounded-xl border border-gray-200">
                 <p className="font-bold text-gray-900">Data Management</p>
                 <p className="mt-1">Clear Data</p>
               </div>
               <p className="text-center mt-6 text-xs">Version 1.0.0 (Offline Capable)</p>
            </div>
          </div>
        );
      default:
        return <Dashboard onNavigate={setCurrentView} onTriggerPremium={handleTriggerPremium} />;
    }
  };

  return (
    <>
      <Layout currentView={currentView} onChangeView={setCurrentView}>
        {renderView()}
      </Layout>

      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        triggerReason={premiumReason}
        onUpgrade={handleUpgrade}
      />
    </>
  );
};

export default App;
