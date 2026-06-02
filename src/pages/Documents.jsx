import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import BalanceCard from '../components/BalanceCard'; // БЕРЕМ УЖЕ ГОТОВЫЙ КОМПОНЕНТ ИЗ ПРОЕКТА!
import DocumentStats from '../components/Documents/DocumentStats';
import DocumentList from '../components/Documents/DocumentList';

const Documents = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#dcdde1] flex p-6 gap-6 font-sans text-slate-800 overflow-hidden">
      <Sidebar />

      <main className="flex-1 grid grid-cols-12 gap-6 h-[calc(100vh-3rem)]">
        
        {/* ЛЕВАЯ КОЛОНКА (Баланс + Статистика доков) */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6 h-full overflow-y-auto no-scrollbar animate-fade-in-up delay-100 pb-2">
          {/* ИСПОЛЬЗУЕМ СУЩЕСТВУЮЩИЙ МОДУЛЬ БАЛАНСА ИЗ ПРОЕКТА */}
          <BalanceCard /> 
          {/* НОВЫЙ МОДУЛЬ СТАТИСТИКИ */}
          <DocumentStats />
        </div>

        {/* ПРАВАЯ КОЛОНКА (Список документов) */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-6 h-full animate-fade-in-up delay-200">
          <DocumentList />
        </div>

      </main>
    </motion.div>
  );
};

export default Documents;