import React from 'react';
import { useFinance } from '../../context/FinanceContext';

const BalanceHeader = () => {
  const { balance } = useFinance();
  const formatMoney = (amount) => amount.toLocaleString('ru-RU') + '₽';

  return (
    <div className="flex flex-col gap-[calc(var(--index)*0.15)] mb-[calc(var(--index)*0.5)]">
      <span className="text-[#64748b] text-[calc(var(--index)*0.45)] font-medium">
        Баланс компании
      </span>
      <h2 className="text-[#1e293b] text-[calc(var(--index)*1.2)] font- tracking-tight">
        {formatMoney(balance)}
      </h2>
    </div>
  );
};

export default BalanceHeader;