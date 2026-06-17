import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import DocIcon from '../../assets/doc.svg?react';
import CompleteDocIcon from '../../assets/complitedoc.svg?react';
import ClockIcon from '../../assets/clock.svg?react';
import DocMounthIcon from '../../assets/docmounth.svg?react';
import UploadModal from './Modals/UploadModal';
import { createDocument, fetchDocuments } from '../../api/documentsApi';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const DocumentStats = () => {
  const { transactions } = useFinance();
  const [serverDocs, setServerDocs] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const loadDocs = async () => {
    try {
      const data = await fetchDocuments();
      if (Array.isArray(data)) setServerDocs(data);
    } catch (error) {
      console.error("Ошибка загрузки документов для статистики:", error);
    }
  };

  useEffect(() => {
    loadDocs();
    window.addEventListener('docsUpdated', loadDocs);
    return () => window.removeEventListener('docsUpdated', loadDocs);
  }, []);

  const stats = useMemo(() => {
    // Чеки из транзакций
    const txDocs = transactions.filter(t => t.fileName).map(t => ({ signed: false, date: t.date }));
    
    // Сливаем всё в один массив (ЗАГЛУШКИ ПОЛНОСТЬЮ УДАЛЕНЫ)
    const allDocs = [...serverDocs, ...txDocs];
    
    const total = allDocs.length;
    const signed = allDocs.filter(d => d.signed).length;
    const pending = total - signed;
    
    const thisMonth = allDocs.filter(d => {
      if (!d.date) return false;
      let dDate;
      if (d.date.includes('.')) {
        const [day, month, year] = d.date.split('.');
        dDate = new Date(`${year}-${month}-${day}`);
      } else {
        dDate = new Date(d.date);
      }
      const now = new Date();
      return dDate.getMonth() === now.getMonth() && dDate.getFullYear() === now.getFullYear();
    }).length;

    return { total, signed, pending, thisMonth };
  }, [transactions, serverDocs]);

  const handleUploadSubmit = async (title, category, fileData, fileName) => {
    try {
      await createDocument({
        title, period: category, date: new Date().toISOString().split('T')[0],
        signed: false, url: fileData, fileName, type: 'uploaded'
      });
      window.dispatchEvent(new Event('docsUpdated'));
      loadDocs(); 
    } catch (error) {
      alert("Ошибка сохранения документа на сервере.");
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
      className="bg-white/50 dark:bg-black/40 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/40 dark:border-white/10 p-[calc(var(--index)*1.2)] shadow-sm flex flex-col shrink-0"
    >
      <div className="grid grid-cols-2 gap-[calc(var(--index)*0.5)] mb-[calc(var(--index)*1)]">
        
        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-white/10 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.5)] border border-white/60 dark:border-white/10 hover:bg-white dark:hover:bg-white/20 transition-colors cursor-default shadow-sm">
          <span className="text-slate-500 dark:text-white/60 text-[calc(var(--index)*0.4)] block mb-[calc(var(--index)*0.2)]">Всего</span>
          <div className="flex items-center gap-[calc(var(--index)*0.3)] text-[#1e293b] dark:text-white text-[calc(var(--index)*0.8)] font-medium">
            <DocIcon className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)]" /> {stats.total}
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-white/10 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.5)] border border-white/60 dark:border-white/10 hover:bg-white dark:hover:bg-white/20 transition-colors cursor-default shadow-sm">
          <span className="text-slate-500 dark:text-white/60 text-[calc(var(--index)*0.4)] block mb-[calc(var(--index)*0.2)]">Подписано</span>
          <div className="flex items-center gap-[calc(var(--index)*0.3)] text-[#1e293b] dark:text-white text-[calc(var(--index)*0.8)] font-medium">
            <CompleteDocIcon className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)]" /> {stats.signed}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-white/10 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.5)] border border-white/60 dark:border-white/10 hover:bg-white dark:hover:bg-white/20 transition-colors cursor-default shadow-sm">
          <span className="text-slate-500 dark:text-white/60 text-[calc(var(--index)*0.4)] block mb-[calc(var(--index)*0.2)]">На подписании</span>
          <div className="flex items-center gap-[calc(var(--index)*0.3)] text-[#1e293b] dark:text-white text-[calc(var(--index)*0.8)] font-medium">
            <ClockIcon className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)]" /> {stats.pending}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white/60 dark:bg-white/10 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.5)] border border-white/60 dark:border-white/10 hover:bg-white dark:hover:bg-white/20 transition-colors cursor-default shadow-sm">
          <span className="text-slate-500 dark:text-white/60 text-[calc(var(--index)*0.4)] block mb-[calc(var(--index)*0.2)]">В этом месяце</span>
          <div className="flex items-center gap-[calc(var(--index)*0.3)] text-[#1e293b] dark:text-white text-[calc(var(--index)*0.8)] font-medium">
            <DocMounthIcon className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)]" /> {stats.thisMonth}
          </div>
        </motion.div>
      </div>

      <motion.button 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsUploadOpen(true)}
        className="w-full py-[calc(var(--index)*0.5)] rounded-[calc(var(--index)*0.4)] bg-[#4C5A7A] dark:bg-white/10 text-white dark:text-white text-[calc(var(--index)*0.5)] font-bold flex items-center justify-center hover:bg-[#3b465e] dark:hover:bg-white/20 transition-colors shadow-md gap-[calc(var(--index)*0.3)]"
      >
        Загрузить документы
      </motion.button>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onSubmit={handleUploadSubmit} />
    </motion.div>
  );
};

export default DocumentStats;