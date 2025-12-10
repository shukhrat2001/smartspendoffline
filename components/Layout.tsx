import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, Home, PlusCircle, PieChart, Clock, Settings } from 'lucide-react';
import { AppView } from '../types';
import { cn } from '../services/utils';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-200">
      {/* Offline Banner */}
      <div 
        className={cn(
          "transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 text-white text-xs font-bold py-1",
          isOnline ? "h-0 opacity-0" : "h-8 bg-red-500 opacity-100"
        )}
      >
        <WifiOff size={12} />
        <span>OFFLINE MODE • Changes saved locally</span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth relative">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-100 pb-safe">
        <div className="flex justify-around items-center h-16">
          <NavItem 
            icon={<Home size={22} />} 
            label="Home" 
            isActive={currentView === AppView.DASHBOARD} 
            onClick={() => onChangeView(AppView.DASHBOARD)} 
          />
          <NavItem 
            icon={<Clock size={22} />} 
            label="History" 
            isActive={currentView === AppView.HISTORY} 
            onClick={() => onChangeView(AppView.HISTORY)} 
          />
          
          {/* Floating Add Button */}
          <div className="relative -top-5">
            <button 
              onClick={() => onChangeView(AppView.ADD_EXPENSE)}
              className="bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-transform active:scale-95 border-4 border-gray-50"
            >
              <PlusCircle size={28} />
            </button>
          </div>

          <NavItem 
            icon={<PieChart size={22} />} 
            label="Reports" 
            isActive={currentView === AppView.REPORTS} 
            onClick={() => onChangeView(AppView.REPORTS)} 
          />
          <NavItem 
            icon={<Settings size={22} />} 
            label="Settings" 
            isActive={currentView === AppView.SETTINGS} 
            onClick={() => onChangeView(AppView.SETTINGS)} 
          />
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
      isActive ? "text-indigo-600" : "text-gray-400 hover:text-gray-600"
    )}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);
