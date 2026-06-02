import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar'; // Проверьте правильность пути до Sidebar
import TeamScreen from '../components/Team/TeamScreen'; // Путь до компонента, который мы создали

const Team = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#dcdde1] flex p-6 gap-6 font-sans text-slate-800">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden h-[calc(100vh-3rem)]">
        <TeamScreen />
      </main>
    </motion.div>
  );
};

export default Team;