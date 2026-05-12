import React from 'react';
import Sidebar from '../components/Sidebar';
import BalanceCard from '../components/BalanceCard';

// Эти компоненты мы создадим следом:
// import CategoryBudget from '../components/CategoryBudget';
import CategoryBudget from '../components/CategoryBudget'; // ИМПОРТ ДОБАВЛЕН
import FinanceTransactions from '../components/FinanceTransactions';

const Finance = () => {
  return (
    <div className="h-screen w-full flex overflow-hidden p-[calc(var(--index)*1.5)] bg-[#f1f5f9]">
      <Sidebar />

      <main className="flex-1 flex flex-col h-full min-h-0 ml-[calc(var(--index)*2)]">
        <div className="flex-1 grid grid-cols-12 gap-[calc(var(--index)*1.5)] h-full min-h-0">
          
          {/* ЛЕВАЯ КОЛОНКА */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-[calc(var(--index)*1.5)] h-full min-h-0">
            <BalanceCard />
            {/* Сюда позже вставим блок "Бюджет по категориям" */}
            {/* <CategoryBudget /> */}
          </div>

          {/* ПРАВАЯ КОЛОНКА */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col h-full min-h-0">
            {/* Главный блок с графиком и списком */}
            <FinanceTransactions />
          </div>

        </div>
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