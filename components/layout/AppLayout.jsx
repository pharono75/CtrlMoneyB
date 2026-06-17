import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar';
import MobileNav from '../MobileNav';
import MobileHeader from './MobileHeader';

const AppLayout = ({ children, mainClassName = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-transparent flex flex-col mobile:pb-safe-nav font-sans text-slate-800 dark:text-white transition-colors duration-500"
    >
      <div className="flex flex-1 p-6 gap-6 mobile:p-0 mobile:px-4 mobile:pt-3 mobile:gap-0 min-h-0">
        <Sidebar />

        <div className="flex flex-col flex-1 min-w-0 min-h-0">
          <MobileHeader />
          <main className={`flex-1 min-h-0 overflow-y-auto custom-scrollbar mobile:pr-0 ${mainClassName}`}>
            {children}
          </main>
        </div>
      </div>

      <MobileNav />
    </motion.div>
  );
};

export default AppLayout;
