import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import BalanceCard from '../components/BalanceCard';
import RecentTransactions from '../components/RecentTransactions';
import FinanceChart from '../components/FinanceChart'
import FinanceAnalysis from '../components/FinanceAnalysis';

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#dcdde1] flex p-6 gap-6 font-sans text-slate-800">
      <Sidebar />
      <main className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
          <BalanceCard />
          <RecentTransactions />
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
          
          {/* КАРТОЧКА ГРАФИКА (Жестко ограничиваем высоту здесь!) */}
          <div className="bg-white/40 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/50 p-[calc(var(--index)*1)] shadow-sm w-full h-[calc(var(--index)*18)] lg:h-[calc(var(--index)*15)]">
            <FinanceChart />
          </div>

          {/* Блок анализа финансов */}
          <div className="flex-1 min-h-0 max-h-[calc(var(--index)*18)]">
            <FinanceAnalysis />
          </div>
        </div>

      </main>
    </motion.div>
  );
};

export default Dashboard;