import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AddExpense } from './pages/AddExpense';
import { History } from './pages/History';
import { Reports } from './pages/Reports';
import { PremiumModal } from './components/PremiumModal';
import { AppView, Language } from './types';
import { db } from './services/db';
import { useTranslation } from './services/i18n';

// ------------------------------------------------------------------
// CONFIGURATION: Replace this with your actual Stripe Payment Link
// ------------------------------------------------------------------
const STRIPE_PAYMENT_LINK = ""; 

const App: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [premiumReason, setPremiumReason] = useState('');

  useEffect(() => {
    // 1. Ensure DB is open
    (db as any).open().catch((err: any) => console.error(err));

    // 2. Check for Stripe Success Redirect
    const query = new URLSearchParams(window.location.search);
    if (query.get('success') === 'true') {
      db.settings.update(1, { isPremium: true }).then(() => {
        window.history.replaceState({}, '', window.location.pathname);
        alert(t('payment_success'));
        window.location.reload();
      });
    }
  }, [t]);

  const handleTriggerPremium = (reason: string) => {
    setPremiumReason(reason);
    setIsPremiumModalOpen(true);
  };

  const handleUpgrade = async () => {
    if (!STRIPE_PAYMENT_LINK) {
      const isConfirmed = window.confirm(
        "DEV MODE: No Stripe Link Configured.\n\nClick OK to simulate a successful payment.\nClick Cancel to simulate abandonment."
      );
      
      if (isConfirmed) {
        await db.settings.update(1, { isPremium: true });
        setIsPremiumModalOpen(false);
        alert(t('welcome_premium'));
        window.location.reload();
      }
      return;
    }
    window.location.href = STRIPE_PAYMENT_LINK;
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
            <h1 className="text-2xl font-bold mb-4">{t('nav_settings')}</h1>
            <button 
              onClick={() => handleTriggerPremium(t('upgrade_manage'))}
              className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold mb-6"
            >
              {t('upgrade_manage')}
            </button>
            
            <div className="space-y-4 text-sm text-gray-500">
               
               {/* Language Selector */}
               <div className="p-4 bg-white rounded-xl border border-gray-200">
                  <p className="font-bold text-gray-900 mb-3">{t('select_language')}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['en', 'ru', 'tg'] as Language[]).map(lang => (
                      <button 
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                          language === lang 
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                            : 'bg-gray-50 border-gray-200 text-gray-600'
                        }`}
                      >
                        {lang === 'en' ? 'English' : lang === 'ru' ? 'Русский' : 'Тоҷикӣ'}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="p-4 bg-white rounded-xl border border-gray-200">
                 <p className="font-bold text-gray-900">{t('data_management')}</p>
                 <button 
                    onClick={() => {
                      if(window.confirm(t('delete_confirm'))) {
                        (db as any).delete().then(() => window.location.reload());
                      }
                    }}
                    className="text-red-500 mt-2 font-medium"
                 >
                   {t('reset_app')}
                 </button>
               </div>
               <p className="text-center mt-6 text-xs">{t('app_version')}</p>
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