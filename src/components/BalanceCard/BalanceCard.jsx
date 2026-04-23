import React, { useState } from 'react';
import BalanceHeader from './BalanceHeader';
import PeriodSwitcher from '../PeriodSwitcher'; // Импортируем переключатель
import BalanceStats from './BalanceStats';
import AddTransactionBtn from './AddTransactionBtn';
import TransactionModal from './TransactionModal';

const BalanceCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="bg-white/40 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/50 p-[calc(var(--index)*0.8)] shadow-lg flex flex-col h-fit w-full">
        <BalanceHeader />
        
        {/* Вставляем переключатель сюда */}
        <PeriodSwitcher />
        <BalanceStats />
        
        <div className="mt-[calc(var(--index)*0.4)]">
          <AddTransactionBtn onClick={() => setIsModalOpen(true)} />
        </div>
      </section>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default BalanceCard;