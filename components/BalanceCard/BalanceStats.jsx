import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import MoneyDisplay from '../Common/MoneyDisplay';

const BalanceStats = () => {
  const { periodIncome, periodExpense } = useFinance();
  const profit = periodIncome - periodExpense;
  const profitPercent = periodIncome > 0 ? Math.max(0, Math.round((profit / periodIncome) * 100)) : 0;

  return (
    <>
      {/* Мобильные pill-статы */}
      <div className="hidden mobile:flex flex-wrap items-center justify-center gap-2 w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8ecf4]/90 dark:bg-white/10 border border-white/60 dark:border-white/10 text-[#1e293b] dark:text-white text-xs font-medium">
          <svg className="w-3.5 h-3.5 text-[#60a5fa] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <MoneyDisplay amount={periodIncome} className="text-xs font-medium" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8ecf4]/90 dark:bg-white/10 border border-white/60 dark:border-white/10 text-[#1e293b] dark:text-white text-xs font-medium">
          <svg className="w-3.5 h-3.5 text-[#a78bfa] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          <MoneyDisplay amount={periodExpense} className="text-xs font-medium" />
        </div>
        <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#e8ecf4]/90 dark:bg-white/10 border border-white/60 dark:border-white/10 text-[#1e293b] dark:text-white text-xs font-medium">
          <span className="text-[#64748b] dark:text-white/60">+</span>
          <MoneyDisplay amount={profit} className="text-xs font-medium" />
        </div>
      </div>

      {/* Десктопные карточки */}
      <div className="mobile:hidden flex flex-col gap-[calc(var(--index)*0.5)] w-full">
        <div className="flex gap-[calc(var(--index)*0.5)]">
          <div className="flex-1 bg-white/25 dark:bg-white/5 backdrop-blur-md rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.5)] border border-white/50 dark:border-white/10 shadow-sm flex flex-col gap-[calc(var(--index)*0.2)]">
            <span className="text-[#475569] dark:text-white/60 text-[calc(var(--index)*0.45)] font-medium">Доход</span>
            <div className="flex items-center gap-[calc(var(--index)*0.2)] text-[#1e293b] dark:text-white text-[calc(var(--index)*0.65)] font-medium">
              <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <MoneyDisplay amount={periodIncome} className="text-[#1e293b] dark:text-white text-[calc(var(--index)*0.65)] font-medium" />
            </div>
          </div>

          <div className="flex-1 bg-white/25 dark:bg-white/5 backdrop-blur-md rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.5)] border border-white/50 dark:border-white/10 shadow-sm flex flex-col gap-[calc(var(--index)*0.2)]">
            <span className="text-[#475569] dark:text-white/60 text-[calc(var(--index)*0.45)] font-medium">Расход</span>
            <div className="flex items-center gap-[calc(var(--index)*0.2)] text-[#1e293b] dark:text-white text-[calc(var(--index)*0.65)] font-medium">
              <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-[#a78bfa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <MoneyDisplay amount={periodExpense} className="text-[#1e293b] dark:text-white text-[calc(var(--index)*0.65)] font-medium" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 dark:bg-white/5 backdrop-blur-md rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.5)] border border-white/50 dark:border-white/10 shadow-sm flex flex-col gap-[calc(var(--index)*0.4)]">
          <div className="flex flex-col">
            <span className="text-[#1e293b] dark:text-white text-[calc(var(--index)*0.45)] font-medium mb-[calc(var(--index)*0.1)]">Прибыль</span>
            <MoneyDisplay amount={profit} className="text-[#1e293b] dark:text-white text-[calc(var(--index)*0.8)] font-medium" />
          </div>
          <div className="w-full h-[calc(var(--index)*0.25)] bg-[#EFEFEF]/25 border border-white/80 rounded-full overflow-hidden flex shadow-inner">
            <div
              className="h-full bg-[#4C5A7A] dark:bg-white rounded-full transition-all duration-[800ms] ease-[cubic-bezier(0.03,0.74,1,1.01)]"
              style={{ width: `${profitPercent}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BalanceStats;
