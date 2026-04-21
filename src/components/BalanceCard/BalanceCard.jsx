import React from 'react';
import BalanceHeader from './BalanceHeader';
import BalanceStats from './BalanceStats';
import AddTransactionBtn from './AddTransactionBtn';

const BalanceCard = () => {
  return (
    <section className="bg-white/40 backdrop-blur-xl rounded-idx-2xl border border-white/40 p-idx-4 shadow-xl flex flex-col gap-idx-4 w-full h-full">
      <BalanceHeader />
      <BalanceStats />
      
      {/* Используем mt-auto чтобы оттолкнуть кнопку в самый низ, если карточка растянется */}
      <div className="mt-auto pt-idx-2">
        <AddTransactionBtn />
      </div>
    </section>
  );
};

export default BalanceCard;