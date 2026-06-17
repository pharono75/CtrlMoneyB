import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import BalanceCard from '../components/BalanceCard';
import CategoryBudget from '../components/CategoryBudget';
import FinanceTransactions from '../components/FinanceTransactions';

const Finance = () => {
  return (
    <AppLayout>
      <div className="grid grid-cols-12 gap-6 mobile:gap-4 h-[calc(100vh-3rem)] mobile:h-auto pr-2 mobile:pr-0">
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6 mobile:gap-4 h-full mobile:h-auto overflow-y-auto no-scrollbar pb-2">
          <BalanceCard />
          <CategoryBudget />
        </div>

        <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-6 mobile:gap-4 h-full mobile:h-auto">
          <FinanceTransactions />
        </div>
      </div>
    </AppLayout>
  );
};

export default Finance;
