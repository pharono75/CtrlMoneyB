import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
<<<<<<< HEAD
=======
import { motion, AnimatePresence } from 'framer-motion';
>>>>>>> 17c35ee (Modern Finance)
import { useFinance } from '../../context/FinanceContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../constants/categories'; 

const TransactionModal = ({ isOpen, onClose, initialData = null }) => {
<<<<<<< HEAD
  const { addTransaction, updateTransaction } = useFinance();
=======
  // ДОБАВЛЕНО: Достаем transactions, чтобы считать текущие траты
  const { transactions, addTransaction, updateTransaction } = useFinance();
>>>>>>> 17c35ee (Modern Finance)

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]); 
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [counterparty, setCounterparty] = useState(''); 
  const [fileName, setFileName] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  const [isInitializing, setIsInitializing] = useState(false);
<<<<<<< HEAD

=======
  
  // ДОБАВЛЕНО: Состояния для лимитов и предупреждений
  const [budgets, setBudgets] = useState([]);
  const [budgetWarning, setBudgetWarning] = useState(null);

  // Загружаем лимиты при открытии модалки
  useEffect(() => {
    if (isOpen) {
      const savedBudgets = localStorage.getItem('ctrlmoney_budgets');
      if (savedBudgets) {
        setBudgets(JSON.parse(savedBudgets));
      }
    }
  }, [isOpen]);

  // Смена категории при смене типа (Доход/Расход)
>>>>>>> 17c35ee (Modern Finance)
  useEffect(() => {
    if (!isInitializing) {
      setCategory(type === 'expense' ? EXPENSE_CATEGORIES[0] : INCOME_CATEGORIES[0]);
    }
  }, [type]);

<<<<<<< HEAD
=======
  // Инициализация при открытии/редактировании
>>>>>>> 17c35ee (Modern Finance)
  useEffect(() => {
    if (isOpen && initialData) {
      setIsInitializing(true);
      
      setType(initialData.type);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      setDate(initialData.date);
      setCounterparty(initialData.counterparty || '');
      setFile(null);
      setFileName(initialData.fileName || null);
      
      setTimeout(() => setIsInitializing(false), 50);
      
    } else if (isOpen && !initialData) {
      setType('expense');
      setAmount('');
      setCategory('Прочее');
      setDate(new Date().toISOString().split('T')[0]);
      setCounterparty('');
      setFile(null);
      setFileName(null);
    }
  }, [isOpen, initialData]);

<<<<<<< HEAD
=======
  // ДОБАВЛЕНО: Проверка лимитов (Бьем по рукам, если лимит всё)
  useEffect(() => {
    if (type !== 'expense' || !category) {
      setBudgetWarning(null);
      return;
    }

    const currentBudget = budgets.find(b => b.category === category);
    if (!currentBudget) {
      setBudgetWarning(null);
      return;
    }

    const tDate = date ? new Date(date) : new Date();
    const currentMonth = tDate.getMonth();
    const currentYear = tDate.getFullYear();

    // Считаем, сколько УЖЕ потрачено в этом месяце по этой категории
    const spentSoFar = transactions
      .filter(t => {
        // Если мы редактируем, не учитываем старую сумму этой же транзакции (иначе она задвоится)
        if (initialData && t.id === initialData.id) return false;
        
        const d = new Date(t.date);
        return t.type === 'expense' &&
               t.category === category &&
               d.getMonth() === currentMonth &&
               d.getFullYear() === currentYear;
      })
      .reduce((acc, t) => acc + Number(t.amount), 0);

    // Добавляем то, что пользователь ввел сейчас
    const projectedTotal = spentSoFar + (Number(amount) || 0);

    if (projectedTotal > currentBudget.limit) {
      const over = projectedTotal - currentBudget.limit;
      setBudgetWarning(`Лимит превышен на ${over.toLocaleString('ru-RU')} ₽!`);
    } else {
      setBudgetWarning(null);
    }
  }, [type, amount, category, date, transactions, budgets, initialData]);

