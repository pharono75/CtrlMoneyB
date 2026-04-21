import React from 'react';

const BalanceHeader = () => {
  return (
    <div className="flex flex-col gap-idx-0.5">
      <span className="text-idx-sm font-medium text-secondary/70">
        Баланс компании
      </span>
      <h2 className="text-idx-3xl font-bold text-secondary tracking-tight">
        2 847 312₽
      </h2>
    </div>
  );
};

export default BalanceHeader;