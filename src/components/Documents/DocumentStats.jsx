import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import DocIcon from '../../assets/doc.svg?react';
import CompleteDocIcon from '../../assets/complitedoc.svg?react';
import ClockIcon from '../../assets/clock.svg?react';
import DocMounthIcon from '../../assets/docmounth.svg?react';
import UploadModal from './Modals/UploadModal';

// Анимации для дочерних элементов (карточек)
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const DocumentStats = () => {
  const { transactions } = useFinance();
  const txDocsCount = useMemo(() => transactions.filter(t => t.fileName).length, [transactions]);
  const totalDocs = txDocsCount + 235; 

  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const handleUploadSubmit = (title, category, fileData, fileName) => {
    const newDoc = { 
      id: `up-${Date.now()}`, title, period: category, 
      date: new Date().toLocaleDateString('ru-RU'), signed: false, 
      url: fileData, fileName: fileName, type: 'uploaded'
    };
    
    try {
      const saved = localStorage.getItem('ctrlmoney_saved_docs');
      const parsedSaved = saved ? JSON.parse(saved) : [];
      const updatedDocs = [newDoc, ...parsedSaved];
      localStorage.setItem('ctrlmoney_saved_docs', JSON.stringify(updatedDocs));
      window.dispatchEvent(new Event('docsUpdated'));
    } catch (error) {
      console.error("Storage error:", error);
      alert("Память браузера переполнена! Не удалось сохранить документ.");
    }
    
    setIsUploadOpen(false);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.1, duration: 0.5 } }
      }}
      className="bg-white/50 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/40 p-[calc(var(--index)*1.2)] shadow-sm flex flex-col shrink-0"
    >
      <div className="grid grid-cols-2 gap-[calc(var(--index)*0.5)] mb-[calc(var(--index)*1)]">
        
        <motion.div variants={itemVariants} className="bg-white/60 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.5)] border border-white/60 hover:bg-white transition-colors cursor-default shadow-sm">
          <span className="text-slate-500 text-[calc(var(--index)*0.4)] block mb-[calc(var(--index)*0.2)]">Всего</span>
          <div className="flex items-center gap-[calc(var(--index)*0.3)] text-[#1e293b] text-[calc(var(--index)*0.8)] font-medium">
            <DocIcon className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)]" /> {totalDocs}
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white/60 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.5)] border border-white/60 hover:bg-white transition-colors cursor-default shadow-sm">
          <span className="text-slate-500 text-[calc(var(--index)*0.4)] block mb-[calc(var(--index)*0.2)]">Подписано</span>
          <div className="flex items-center gap-[calc(var(--index)*0.3)] text-[#1e293b] text-[calc(var(--index)*0.8)] font-medium">
            <CompleteDocIcon className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)]" /> {Math.floor(totalDocs * 0.8)}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white/60 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.5)] border border-white/60 hover:bg-white transition-colors cursor-default shadow-sm">
          <span className="text-slate-500 text-[calc(var(--index)*0.4)] block mb-[calc(var(--index)*0.2)]">На подписании</span>
          <div className="flex items-center gap-[calc(var(--index)*0.3)] text-[#1e293b] text-[calc(var(--index)*0.8)] font-medium">
            <ClockIcon className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)]" /> 12
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white/60 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.5)] border border-white/60 hover:bg-white transition-colors cursor-default shadow-sm">
          <span className="text-slate-500 text-[calc(var(--index)*0.4)] block mb-[calc(var(--index)*0.2)]">В этом месяце</span>
          <div className="flex items-center gap-[calc(var(--index)*0.3)] text-[#1e293b] text-[calc(var(--index)*0.8)] font-medium">
            <DocMounthIcon className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)]" /> {txDocsCount + 34}
          </div>
        </motion.div>
      </div>

      <motion.button 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsUploadOpen(true)}
        className="w-full py-[calc(var(--index)*0.5)] rounded-[calc(var(--index)*0.4)] bg-[#4C5A7A] text-white text-[calc(var(--index)*0.5)] font-bold flex items-center justify-center hover:bg-[#3b465e] transition-colors shadow-md gap-[calc(var(--index)*0.3)]"
      >
        Загрузить документы
      </motion.button>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onSubmit={handleUploadSubmit} />
    </motion.div>
  );
};

export default DocumentStats;