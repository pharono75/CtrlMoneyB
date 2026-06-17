import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Users, Umbrella, DollarSign } from 'lucide-react';
import BalanceCard from '../BalanceCard';

const TeamStats = ({ list, departments, onOpenAdd }) => {
  const salaryFund = useMemo(() => list.reduce((sum, emp) => sum + Number(emp.salary || 0), 0), [list]);

  return (
    <>
      <BalanceCard />

      <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/80 dark:border-white/10 p-[calc(var(--index)*0.8)] shadow-sm flex flex-col shrink-0">
        <div className="grid grid-cols-2 gap-[calc(var(--index)*0.4)] mb-5">
          <div className="bg-white/60 dark:bg-white/10 rounded-[calc(var(--index)*0.5)] p-[calc(var(--index)*0.5)] border border-white/80 dark:border-white/10 shadow-sm flex flex-col gap-1">
            <span className="text-[calc(var(--index)*0.4)] font-semibold text-slate-600 dark:text-white/60">Всего сотрудников</span>
            <div className="flex items-center gap-2 text-[calc(var(--index)*0.8)] font-bold text-[#1e293b] dark:text-white">
              <User className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-[#4C5A7A]" /> {list.length}
            </div>
          </div>
          
          <div className="bg-white/60 dark:bg-white/10 rounded-[calc(var(--index)*0.5)] p-[calc(var(--index)*0.5)] border border-white/80 dark:border-white/10 shadow-sm flex flex-col gap-1">
            <span className="text-[calc(var(--index)*0.4)] font-semibold text-slate-600 dark:text-white/60">Отделов</span>
            <div className="flex items-center gap-2 text-[calc(var(--index)*0.8)] font-bold text-[#1e293b] dark:text-white">
              <Users className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-[#767d8f]" /> {departments.length}
            </div>
          </div>

          <div className="bg-white/60 dark:bg-white/10 rounded-[calc(var(--index)*0.5)] p-[calc(var(--index)*0.5)] border border-white/80 dark:border-white/10 shadow-sm flex flex-col gap-1">
            <span className="text-[calc(var(--index)*0.4)] font-semibold text-slate-600 dark:text-white/60">Фонд зарплаты</span>
            <div className="flex items-center gap-2 text-[calc(var(--index)*0.65)] font-bold text-[#1e293b] dark:text-white truncate">
              <div className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] rounded-full bg-[#4C5A7A]/10 dark:bg-white/10 flex items-center justify-center shrink-0">
                <DollarSign className="w-[calc(var(--index)*0.35)] h-[calc(var(--index)*0.35)] text-[#4C5A7A]" />
              </div>
              {salaryFund.toLocaleString('ru-RU')} ₽
            </div>
          </div>

          <div className="bg-white/60 dark:bg-white/10 rounded-[calc(var(--index)*0.5)] p-[calc(var(--index)*0.5)] border border-white/80 dark:border-white/10 shadow-sm flex flex-col gap-1">
            <span className="text-[calc(var(--index)*0.4)] font-semibold text-slate-600 dark:text-white/60">В отпуске</span>
            <div className="flex items-center gap-2 text-[calc(var(--index)*0.8)] font-bold text-[#1e293b] dark:text-white">
              <Umbrella className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-[#767d8f]" /> 1
            </div>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onOpenAdd}
          className="w-full py-[calc(var(--index)*0.6)] bg-white/70 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-[#4C5A7A] dark:text-white text-[calc(var(--index)*0.5)] font-semibold rounded-[calc(var(--index)*0.5)] border border-white/80 dark:border-white/10 transition-colors shadow-sm"
        >
          Добавить сотрудника
        </motion.button>
      </div>
    </>
  );
};

export default TeamStats;