import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/categories';
import CustomDateInput from '../Common/CustomDateInput'; 

const TransactionModal = ({ isOpen, onClose, initialData = null }) => {
  const { transactions, addTransaction, updateTransaction, exchangeRates } = useFinance();
  const [currency, setCurrency] = useState('RUB');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]); 
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState(''); 
  const [fileName, setFileName] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [budgetWarning, setBudgetWarning] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) setCurrency(JSON.parse(saved).currency || 'RUB');
  }, []);

  useEffect(() => {
    if (isOpen) {
      const savedBudgets = localStorage.getItem('ctrlmoney_budgets');
      if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isInitializing) setCategory(type === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
  }, [type]);

  useEffect(() => {
    if (isOpen && initialData) {
      setIsInitializing(true);
      setType(initialData.type);
      let displayAmount = Number(initialData.amount);
      if (currency !== 'RUB' && exchangeRates && exchangeRates[currency]) displayAmount = displayAmount * exchangeRates[currency];
      setAmount(Math.round(displayAmount).toString());
      setCategory(initialData.category);
      setDate(initialData.date);
      setNote(initialData.note || initialData.counterparty || '');
      setFile(null); setFileName(initialData.fileName || null);
      setTimeout(() => setIsInitializing(false), 50);
    } else if (isOpen && !initialData) {
      setType('expense'); setAmount(''); setCategory('Прочее'); setDate(new Date().toISOString().split('T')[0]); setNote(''); setFile(null); setFileName(null);
    }
  }, [isOpen, initialData, currency, exchangeRates]);

  useEffect(() => {
    if (type !== 'expense' || !category) { setBudgetWarning(null); return; }
    const currentBudget = budgets.find(b => b.category === category);
    if (!currentBudget) { setBudgetWarning(null); return; }
    const tDate = date ? new Date(date) : new Date();
    const currentMonth = tDate.getMonth(); const currentYear = tDate.getFullYear();
    const spentSoFar = transactions.filter(t => {
        if (initialData && t.id === initialData.id) return false;
        const d = new Date(t.date);
        return t.type === 'expense' && t.category === category && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }).reduce((acc, t) => acc + Number(t.amount), 0);
    let currentInputInRubles = Number(amount) || 0;
    if (currency !== 'RUB' && exchangeRates && exchangeRates[currency]) currentInputInRubles = currentInputInRubles / exchangeRates[currency];
    const projectedTotal = spentSoFar + currentInputInRubles;
    if (projectedTotal > currentBudget.limit) {
      const over = projectedTotal - currentBudget.limit;
      setBudgetWarning(`Брат, лимит превышен на ${Math.round(over).toLocaleString('ru-RU')} ₽!`);
    } else { setBudgetWarning(null); }
  }, [type, amount, category, date, transactions, budgets, initialData, currency, exchangeRates]);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const uplodedFile = e.target.files[0];
      setFile(uplodedFile); setFileName(uplodedFile.name); setFilePreview(URL.createObjectURL(uplodedFile));
    }
  };

  const resetAndClose = () => {
    setAmount(''); setNote(''); setFileName(null); setFileUrl(null); setFilePreview(null); setFile(null); setBudgetWarning(null); onClose();
  };

  const handleSave = () => {
    if (!amount || Number(amount) <= 0) { alert("Пожалуйста, введите сумму больше нуля"); return; }
    let amountToSave = Number(amount);
    if (currency !== 'RUB' && exchangeRates && exchangeRates[currency]) amountToSave = amountToSave / exchangeRates[currency];
    
    const transactionData = { type, amount: amountToSave, category, date, note, fileName };
    
    const performSave = (finalFileUrl) => {
      if (initialData) updateTransaction(initialData.id, { ...transactionData, fileUrl: finalFileUrl !== undefined ? finalFileUrl : initialData.fileUrl });
      else addTransaction({ ...transactionData, fileUrl: finalFileUrl });
      resetAndClose();
    };
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => performSave(reader.result);
      reader.readAsDataURL(file);
    } else performSave(undefined);
  };

  const modalContent = (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 transition-colors" onClick={resetAndClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: 'easeOut' }}>
        <motion.div className="bg-[#f8fafc]/90 dark:bg-black/60 backdrop-blur-2xl border border-white/80 dark:border-white/10 rounded-[calc(var(--index)*0.8)] p-[calc(var(--index)*1)] w-full max-w-[calc(var(--index)*22)] shadow-2xl relative flex flex-col gap-[calc(var(--index)*0.8)] transition-colors" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
          <button onClick={resetAndClose} className="absolute top-[calc(var(--index)*0.8)] right-[calc(var(--index)*0.8)] text-slate-400 dark:text-white/50 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer z-10">
            <svg className="w-[calc(var(--index)*1)] h-[calc(var(--index)*1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <h2 className="text-[calc(var(--index)*0.8)] font-semibold text-slate-800 dark:text-white tracking-tight transition-colors">{initialData ? 'Редактировать' : 'Новая транзакция'}</h2>

          <div className="flex bg-slate-200/50 dark:bg-white/5 p-[calc(var(--index)*0.1)] rounded-[calc(var(--index)*0.4)] relative transition-colors">
            <motion.div className="absolute top-[calc(var(--index)*0.1)] bottom-[calc(var(--index)*0.1)] w-[calc(50%-var(--index)*0.1)] bg-white dark:bg-white/20 rounded-[calc(var(--index)*0.3)] shadow-sm" animate={{ x: type === 'income' ? '100%' : '0%' }} transition={{ duration: 0.35, ease: 'easeOut' }} />
            <button onClick={() => setType('expense')} className={`flex-1 relative z-10 py-[calc(var(--index)*0.3)] text-[calc(var(--index)*0.45)] font-medium transition-colors duration-[400ms] ${type === 'expense' ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-white/50'}`}>Расход</button>
            <button onClick={() => setType('income')} className={`flex-1 relative z-10 py-[calc(var(--index)*0.3)] text-[calc(var(--index)*0.45)] font-medium transition-colors duration-[400ms] ${type === 'income' ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-white/50'}`}>Доход</button>
          </div>

          <div className="grid grid-cols-2 gap-[calc(var(--index)*0.5)]">
            <div className="col-span-2">
              <label className="block text-[calc(var(--index)*0.4)] text-slate-500 dark:text-white/60 font-medium mb-[calc(var(--index)*0.2)]">Сумма ({currency === 'RUB' ? '₽' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₸'})</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/50 dark:bg-white/5 border border-white/80 dark:border-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-[#4C5A7A] dark:focus:border-white rounded-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] outline-none transition-all text-[calc(var(--index)*0.6)] font-semibold text-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="block text-[calc(var(--index)*0.4)] text-slate-500 dark:text-white/60 font-medium mb-[calc(var(--index)*0.2)]">Категория</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/50 dark:bg-[#121212] border border-white/80 dark:border-white/10 focus:bg-white dark:focus:bg-[#1a1a1a] focus:border-[#4C5A7A] dark:focus:border-white rounded-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] outline-none transition-all text-[calc(var(--index)*0.45)] text-slate-700 dark:text-white cursor-pointer">
                {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[calc(var(--index)*0.4)] text-slate-500 dark:text-white/60 font-medium mb-[calc(var(--index)*0.2)]">Дата</label>
              <CustomDateInput value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white/50 dark:bg-white/5 border border-white/80 dark:border-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-[#4C5A7A] dark:focus:border-white rounded-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] outline-none transition-all text-[calc(var(--index)*0.45)] text-slate-700 dark:text-white cursor-pointer" />
            </div>

            <AnimatePresence>
              {budgetWarning && (
                <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 'calc(var(--index)*0.2)' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="col-span-2 overflow-hidden">
                  <div className="flex items-center gap-[calc(var(--index)*0.3)] bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.3)] rounded-[calc(var(--index)*0.3)] border border-red-100 dark:border-red-500/30">
                    <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span className="text-[calc(var(--index)*0.4)] font-medium leading-tight">{budgetWarning}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="col-span-2 mt-[calc(var(--index)*0.2)]">
              <label className="block text-[calc(var(--index)*0.4)] text-slate-500 dark:text-white/60 font-medium mb-[calc(var(--index)*0.2)]">Название транзакции</label>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Например: Зарплата за март" className="w-full bg-white/50 dark:bg-white/5 border border-white/80 dark:border-white/10 focus:bg-white dark:focus:bg-white/10 focus:border-[#4C5A7A] dark:focus:border-white rounded-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] outline-none transition-all text-[calc(var(--index)*0.5)] text-slate-700 dark:text-white" />
            </div>

            <div className="col-span-2">
              <label className="block text-[calc(var(--index)*0.4)] text-slate-500 dark:text-white/60 font-medium mb-[calc(var(--index)*0.2)]">Подтверждающий документ</label>
              <label className="relative flex flex-col items-center justify-center w-full bg-white/40 dark:bg-white/5 border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-[#4C5A7A]/50 dark:hover:border-white/50 hover:bg-white/60 dark:hover:bg-white/10 rounded-[calc(var(--index)*0.4)] py-[calc(var(--index)*0.8)] cursor-pointer transition-all">
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" />
                {fileName ? (
                  <div className="flex items-center gap-2 text-[#4C5A7A] dark:text-white">
                    <svg className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <span className="text-[calc(var(--index)*0.5)] font-medium">{fileName}</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)] text-slate-400 dark:text-white/50 mb-[calc(var(--index)*0.2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    <span className="text-[calc(var(--index)*0.45)] text-slate-500 dark:text-white/60">Прикрепить чек, акт или счет (PDF, Image)</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <button onClick={handleSave} className="w-full bg-[#4C5A7A] hover:bg-[#3b465e] dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white font-bold py-[calc(var(--index)*0.5)] rounded-[calc(var(--index)*0.4)] transition-colors mt-[calc(var(--index)*0.2)] text-[calc(var(--index)*0.55)] cursor-pointer shadow-md">
            {initialData ? 'Сохранить изменения' : 'Сохранить транзакцию'}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
export default TransactionModal;