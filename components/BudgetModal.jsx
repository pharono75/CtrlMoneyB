import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';

const BudgetModal = ({ isOpen, onClose, onSave, onDelete, availableCategories, initialData }) => {
  const { exchangeRates } = useFinance();
  const [currency, setCurrency] = useState('RUB');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  // Получаем текущую валюту
  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) setCurrency(JSON.parse(saved).currency || 'RUB');
  }, []);

  // Инициализация при открытии (Новая или Редактирование)
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setCategory(initialData.category);
        
        // === КОНВЕРТАЦИЯ ПРИ ОТКРЫТИИ ===
        let displayAmount = Number(initialData.limit);
        if (currency !== 'RUB' && exchangeRates && exchangeRates[currency]) {
          displayAmount = displayAmount * exchangeRates[currency];
        }
        setAmount(Math.round(displayAmount).toString());
        // =================================

      } else if (availableCategories.length > 0) {
        setCategory(availableCategories[0]);
        setAmount('');
      }
    }
  }, [isOpen, initialData, availableCategories, currency, exchangeRates]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0 || !category) return;
    
    // === КОНВЕРТАЦИЯ ПРИ СОХРАНЕНИИ ===
    let amountToSave = Number(amount);
    if (currency !== 'RUB' && exchangeRates && exchangeRates[currency]) {
      amountToSave = amountToSave / exchangeRates[currency];
    }
    // ==================================

    onSave(category, amountToSave, initialData?.category);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && initialData) {
      onDelete(initialData.category);
      onClose();
    }
  };

  const selectOptions = initialData 
    ? [initialData.category, ...availableCategories] 
    : availableCategories;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 dark:bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <motion.div
          className="bg-[#f8fafc]/90 dark:bg-black/40 backdrop-blur-2xl border border-white/80 dark:border-white/10 rounded-[calc(var(--index)*0.8)] p-[calc(var(--index)*1)] w-full max-w-[calc(var(--index)*18)] shadow-2xl relative flex flex-col gap-[calc(var(--index)*0.8)]"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <button 
            onClick={onClose} 
            className="absolute top-[calc(var(--index)*0.8)] right-[calc(var(--index)*0.8)] text-slate-400 dark:text-white/60 hover:text-slate-700 dark:hover:text-white/80 transition-colors cursor-pointer z-10"
          >
            <svg className="w-[calc(var(--index)*1)] h-[calc(var(--index)*1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-[calc(var(--index)*0.8)] font-semibold text-slate-800 dark:text-white tracking-tight">
            {initialData ? 'Изменить лимит' : 'Установить лимит'}
          </h2>

          <form onSubmit={handleSave} className="flex flex-col gap-[calc(var(--index)*0.5)]">
            <div>
              <label className="block text-[calc(var(--index)*0.4)] text-slate-500 dark:text-slate-400 font-medium mb-[calc(var(--index)*0.2)]">
                Категория
              </label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full bg-white/50 dark:bg-white/10 border border-white/80 dark:border-white/10 focus:bg-white dark:focus:bg-white/20 focus:border-[#4C5A7A] dark:focus:border-white/20 rounded-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] outline-none transition-all text-[calc(var(--index)*0.45)] text-slate-700 dark:text-white cursor-pointer"
              >
                {selectOptions.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[calc(var(--index)*0.4)] text-slate-500 dark:text-slate-400 font-medium mb-[calc(var(--index)*0.2)]">
                Сумма лимита ({currency === 'RUB' ? '₽' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₸'})
              </label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="0" 
                autoFocus
                className="w-full bg-white/50 dark:bg-white/10 border border-white/80 dark:border-white/10 focus:bg-white dark:focus:bg-white/20 focus:border-[#4C5A7A] dark:focus:border-white/20 rounded-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] outline-none transition-all text-[calc(var(--index)*0.6)] font-semibold text-slate-800 dark:text-white" 
              />
            </div>

            <div className="flex gap-[calc(var(--index)*0.4)] mt-[calc(var(--index)*0.4)]">
              <button 
                type="submit" 
                className="flex-1 bg-[#4C5A7A] dark:bg-white/20 hover:bg-[#3b465e] dark:hover:bg-white/30 text-white font-medium py-[calc(var(--index)*0.5)] rounded-[calc(var(--index)*0.4)] transition-colors text-[calc(var(--index)*0.55)] cursor-pointer shadow-md flex items-center justify-center gap-2 active-press"
              >
                <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Сохранить
              </button>

              {initialData && (
                <button 
                  type="button" 
                  onClick={handleDelete}
                  className="shrink-0 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 font-medium px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.5)] rounded-[calc(var(--index)*0.4)] border border-red-200 dark:border-red-800/50 transition-colors cursor-pointer flex items-center justify-center active-press"
                  title="Удалить лимит"
                >
                  <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </form>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default BudgetModal;