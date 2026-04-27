import React from 'react';
import { useFinance } from '../../context/FinanceContext';

const BalanceStats = () => {
  // 1. Достаем переменные именно за выбранный период!
  const { periodIncome, periodExpense } = useFinance();
  
  // 2. Считаем прибыль на основе этих переменных
  const profit = periodIncome - periodExpense;
  const profitPercent = periodIncome > 0 ? Math.max(0, Math.round((profit / periodIncome) * 100)) : 0;

  const formatMoney = (amount) => amount.toLocaleString('ru-RU') + '₽';

  return (
    <div className="flex flex-col gap-[calc(var(--index)*0.5)] w-full">
      <div className="flex gap-[calc(var(--index)*0.5)]">
        {/* Карточка Дохода */}
        <div className="flex-1 bg-white/30 backdrop-blur-md rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.5)] border border-white/50 shadow-sm flex flex-col gap-[calc(var(--index)*0.2)]">
          <span className="text-[#475569] text-[calc(var(--index)*0.45)] font-medium">Доход</span>
          <div className="flex items-center gap-[calc(var(--index)*0.2)] text-[#1e293b] text-[calc(var(--index)*0.65)] font-medium">
            <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {/* Используем periodIncome */}
            {formatMoney(periodIncome)}
          </div>
        </div>

        {/* Карточка Расхода */}
        <div className="flex-1 bg-white/30 backdrop-blur-md rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.5)] border border-white/50 shadow-sm flex flex-col gap-[calc(var(--index)*0.2)]">
          <span className="text-[#475569] text-[calc(var(--index)*0.45)] font-medium">Расход</span>
          <div className="flex items-center gap-[calc(var(--index)*0.2)] text-[#1e293b] text-[calc(var(--index)*0.65)] font-medium">
            <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            {/* Используем periodExpense */}
            {formatMoney(periodExpense)}
          </div>
        </div>
      </div>

      {/* Блок Прибыли */}
      <div className="bg-white/30 backdrop-blur-md rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.5)] border border-white/50 shadow-sm flex flex-col gap-[calc(var(--index)*0.4)]">
        <div className="flex flex-col">
          <span className="text-[#1e293b] text-[calc(var(--index)*0.45)] font-medium mb-[calc(var(--index)*0.1)]">Прибыль</span>
          <span className="text-[#1e293b] text-[calc(var(--index)*0.8)] font-medium">
            {formatMoney(profit)}
          </span>
        </div>
        
        <div className="w-full h-[calc(var(--index)*0.25)] bg-white/60 border border-white/80 rounded-full overflow-hidden flex shadow-inner">
          <div 
            className="h-full bg-[#4C5A7A] rounded-full transition-all duration-[800ms] ease-[cubic-bezier(0.03,0.74,1,1.01)]"
            style={{ width: `${profitPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default BalanceStats;