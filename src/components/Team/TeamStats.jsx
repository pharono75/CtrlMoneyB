import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Users, Umbrella, DollarSign } from 'lucide-react';
import BalanceCard from '../BalanceCard';

const TeamStats = ({ list, departments, onOpenAdd }) => {
  const salaryFund = useMemo(() => list.reduce((sum, emp) => sum + Number(emp.salary || 0), 0), [list]);

  return (
    <>
      <BalanceCard />

      <div className="bg-white/60 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/80 p-[calc(var(--index)*0.8)] shadow-sm flex flex-col shrink-0">
        <div className="grid grid-cols-2 gap-[calc(var(--index)*0.4)] mb-5">
          <div className="bg-white/60 rounded-[calc(var(--index)*0.5)] p-[calc(var(--index)*0.5)] border border-white/80 shadow-sm flex flex-col gap-1">
            <span className="text-[calc(var(--index)*0.4)] font-semibold text-slate-600">Всего сотрудников</span>
            <div className="flex items-center gap-2 text-[calc(var(--index)*0.8)] font-bold text-[#1e293b]">
              <User className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-[#4C5A7A]" /> {list.length}
            </div>
          </div>
          
          <div className="bg-white/60 rounded-[calc(var(--index)*0.5)] p-[calc(var(--index)*0.5)] border border-white/80 shadow-sm flex flex-col gap-1">
            <span className="text-[calc(var(--index)*0.4)] font-semibold text-slate-600">Отделов</span>
            <div className="flex items-center gap-2 text-[calc(var(--index)*0.8)] font-bold text-[#1e293b]">
              <Users className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-[#767d8f]" /> {departments.length}
            </div>
          </div>

          <div className="bg-white/60 rounded-[calc(var(--index)*0.5)] p-[calc(var(--index)*0.5)] border border-white/80 shadow-sm flex flex-col gap-1">
            <span className="text-[calc(var(--index)*0.4)] font-semibold text-slate-600">Фонд зарплаты</span>
            <div className="flex items-center gap-2 text-[calc(var(--index)*0.65)] font-bold text-[#1e293b] truncate">
              <div className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] rounded-full bg-[#4C5A7A]/10 flex items-center justify-center shrink-0">
                <DollarSign className="w-[calc(var(--index)*0.35)] h-[calc(var(--index)*0.35)] text-[#4C5A7A]" />
              </div>
              {salaryFund.toLocaleString('ru-RU')} ₽
            </div>
          </div>

          <div className="bg-white/60 rounded-[calc(var(--index)*0.5)] p-[calc(var(--index)*0.5)] border border-white/80 shadow-sm flex flex-col gap-1">
            <span className="text-[calc(var(--index)*0.4)] font-semibold text-slate-600">В отпуске</span>
            <div className="flex items-center gap-2 text-[calc(var(--index)*0.8)] font-bold text-[#1e293b]">
              <Umbrella className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-[#767d8f]" /> 1
            </div>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onOpenAdd}
          className="w-full py-[calc(var(--index)*0.6)] bg-white/70 hover:bg-white text-[#4C5A7A] text-[calc(var(--index)*0.5)] font-semibold rounded-[calc(var(--index)*0.5)] border border-white/80 transition-colors shadow-sm"
        >
          Добавить сотрудника
        </motion.button>
      </div>
    </>
  );
};

export default TeamStats;