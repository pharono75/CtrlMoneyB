import React from 'react';
import Sidebar from '../components/Sidebar';
import BalanceCard from '../components/BalanceCard';
import CategoryBudget from '../components/CategoryBudget'; // ИМПОРТ ДОБАВЛЕН
import FinanceTransactions from '../components/FinanceTransactions';

const Finance = () => {
  return (
    // Добавили overflow-hidden, чтобы зафиксировать экран
    <div className="min-h-screen bg-[#dcdde1] flex p-6 gap-6 font-sans text-slate-800 overflow-hidden">
      
      {/* Сайдбар появляется первым */}
      <div className="animate-fade-in-up shrink-0 h-[calc(100vh-3rem)]">
        <Sidebar />
      </div>

      <main className="flex-1 grid grid-cols-12 gap-6 h-[calc(100vh-3rem)]">
        
        {/* ЛЕВАЯ КОЛОНКА (Задержка 100ms) */}
        {/* Добавили overflow-y-auto, чтобы лимиты можно было скроллить, если их много */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6 h-full overflow-y-auto no-scrollbar animate-fade-in-up delay-100 pb-2">
          <BalanceCard />
          <CategoryBudget /> {/* РАСКОММЕНТИРОВАНО */}
        </div>

        {/* ПРАВАЯ КОЛОНКА (Задержка 200ms) */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-6 h-full animate-fade-in-up delay-200">
          <FinanceTransactions />
        </div>

      </main>
    </div>
  );
};

export default Finance;