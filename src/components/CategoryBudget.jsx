import React, { useState, useMemo, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { getCategoryIcon, EXPENSE_CATEGORIES } from '../constants/categories';

const CategoryBudget = () => {
  const { transactions } = useFinance();
  
  // 1. ЗАГРУЗКА И СОХРАНЕНИЕ (БЕЗ ЗАТЫЧЕК!)
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('ctrlmoney_budgets');
    return saved ? JSON.parse(saved) : []; // Чистый пустой массив по дефолту
  });

  useEffect(() => {
    localStorage.setItem('ctrlmoney_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Состояния интерактива
  const [editCategory, setEditCategory] = useState(null); // 'NEW' для нового, или имя категории для редактирования
  const [formAmount, setFormAmount] = useState('');
  const [formSelectedCat, setFormSelectedCat] = useState('');

  // 2. РАСЧЕТ ТРАТ (Динамика прогресс-баров)
  const budgetStats = useMemo(() => {
    if (!budgets || budgets.length === 0) return [];

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
      
      let color = 'bg-[#4C5A7A]';
      if (percent > 90) color = 'bg-red-500';
      else if (percent > 60) color = 'bg-amber-500';
      else if (percent > 0) color = 'bg-emerald-500';

      return { ...b, spent, percent, color };
    });
  }, [transactions, budgets]);

  // Свободные категории (на которые еще нет лимита)
  const availableCategories = useMemo(() => {
    return EXPENSE_CATEGORIES.filter(c => !budgets.some(b => b.category === c));
  }, [budgets]);

  // --- ОБРАБОТЧИКИ ---
  const openEdit = (cat, currentLimit) => {
    setEditCategory(cat);
    setFormAmount(currentLimit.toString());
  };

  const openAdd = () => {
    if (availableCategories.length === 0) return; 
    setEditCategory('NEW');
    setFormSelectedCat(availableCategories[0]);
    setFormAmount('');
  };

  const cancelEdit = () => {
    setEditCategory(null);
    setFormAmount('');
  };

  const saveBudget = (e) => {
    e.preventDefault();
    const amount = Number(formAmount);
    if (!amount || amount <= 0) return;

    if (editCategory === 'NEW') {
      setBudgets(prev => [...prev, { category: formSelectedCat, limit: amount }]);
    } else {
      setBudgets(prev => prev.map(b => b.category === editCategory ? { ...b, limit: amount } : b));
    }
    cancelEdit();
  };

  const deleteBudget = (cat) => {
    setBudgets(prev => prev.filter(b => b.category !== cat));
    cancelEdit();
  };

  return (
    <section className="bg-white/50 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/40 p-[calc(var(--index)*1.2)] shadow-sm w-full flex flex-col gap-[calc(var(--index)*1)] animate-fade-in-up">
      
      {/* ШАПКА БЛОКА */}
      <div className="flex items-center justify-between">
        <h2 className="text-[#1e293b] text-[calc(var(--index)*0.7)] font-bold tracking-tight">
          Лимиты и бюджеты
        </h2>
        <div className="w-[calc(var(--index)*1.2)] h-[calc(var(--index)*1.2)] bg-[#4C5A7A]/10 rounded-full flex items-center justify-center">
           <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-[#4C5A7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
           </svg>
        </div>
      </div>

      {/* ПУСТОЕ СОСТОЯНИЕ (Если нет лимитов и не открыта форма добавления) */}
      {budgetStats.length === 0 && editCategory !== 'NEW' && (
        <div className="flex flex-col items-center justify-center py-[calc(var(--index)*1)] text-center">
          <div className="w-[calc(var(--index)*2.5)] h-[calc(var(--index)*2.5)] mb-[calc(var(--index)*0.5)] rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-[calc(var(--index)*1.2)] h-[calc(var(--index)*1.2)] text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
            </svg>
          </div>
          <span className="text-[#1e293b] font-medium text-[calc(var(--index)*0.5)]">Нет активных лимитов</span>
          <span className="text-slate-400 text-[calc(var(--index)*0.4)] mt-1">Добавьте первый бюджет для контроля расходов</span>
        </div>
      )}

      {/* СПИСОК БЮДЖЕТОВ */}
      {budgetStats.length > 0 && (
        <div className="flex flex-col gap-[calc(var(--index)*0.8)]">
          {budgetStats.map((item, idx) => (
            <div key={item.category} className="snake-item" style={{ animationDelay: `${idx * 80}ms` }}>
              
              {editCategory === item.category ? (
                // РЕЖИМ РЕДАКТИРОВАНИЯ
                <form onSubmit={saveBudget} className="flex items-center gap-[calc(var(--index)*0.4)] bg-white/70 p-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.5)] border border-white/80 shadow-sm animate-fade-in-up">
                  <div className="w-[calc(var(--index)*1.4)] h-[calc(var(--index)*1.4)] rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    {getCategoryIcon(item.category, '', "w-[calc(var(--index)*0.7)] h-[calc(var(--index)*0.7)] text-[#4C5A7A]")}
                  </div>
                  
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-slate-500 text-[calc(var(--index)*0.35)] font-semibold uppercase">{item.category}</span>
                    <input 
                      type="number"
                      autoFocus
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      className="w-full bg-transparent border-b border-slate-300 focus:border-[#4C5A7A] outline-none text-[#1e293b] text-[calc(var(--index)*0.5)] font-bold p-0 mt-1 transition-colors"
                      placeholder="Новый лимит..."
                    />
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => deleteBudget(item.category)} className="w-[calc(var(--index)*1.2)] h-[calc(var(--index)*1.2)] flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors active-press">
                      <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <button type="submit" className="w-[calc(var(--index)*1.2)] h-[calc(var(--index)*1.2)] flex items-center justify-center text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors active-press">
                      <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button type="button" onClick={cancelEdit} className="w-[calc(var(--index)*1.2)] h-[calc(var(--index)*1.2)] flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors active-press">
                      <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </form>
              ) : (
                // РЕЖИМ ПРОСМОТРА
                <div 
                  className="group cursor-pointer p-[calc(var(--index)*0.3)] -mx-[calc(var(--index)*0.3)] rounded-[calc(var(--index)*0.5)] hover:bg-white/40 transition-colors"
                  onClick={() => openEdit(item.category, item.limit)}
                >
                  <div className="flex items-center justify-between mb-[calc(var(--index)*0.3)]">
                    <div className="flex items-center gap-[calc(var(--index)*0.4)]">
                      <div className="w-[calc(var(--index)*1.4)] h-[calc(var(--index)*1.4)] rounded-full bg-white/60 border border-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        {getCategoryIcon(item.category, '', "w-[calc(var(--index)*0.7)] h-[calc(var(--index)*0.7)] text-[#4C5A7A]")}
                      </div>
                      <span className="text-[#475569] text-[calc(var(--index)*0.45)] font-semibold uppercase tracking-wider group-hover:text-[#4C5A7A] transition-colors">
                        {item.category}
                      </span>
                      <svg className="w-[calc(var(--index)*0.5)] h-[calc(var(--index)*0.5)] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <div className="text-right">
                      <span className="text-[#1e293b] text-[calc(var(--index)*0.5)] font-bold">
                        {item.spent.toLocaleString('ru-RU')}
                      </span>
                      <span className="text-slate-400 text-[calc(var(--index)*0.4)] font-medium">
                        {' '}/ {item.limit.toLocaleString('ru-RU')}₽
                      </span>
                    </div>
                  </div>

                  <div className="h-[calc(var(--index)*0.35)] w-full bg-slate-200/50 rounded-full overflow-hidden border border-white/20 shadow-inner">
                    <div 
                      className={`h-full ${item.color} rounded-full transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)] shadow-sm`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ФОРМА ДОБАВЛЕНИЯ НОВОГО ЛИМИТА */}
      {editCategory === 'NEW' ? (
        <form onSubmit={saveBudget} className="mt-[calc(var(--index)*0.5)] bg-white/70 p-[calc(var(--index)*0.6)] rounded-[calc(var(--index)*0.6)] border border-white/80 shadow-md animate-fade-in-up">
          <div className="mb-[calc(var(--index)*0.4)]">
            <label className="text-[calc(var(--index)*0.35)] text-slate-500 font-semibold uppercase ml-1">Категория</label>
            <select 
              value={formSelectedCat}
              onChange={e => setFormSelectedCat(e.target.value)}
              className="w-full mt-1 bg-white/80 border border-slate-200 focus:border-[#4C5A7A] focus:ring-1 focus:ring-[#4C5A7A] rounded-[calc(var(--index)*0.3)] text-[calc(var(--index)*0.45)] text-[#1e293b] font-medium p-[calc(var(--index)*0.3)] outline-none transition-all"
            >
              {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="mb-[calc(var(--index)*0.6)]">
            <label className="text-[calc(var(--index)*0.35)] text-slate-500 font-semibold uppercase ml-1">Лимит (₽)</label>
            <input 
              type="number" 
              autoFocus
              placeholder="0"
              value={formAmount}
              onChange={e => setFormAmount(e.target.value)}
              className="w-full mt-1 bg-white/80 border border-slate-200 focus:border-[#4C5A7A] focus:ring-1 focus:ring-[#4C5A7A] rounded-[calc(var(--index)*0.3)] text-[calc(var(--index)*0.45)] text-[#1e293b] font-bold p-[calc(var(--index)*0.3)] outline-none transition-all"
            />
          </div>
          <div className="flex gap-[calc(var(--index)*0.4)]">
            <button type="submit" className="flex-1 py-[calc(var(--index)*0.35)] bg-[#4C5A7A] hover:bg-[#3d4b63] text-white rounded-[calc(var(--index)*0.3)] font-bold text-[calc(var(--index)*0.45)] transition-colors active-press flex items-center justify-center gap-1">
              <svg className="w-[calc(var(--index)*0.5)] h-[calc(var(--index)*0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Сохранить
            </button>
            <button type="button" onClick={cancelEdit} className="shrink-0 px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.35)] bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-[calc(var(--index)*0.3)] font-bold text-[calc(var(--index)*0.45)] transition-colors active-press">
              Отмена
            </button>
          </div>
        </form>
      ) : (
        <button 
          onClick={openAdd}
          disabled={availableCategories.length === 0}
          className={`mt-auto w-full py-[calc(var(--index)*0.5)] rounded-[calc(var(--index)*0.4)] text-[calc(var(--index)*0.5)] font-bold transition-all shadow-sm active-press flex items-center justify-center gap-2 ${
            availableCategories.length === 0 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-[#4C5A7A] hover:bg-[#3d4b63] text-white shadow-md hover:shadow-lg'
          }`}
        >
          <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {availableCategories.length === 0 ? 'Все лимиты установлены' : 'Добавить лимит'}
        </button>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes snakePop {
          0% { opacity: 0; transform: translateY(15px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .snake-item {
          opacity: 0;
          animation: snakePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}} />
    </section>
  );
};

export default CategoryBudget;