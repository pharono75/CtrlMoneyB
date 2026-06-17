import React from 'react';
import { useFinance } from '../context/FinanceContext';

const PeriodSwitcher = () => {
  const { period, setPeriod } = useFinance();

  const tabs = [
    { id: 'month', label: 'Месяц' },
    { id: 'quarter', label: 'Квартал' },
    { id: 'year', label: 'Год' },
    { id: 'all', label: 'Все' }
  ];

  const activeIndex = tabs.findIndex(tab => tab.id === period);

  return (
    <div className="relative flex bg-white/25 dark:bg-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-[calc(var(--index)*0.4)] mobile:rounded-2xl shadow-sm w-full mb-[calc(var(--index)*0.5)] mobile:mb-0 overflow-hidden">
      <div 
        className="absolute top-0 bottom-0 left-0 w-1/4 bg-[#4C5A7A] dark:bg-white rounded-[calc(var(--index)*0.4)] shadow-md transition-transform duration-[400ms] ease-[cubic-bezier(0.03,0.74,1,1.01)]"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      ></div>

      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setPeriod(tab.id)}
          className={`flex-1 relative z-10 py-[calc(var(--index)*0.3)] text-[calc(var(--index)*0.45)] font-medium transition-colors duration-[150ms] ${
            period === tab.id 
              ? 'text-white dark:text-black' 
              : 'text-[#475569] dark:text-white/60 hover:text-[#1e293b] dark:hover:text-white'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default PeriodSwitcher;