>>>>>>> 17c35ee (Modern Finance)
  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const uplodedFile = e.target.files[0];
      setFile(uplodedFile);
      setFileName(uplodedFile.name);
      setFilePreview(URL.createObjectURL(uplodedFile));
    }
  };

  const resetAndClose = () => {
    setAmount('');
    setCounterparty('');
    setFileName(null);
    setFileUrl(null);
    setFilePreview(null);
    setFile(null);
<<<<<<< HEAD
=======
    setBudgetWarning(null);
>>>>>>> 17c35ee (Modern Finance)
    onClose();
  };

  const handleSave = () => {
    if (!amount || Number(amount) <= 0) {
      alert("Пожалуйста, введите сумму больше нуля");
      return;
    }

    const transactionData = {
      type,
      amount: Number(amount),
      category,
      date,
      counterparty, 
      fileName
    };

    const performSave = (finalFileUrl) => {
      if (initialData) {
        updateTransaction(initialData.id, { ...transactionData, fileUrl: finalFileUrl !== undefined ? finalFileUrl : initialData.fileUrl });
      } else {
        addTransaction({ id: Date.now().toString(), ...transactionData, fileUrl: finalFileUrl });
      }
      resetAndClose();
    };

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => performSave(reader.result);
      reader.readAsDataURL(file);
    } else {
      performSave(undefined);
    }
  };

  const modalContent = (
<<<<<<< HEAD
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-[#f8fafc]/90 backdrop-blur-2xl border border-white/80 rounded-[calc(var(--index)*0.8)] p-[calc(var(--index)*1)] w-full max-w-[calc(var(--index)*22)] shadow-2xl relative flex flex-col gap-[calc(var(--index)*0.8)] animate-in fade-in zoom-in duration-200">
        
        <button onClick={resetAndClose} className="absolute top-[calc(var(--index)*0.8)] right-[calc(var(--index)*0.8)] text-slate-400 hover:text-slate-700 transition-colors cursor-pointer z-10">
          <svg className="w-[calc(var(--index)*1)] h-[calc(var(--index)*1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-[calc(var(--index)*0.8)] font-semibold text-slate-800 tracking-tight">
          {initialData ? 'Редактировать' : 'Новая транзакция'}
        </h2>

        <div className="flex bg-slate-200/50 p-[calc(var(--index)*0.1)] rounded-[calc(var(--index)*0.4)] relative">
          <div 
            className="absolute top-[calc(var(--index)*0.1)] bottom-[calc(var(--index)*0.1)] w-[calc(50%-var(--index)*0.1)] bg-white rounded-[calc(var(--index)*0.3)] shadow-sm transition-transform duration-[400ms] ease-[cubic-bezier(0.03,0.74,1,1.01)]"
            style={{ transform: type === 'income' ? 'translateX(100%)' : 'translateX(0)' }}
          ></div>
          
          <button onClick={() => setType('expense')} className={`flex-1 relative z-10 py-[calc(var(--index)*0.3)] text-[calc(var(--index)*0.45)] font-medium transition-colors duration-[400ms] ${type === 'expense' ? 'text-slate-800' : 'text-slate-500'}`}>
            Расход
          </button>
          <button onClick={() => setType('income')} className={`flex-1 relative z-10 py-[calc(var(--index)*0.3)] text-[calc(var(--index)*0.45)] font-medium transition-colors duration-[400ms] ${type === 'income' ? 'text-slate-800' : 'text-slate-500'}`}>
            Доход
          </button>
        </div>

        <div className="grid grid-cols-2 gap-[calc(var(--index)*0.5)]">
          <div className="col-span-2">
            <label className="block text-[calc(var(--index)*0.4)] text-slate-500 font-medium mb-[calc(var(--index)*0.2)]">Сумма (₽)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/50 border border-white/80 focus:bg-white focus:border-[#4C5A7A] rounded-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] outline-none transition-all text-[calc(var(--index)*0.6)] font-semibold text-slate-800" />
          </div>

          <div>
            <label className="block text-[calc(var(--index)*0.4)] text-slate-500 font-medium mb-[calc(var(--index)*0.2)]">Категория</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/50 border border-white/80 focus:bg-white focus:border-[#4C5A7A] rounded-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] outline-none transition-all text-[calc(var(--index)*0.45)] text-slate-700 cursor-pointer">
              {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[calc(var(--index)*0.4)] text-slate-500 font-medium mb-[calc(var(--index)*0.2)]">Дата</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white/50 border border-white/80 focus:bg-white focus:border-[#4C5A7A] rounded-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] outline-none transition-all text-[calc(var(--index)*0.45)] text-slate-700 cursor-pointer" />
          </div>

          <div className="col-span-2">
            <label className="block text-[calc(var(--index)*0.4)] text-slate-500 font-medium mb-[calc(var(--index)*0.2)]">Название транзакции</label>
            <input type="text" value={counterparty} onChange={(e) => setCounterparty(e.target.value)} placeholder="Например: Зарплата за март" className="w-full bg-white/50 border border-white/80 focus:bg-white focus:border-[#4C5A7A] rounded-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] outline-none transition-all text-[calc(var(--index)*0.5)] text-slate-700" />
          </div>

          <div className="col-span-2">
            <label className="block text-[calc(var(--index)*0.4)] text-slate-500 font-medium mb-[calc(var(--index)*0.2)]">Подтверждающий документ</label>
            <label className="relative flex flex-col items-center justify-center w-full bg-white/40 border-2 border-dashed border-slate-300 hover:border-[#4C5A7A]/50 hover:bg-white/60 rounded-[calc(var(--index)*0.4)] py-[calc(var(--index)*0.8)] cursor-pointer transition-all">
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" />
              {fileName ? (
                <div className="flex items-center gap-2 text-[#4C5A7A]">
                  <svg className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-[calc(var(--index)*0.5)] font-medium">{fileName}</span>
                </div>
              ) : (
                <>
                  <svg className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)] text-slate-400 mb-[calc(var(--index)*0.2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-[calc(var(--index)*0.45)] text-slate-500">Прикрепить чек, акт или счет (PDF, Image)</span>
                </>
              )}
            </label>
          </div>
        </div>

        <button onClick={handleSave} className="w-full bg-[#4C5A7A] hover:bg-[#3b465e] text-white font-medium py-[calc(var(--index)*0.5)] rounded-[calc(var(--index)*0.4)] transition-colors mt-[calc(var(--index)*0.2)] text-[calc(var(--index)*0.55)] cursor-pointer shadow-md">
          {initialData ? 'Сохранить изменения' : 'Сохранить транзакцию'}
        </button>

      </div>
    </div>
=======
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
        onClick={resetAndClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <motion.div
          className="bg-[#f8fafc]/90 backdrop-blur-2xl border border-white/80 rounded-[calc(var(--index)*0.8)] p-[calc(var(--index)*1)] w-full max-w-[calc(var(--index)*22)] shadow-2xl relative flex flex-col gap-[calc(var(--index)*0.8)]"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <button onClick={resetAndClose} className="absolute top-[calc(var(--index)*0.8)] right-[calc(var(--index)*0.8)] text-slate-400 hover:text-slate-700 transition-colors cursor-pointer z-10">
            <svg className="w-[calc(var(--index)*1)] h-[calc(var(--index)*1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-[calc(var(--index)*0.8)] font-semibold text-slate-800 tracking-tight">
            {initialData ? 'Редактировать' : 'Новая транзакция'}
          </h2>

          <motion.div
            className="flex bg-slate-200/50 p-[calc(var(--index)*0.1)] rounded-[calc(var(--index)*0.4)] relative"
            initial={false}
            animate={{ backgroundColor: type === 'income' ? 'rgba(59,130,246,0.1)' : 'rgba(248,250,252,0.5)' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <motion.div
              className="absolute top-[calc(var(--index)*0.1)] bottom-[calc(var(--index)*0.1)] w-[calc(50%-var(--index)*0.1)] bg-white rounded-[calc(var(--index)*0.3)] shadow-sm"
              animate={{ x: type === 'income' ? '100%' : '0%' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
            <button onClick={() => setType('expense')} className={`flex-1 relative z-10 py-[calc(var(--index)*0.3)] text-[calc(var(--index)*0.45)] font-medium transition-colors duration-[400ms] ${type === 'expense' ? 'text-slate-800' : 'text-slate-500'}`}>
              Расход
            </button>
            <button onClick={() => setType('income')} className={`flex-1 relative z-10 py-[calc(var(--index)*0.3)] text-[calc(var(--index)*0.45)] font-medium transition-colors duration-[400ms] ${type === 'income' ? 'text-slate-800' : 'text-slate-500'}`}>
              Доход
            </button>
          </motion.div>

          <div className="grid grid-cols-2 gap-[calc(var(--index)*0.5)]">
            <div className="col-span-2">
              <label className="block text-[calc(var(--index)*0.4)] text-slate-500 font-medium mb-[calc(var(--index)*0.2)]">Сумма (₽)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/50 border border-white/80 focus:bg-white focus:border-[#4C5A7A] rounded-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] outline-none transition-all text-[calc(var(--index)*0.6)] font-semibold text-slate-800" />
            </div>

            <div>
              <label className="block text-[calc(var(--index)*0.4)] text-slate-500 font-medium mb-[calc(var(--index)*0.2)]">Категория</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white/50 border border-white/80 focus:bg-white focus:border-[#4C5A7A] rounded-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] outline-none transition-all text-[calc(var(--index)*0.45)] text-slate-700 cursor-pointer">
                {(type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[calc(var(--index)*0.4)] text-slate-500 font-medium mb-[calc(var(--index)*0.2)]">Дата</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-white/50 border border-white/80 focus:bg-white focus:border-[#4C5A7A] rounded-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] outline-none transition-all text-[calc(var(--index)*0.45)] text-slate-700 cursor-pointer" />
            </div>

            {/* ДОБАВЛЕНО: Анимированное предупреждение о превышении бюджета */}
            <AnimatePresence>
              {budgetWarning && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 'calc(var(--index)*0.2)' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="col-span-2 overflow-hidden"
                >
                  <div className="flex items-center gap-[calc(var(--index)*0.3)] bg-red-50 text-red-600 px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.3)] rounded-[calc(var(--index)*0.3)] border border-red-100">
                    <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-[calc(var(--index)*0.4)] font-medium leading-tight">
                      {budgetWarning}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="col-span-2 mt-[calc(var(--index)*0.2)]">
              <label className="block text-[calc(var(--index)*0.4)] text-slate-500 font-medium mb-[calc(var(--index)*0.2)]">Название транзакции</label>
              <input type="text" value={counterparty} onChange={(e) => setCounterparty(e.target.value)} placeholder="Например: Зарплата за март" className="w-full bg-white/50 border border-white/80 focus:bg-white focus:border-[#4C5A7A] rounded-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] outline-none transition-all text-[calc(var(--index)*0.5)] text-slate-700" />
            </div>

            <div className="col-span-2">
              <label className="block text-[calc(var(--index)*0.4)] text-slate-500 font-medium mb-[calc(var(--index)*0.2)]">Подтверждающий документ</label>
              <label className="relative flex flex-col items-center justify-center w-full bg-white/40 border-2 border-dashed border-slate-300 hover:border-[#4C5A7A]/50 hover:bg-white/60 rounded-[calc(var(--index)*0.4)] py-[calc(var(--index)*0.8)] cursor-pointer transition-all">
                <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" />
                {fileName ? (
                  <div className="flex items-center gap-2 text-[#4C5A7A]">
                    <svg className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[calc(var(--index)*0.5)] font-medium">{fileName}</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)] text-slate-400 mb-[calc(var(--index)*0.2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span className="text-[calc(var(--index)*0.45)] text-slate-500">Прикрепить чек, акт или счет (PDF, Image)</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <button onClick={handleSave} className="w-full bg-[#4C5A7A] hover:bg-[#3b465e] text-white font-medium py-[calc(var(--index)*0.5)] rounded-[calc(var(--index)*0.4)] transition-colors mt-[calc(var(--index)*0.2)] text-[calc(var(--index)*0.55)] cursor-pointer shadow-md">
            {initialData ? 'Сохранить изменения' : 'Сохранить транзакцию'}
          </button>

        </motion.div>
      </motion.div>
    </AnimatePresence>
>>>>>>> 17c35ee (Modern Finance)
  );

  return createPortal(modalContent, document.body);
};

export default TransactionModal;