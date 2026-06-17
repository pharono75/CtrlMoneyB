import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import MoneyDisplay from '../Common/MoneyDisplay'; // Импортируем наш компонент

const BalanceHeader = () => {
  const { balance } = useFinance();

  return (
    <div className="flex flex-col mobile:items-center mobile:text-center gap-[calc(var(--index)*0.15)] mb-[calc(var(--index)*0.5)] mobile:mb-3">
      <span className="text-[#64748b] dark:text-white/60 text-[calc(var(--index)*0.45)] mobile:text-sm font-medium">
        Баланс компании
      </span>
      <h2 className="text-[#1e293b] dark:text-white text-[calc(var(--index)*1.2)] mobile:text-[1.75rem] tracking-tight font-semibold">
        <MoneyDisplay amount={balance} />
      </h2>
    </div>
  );
};

export default BalanceHeader;