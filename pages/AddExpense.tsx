import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Camera, X, Check, Calendar, Tag, DollarSign, FileText, Plus } from 'lucide-react';
import { db, checkPremiumLimit } from '../services/db';
import { compressImage, cn } from '../services/utils';
import { Category } from '../types';

interface AddExpenseProps {
  onCancel: () => void;
  onSave: () => void;
  onTriggerPremium: (reason: string) => void;
}

export const AddExpense: React.FC<AddExpenseProps> = ({ onCancel, onSave, onTriggerPremium }) => {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const categories = useLiveQuery(() => db.categories.toArray());

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Premium Check: Photo limit
    const canAddPhoto = await checkPremiumLimit('photo');
    if (!canAddPhoto && !image) { // If replacing, it's fine. If adding new, check limit.
      onTriggerPremium('Unlock unlimited receipt photos with Premium.');
      return;
    }

    try {
      const compressed = await compressImage(file);
      setImage(compressed);
    } catch (err) {
      console.error("Image compression failed", err);
      alert("Could not process image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId) return;

    setIsSaving(true);
    try {
      const category = categories?.find(c => c.id === categoryId);
      
      await db.expenses.add({
        amount: parseFloat(amount),
        categoryId,
        categoryName: category?.name || 'Unknown',
        date: new Date(date),
        note,
        receiptImage: image || undefined,
        createdAt: new Date(),
        synced: false // Mark for background sync
      });

      // Simple analytic hook
      const count = await db.expenses.count();
      if (count === 50) {
        onTriggerPremium("You've logged 50 expenses! Upgrade to keep seeing full history.");
      }

      onSave();
    } catch (error) {
      console.error(error);
      alert('Failed to save expense');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCategory = async () => {
     // Premium Check: Category limit
     const canAdd = await checkPremiumLimit('category');
     if (!canAdd) {
       onTriggerPremium('Upgrade to add unlimited custom categories.');
       return;
     }
     // In a real app, this would open a dialog. Here we mock it.
     const name = prompt("Enter new category name:");
     if (name) {
       const id = name.toLowerCase().replace(/\s+/g, '-');
       await db.categories.add({
         id,
         name,
         icon: 'Circle',
         isCustom: true
       });
       setCategoryId(id);
     }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <h1 className="text-xl font-bold text-gray-900">Add Expense</h1>
        <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Amount Input */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Amount</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            <input 
              type="number" 
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-3xl font-bold text-gray-900 bg-gray-50 rounded-xl border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all outline-none"
              autoFocus
              required
            />
          </div>
        </div>

        {/* Category Selection */}
        <div>
           <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</label>
            <button 
              type="button" 
              onClick={handleAddCategory}
              className="text-xs text-indigo-600 font-medium flex items-center gap-1"
            >
              <Plus size={12} /> New Category
            </button>
           </div>
           
           <div className="grid grid-cols-3 gap-3">
              {categories?.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                    categoryId === cat.id 
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm" 
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  )}
                >
                  <div className="mb-1 text-sm font-medium truncate w-full text-center">{cat.name}</div>
                </button>
              ))}
           </div>
        </div>

        {/* Date & Note */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Note (Optional)</label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="What was this for?"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-900 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Receipt Photo */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Receipt</label>
          <div className="relative">
            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              onChange={handleImageUpload}
              className="hidden" 
              id="receipt-upload"
            />
            
            {!image ? (
              <label 
                htmlFor="receipt-upload"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="flex flex-col items-center text-gray-500">
                  <Camera size={24} className="mb-2" />
                  <span className="text-sm font-medium">Take Photo</span>
                </div>
              </label>
            ) : (
              <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md">
                <img src={image} alt="Receipt" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Footer Actions */}
      <div className="p-6 border-t border-gray-100 bg-gray-50 sticky bottom-0 z-10">
        <button
          onClick={handleSubmit}
          disabled={!amount || isSaving}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
        >
          {isSaving ? 'Saving...' : (
            <>
              <Check size={20} strokeWidth={3} />
              Save Expense
            </>
          )}
        </button>
      </div>
    </div>
  );
};
