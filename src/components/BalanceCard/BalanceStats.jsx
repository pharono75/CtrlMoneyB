import React from 'react';
import ArrowUp from '../../assets/arrowup.svg?react';
import ArrowDown from '../../assets/arrowdown.svg?react';

const BalanceStats = () => {
  return (
    <div className="flex flex-col gap-idx-2 w-full">
      
      {/* Ряд Доход / Расход */}
      <div className="grid grid-cols-2 gap-idx-2">
        {/* Карточка Дохода */}
        <div className="bg-white/50 backdrop-blur-md rounded-idx-xl p-idx-3 border border-white/60 shadow-sm flex flex-col gap-idx-1">
          <span className="text-idx-sm font-medium text-secondary/80">Доход</span>
          <div className="flex items-center gap-idx-0.5 text-idx-xl font-medium text-secondary">
            <ArrowUp className="w-idx-icon h-idx-icon text-blue-500" />
            1 452 000₽
          </div>
        </div>

        {/* Карточка Расхода */}
        <div className="bg-white/50 backdrop-blur-md rounded-idx-xl p-idx-3 border border-white/60 shadow-sm flex flex-col gap-idx-1">
          <span className="text-idx-sm font-medium text-secondary/80">Расход</span>
          <div className="flex items-center gap-idx-0.5 text-idx-xl font-medium text-secondary">
            <ArrowDown className="w-idx-icon h-idx-icon text-purple-500" />
            987 400₽
          </div>
        </div>
      </div>

      {/* ... остальной код без изменений ... */}
      <div className="bg-white/40 backdrop-blur-md rounded-idx-xl p-idx-3 border border-white/60 shadow-sm flex flex-col gap-idx-2">
        <div className="flex flex-col gap-idx-0.5">
          <span className="text-idx-sm font-medium text-secondary/80">Прибыль</span>
          <span className="text-idx-2xl font-medium text-secondary">464 600₽</span>
        </div>
        
        <div className="w-full h-[calc(var(--index)*0.5)] bg-white/60 rounded-idx-full overflow-hidden shadow-inner flex">
          <div className="w-[45%] h-full bg-primary-icon rounded-idx-full"></div>
        </div>
      </div>

    </div>
  );
};

export default BalanceStats;