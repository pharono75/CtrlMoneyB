import React, { useState, useMemo, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { getCategoryIcon, EXPENSE_CATEGORIES } from '../constants/categories';
import BudgetModal from './BudgetModal';
import MoneyDisplay from './Common/MoneyDisplay';

const CategoryBudget = () => {
  const { transactions } = useFinance();
  
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('ctrlmoney_budgets');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null); 

  useEffect(() => {
    localStorage.setItem('ctrlmoney_budgets', JSON.stringify(budgets));
  }, [budgets]);

  const budgetStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return budgets.map(b => {
      const spent = transactions
        .filter(t => {
          const d = new Date(t.date);
          return t.type === 'expense' && 
                 t.category === b.category && 
                 d.getMonth() === currentMonth && 
                 d.getFullYear() === currentYear;
        })
        .reduce((acc, t) => acc + Number(t.amount), 0);

      const percent = Math.min(Math.round((spent / b.limit) * 100), 100);
      
      let colorClass = 'bg-[#4C5A7A]';
      if (percent > 90) colorClass = 'bg-red-500';
      else if (percent > 70) colorClass = 'bg-amber-500';

      return { ...b, spent, percent, colorClass };
    });
  }, [transactions, budgets]);

  const availableCategories = useMemo(() => {
    return EXPENSE_CATEGORIES.filter(c => !budgets.some(b => b.category === c));
  }, [budgets]);

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (budgetData) => {
    setEditingBudget(budgetData);
    setIsModalOpen(true);
  };

  // ОБНОВЛЕНО: Принимает oldCategory, чтобы знать, изменилось ли название
  const handleSaveBudget = (newCategory, amount, oldCategory) => {
    setBudgets(prev => {
      let updated = [...prev];

      // Если пользователь поменял категорию при редактировании — удаляем старую
      if (oldCategory && oldCategory !== newCategory) {
        updated = updated.filter(b => b.category !== oldCategory);
      }

      const exists = updated.find(b => b.category === newCategory);
      if (exists) {
        return updated.map(b => b.category === newCategory ? { ...b, limit: amount } : b);
      }
      
      return [...updated, { category: newCategory, limit: amount }];
    });
  };

  const handleDeleteBudget = (category) => {
    setBudgets(prev => prev.filter(b => b.category !== category));
  };

  return (
    <>
      <section className="bg-white/50 dark:bg-black/40 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/40 dark:border-white/10 p-[calc(var(--index)*1.2)] shadow-sm w-full font-sans flex flex-col">
        
        <h2 className="text-[#1e293b] dark:text-white text-[calc(var(--index)*0.7)] font-bold tracking-tight mb-[calc(var(--index)*1)]">
          Бюджет по категориям
        </h2>

        <div className="flex flex-col gap-[calc(var(--index)*0.4)]">
          {budgetStats.length === 0 ? (
            <div className="text-center py-[calc(var(--index)*1)] text-slate-400 dark:text-white/60 text-[calc(var(--index)*0.45)] font-medium">
              Нет установленных лимитов
            </div>
          ) : (
            budgetStats.map((item, idx) => (
              <div 
                key={item.category} 
                onClick={() => handleOpenEdit(item)}
                className="group flex flex-col animate-fade-in-up cursor-pointer p-[calc(var(--index)*0.4)] -mx-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.6)] hover:bg-white/40 dark:hover:bg-white/10 active:bg-white/60 dark:active:bg-white/20 transition-all duration-200"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex justify-between items-center mb-[calc(var(--index)*0.25)]">
                  <div className="flex items-center gap-[calc(var(--index)*0.3)]">
                    <div className="w-[calc(var(--index)*1.1)] h-[calc(var(--index)*1.1)] rounded-full bg-white/60 dark:bg-white/10 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {getCategoryIcon(item.category, '', "w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-[#4C5A7A] dark:text-white")}
                    </div>
                    <span className="text-[#1e293b] dark:text-white text-[calc(var(--index)*0.5)] font-semibold tracking-wide group-hover:text-[#4C5A7A] dark:group-hover:text-white/80 transition-colors">
                      {item.category}
                    </span>
                    <svg className="w-[calc(var(--index)*0.5)] h-[calc(var(--index)*0.5)] text-[#4C5A7A] dark:text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <span className="text-slate-500 dark:text-white/60 text-[calc(var(--index)*0.45)] font-semibold group-hover:text-[#4C5A7A] dark:group-hover:text-white/80 transition-colors">
                    {item.percent}%
                  </span>
                </div>

                <div className="h-[calc(var(--index)*0.35)] w-full bg-white/60 dark:bg-white/10 rounded-full relative mb-[calc(var(--index)*0.2)] shadow-inner border border-white/40 dark:border-white/10 overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full rounded-full ${item.colorClass} dark:bg-white transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] flex items-center justify-end pr-[2px]`}
                    style={{ width: `${item.percent}%` }}
                  >
                    {item.percent > 2 && (
                      <div className="w-[calc(var(--index)*0.2)] h-[calc(var(--index)*0.2)] bg-white rounded-full opacity-90 shadow-sm"></div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-[calc(var(--index)*0.4)] font-medium text-slate-400 dark:text-white/60 group-hover:text-slate-500 dark:group-hover:text-white/80 transition-colors gap-[calc(var(--index)*0.2)]">
                  <div className="flex items-center gap-0">
                    <MoneyDisplay amount={item.spent} className="text-[calc(var(--index)*0.4)] font-medium text-slate-400 dark:text-white/60 group-hover:text-slate-500 dark:group-hover:text-white/80" />
                  </div>
                  <div className="flex items-center gap-[calc(var(--index)*0.1)]">
                    <span>из</span>
                    <MoneyDisplay amount={item.limit} className="text-[calc(var(--index)*0.4)] font-medium text-slate-400 dark:text-white/60 group-hover:text-slate-500 dark:group-hover:text-white/80" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button 
          onClick={handleOpenAdd}
          disabled={availableCategories.length === 0}
          className="mt-[calc(var(--index)*0.8)] w-full py-[calc(var(--index)*0.5)] rounded-[calc(var(--index)*0.4)] border border-[#4C5A7A]/30 dark:border-white/20 text-[#4C5A7A] dark:text-white dark:hover:text-black text-[calc(var(--index)*0.5)] flex items-center justify-center gap-[calc(var(--index)*0.3)] hover:bg-white/40 dark:hover:bg-white transition-colors active-press disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white/5"
        >
          Добавить категорию
        </button>
      </section>

      <BudgetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveBudget}
        onDelete={handleDeleteBudget}
        availableCategories={availableCategories}
        initialData={editingBudget}
      />
    </>
  );
};

export default CategoryBudget;