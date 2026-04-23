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

  return (
    <div className="flex bg-white/30 backdrop-blur-md border border-white/50 rounded-[calc(var(--index)*0.4)] shadow-sm w-fit mb-[calc(var(--index)*0.5)] overflow-hidden">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setPeriod(tab.id)}
          className={`px-[calc(var(--index)*0.8)] py-[calc(var(--index)*0.3)] text-[calc(var(--index)*0.45)] font-medium transition-all border-r border-white/30 last:border-r-0 ${
            period === tab.id 
              ? 'bg-[#4C5A7A] text-white shadow-md' // Активная кнопка (синяя)
              : 'text-[#475569] hover:bg-white/40'  // Неактивная кнопка (прозрачная)
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default PeriodSwitcher;