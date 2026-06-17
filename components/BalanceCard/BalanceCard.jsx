import React, { useState } from 'react';
import BalanceHeader from './BalanceHeader';
import PeriodSwitcher from '../PeriodSwitcher';
import BalanceStats from './BalanceStats';
import AddTransactionBtn from './AddTransactionBtn';
import TransactionModal from './TransactionModal';

const BalanceCard = ({ hideAddButton = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="bg-white/50 dark:bg-black/40 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] mobile:rounded-3xl border border-white/50 dark:border-white/10 p-[calc(var(--index)*0.8)] mobile:p-5 shadow-lg flex flex-col h-fit w-full">
        <div className="order-1">
          <BalanceHeader />
        </div>

        <div className="order-2 mobile:order-3">
          <PeriodSwitcher />
        </div>

        <div className="order-3 mobile:order-2 mobile:mb-3">
          <BalanceStats />
        </div>

        {!hideAddButton && (
          <div className="order-4 mt-[calc(var(--index)*0.4)] mobile:mt-0 mobile:hidden">
            <AddTransactionBtn onClick={() => setIsModalOpen(true)} />
          </div>
        )}
      </section>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default BalanceCard;
