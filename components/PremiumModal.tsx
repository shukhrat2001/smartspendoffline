import React from 'react';
import { X, Check, Star, Lock } from 'lucide-react';
import { cn } from '../services/utils';
import { useTranslation } from '../services/i18n';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerReason: string;
  onUpgrade: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, triggerReason, onUpgrade }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star size={10} fill="currentColor" /> PREMIUM
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-1">{t('unlock_full')}</h2>
          <p className="text-indigo-100 text-sm opacity-90">
            {triggerReason || t('hit_limit')}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4 mb-8">
            <FeatureRow text={t('feat_history')} />
            <FeatureRow text={t('feat_receipts')} />
            <FeatureRow text={t('feat_custom_cat')} />
            <FeatureRow text={t('feat_reports')} />
            <FeatureRow text={t('feat_export')} />
            <FeatureRow text={t('feat_cloud')} />
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 text-center">
             <p className="text-sm text-gray-500 mb-1">{t('start_trial')}</p>
             <div className="flex items-baseline justify-center gap-1">
               <span className="text-3xl font-bold text-gray-900">$4.99</span>
               <span className="text-gray-500">{t('per_month')}</span>
             </div>
             <p className="text-xs text-green-600 font-medium mt-1">{t('annual_save')}</p>
          </div>

          <button
            onClick={onUpgrade}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 flex items-center justify-center gap-2"
          >
            <Star size={18} fill="currentColor" className="text-yellow-300" />
            {t('start_free_trial')}
          </button>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            {t('cancel_anytime')}
          </p>
        </div>
      </div>
    </div>
  );
};

const FeatureRow = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3">
    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
      <Check size={14} strokeWidth={3} />
    </div>
    <span className="text-gray-700 font-medium text-sm">{text}</span>
  </div>
);