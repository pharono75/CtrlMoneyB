import React from 'react';
import Sidebar from '../components/Sidebar';
import BalanceCard from '../components/BalanceCard';
// Эти компоненты мы создадим следом:
// import CategoryBudget from '../components/CategoryBudget';
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
      </main>
    </div>
  );
};

export default Finance;