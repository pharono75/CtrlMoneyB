import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import DocIcon from '../../assets/doc.svg?react';
import CompleteDocIcon from '../../assets/complitedoc.svg?react';
import UploadIcon from '../../assets/upload.svg?react';
import FiltersIcon from '../../assets/filters.svg?react';

import UploadModal from './Modals/UploadModal';
import ReportModal from './Modals/ReportModal';
import FilterModal from './Modals/FilterModal';
import DocumentViewModal from './Modals/DocumentViewerModal';
import { downloadFile } from '../../utils/reportGenerator';

const INITIAL_SYSTEM_DOCS = [
  { id: 'sys1', title: 'Акт сверки с ООО "Ромашка"', period: 'Акт', date: '14.02.2026', signed: false },
  { id: 'sys2', title: 'Договор аренды помещения', period: 'Договор', date: '10.01.2026', signed: true },
];

const DocumentList = () => {
  const { transactions } = useFinance();
  const [localDocs, setLocalDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [savedDocs, setSavedDocs] = useState(() => {
    try {
      const saved = localStorage.getItem('ctrlmoney_saved_docs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem('ctrlmoney_saved_docs', JSON.stringify(savedDocs)); } 
    catch (error) { alert("Память браузера переполнена! Удалите несколько старых отчетов."); }
  }, [savedDocs]);

  useEffect(() => {
    const handleDocsUpdate = () => {
      const saved = localStorage.getItem('ctrlmoney_saved_docs');
      if (saved) setSavedDocs(JSON.parse(saved));
    };
    window.addEventListener('docsUpdated', handleDocsUpdate);
    return () => window.removeEventListener('docsUpdated', handleDocsUpdate);
  }, []);

  const [filters, setFilters] = useState({ status: 'all', dateFrom: '', dateTo: '', category: '' });
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);
  
  const swiperContainerRef = useRef(null);
  const [itemsPerSlide, setItemsPerSlide] = useState(8); 

  useEffect(() => {
    const txDocs = transactions.filter(t => t.fileName).map(t => ({
        id: `tx-${t.id}`, title: t.fileName, period: t.category, 
        date: new Date(t.date).toLocaleDateString('ru-RU'), signed: false, rawDate: new Date(t.date), url: t.fileUrl || null
      }));

    setLocalDocs(prev => {
      const existingSigned = prev.filter(d => d.signed).map(d => d.id);
      return [...INITIAL_SYSTEM_DOCS, ...savedDocs, ...txDocs].map(doc => {
        const preservedDoc = { ...doc, signed: existingSigned.includes(doc.id) ? true : doc.signed };
        if (doc.type === 'uploaded' || doc.fileName) { preservedDoc.type = doc.type || 'uploaded'; preservedDoc.fileName = doc.fileName; }
        return preservedDoc;
      });
    });
  }, [transactions, savedDocs]);

  useEffect(() => {
    const container = swiperContainerRef.current;
    if (!container) return;
    const updateItemsPerSlide = (height) => {
      const indexPx = (window.innerWidth * 0.01) + (window.innerHeight * 0.01);
      setItemsPerSlide(Math.max(2, Math.floor(height / (3.8 * indexPx)) * 2));
    };
    const observer = new ResizeObserver((entries) => { for (let entry of entries) updateItemsPerSlide(entry.contentRect.height); });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleUploadSubmit = (title, category, fileData, fileName) => {
    setSavedDocs([{ id: `up-${Date.now()}`, title, period: category, date: new Date().toLocaleDateString('ru-RU'), signed: false, url: fileData, fileName, type: 'uploaded' }, ...savedDocs]);
    setIsUploadOpen(false);
  };

  const handleReportSubmit = (title, fileUrl) => {
    setSavedDocs([{ id: `rep-${Date.now()}`, title, period: 'Системный отчет', date: new Date().toLocaleDateString('ru-RU'), signed: false, type: 'pdf', url: fileUrl, downloadable: true }, ...savedDocs]);
    setIsReportOpen(false);
  };

  const handleDownloadReport = (doc) => {
    if (doc.url) {
      const fileName = doc.type === 'pdf' ? `${doc.title.replace(/[^a-zа-яё0-9]/gi, '_')}.pdf` : (doc.fileName || doc.title);
      downloadFile(doc.url, fileName);
    }
  };

  const handleSignDoc = (id) => {
    setLocalDocs(prev => prev.map(doc => doc.id === id ? { ...doc, signed: true } : doc));
    setSavedDocs(prev => prev.map(doc => doc.id === id ? { ...doc, signed: true } : doc));
    setViewingDoc(prev => ({ ...prev, signed: true }));
  };

  const handleUnsignDoc = (id) => {
    setLocalDocs(prev => prev.map(doc => doc.id === id ? { ...doc, signed: false } : doc));
    setSavedDocs(prev => prev.map(doc => doc.id === id ? { ...doc, signed: false } : doc));
    setViewingDoc(prev => ({ ...prev, signed: false }));
  };

  const handleDeleteDoc = (id) => {
    setLocalDocs(prev => prev.filter(doc => doc.id !== id));
    setSavedDocs(prev => prev.filter(doc => doc.id !== id));
    if (viewingDoc?.id === id) setViewingDoc(null);
  };

  const handleRenameDoc = (id, newTitle) => {
    setLocalDocs(prev => prev.map(doc => doc.id === id ? { ...doc, title: newTitle } : doc));
    setSavedDocs(prev => prev.map(doc => doc.id === id ? { ...doc, title: newTitle } : doc));
    setViewingDoc(prev => ({ ...prev, title: newTitle }));
  };

  const filteredDocs = useMemo(() => {
    return localDocs.filter(doc => {
      const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filters.status === 'all' ? true : filters.status === 'signed' ? doc.signed : !doc.signed;
      const matchCategory = filters.category === '' || doc.period.toLowerCase().includes(filters.category.toLowerCase());
      let matchDate = true;
      if (filters.dateFrom || filters.dateTo) {
        const [d, m, y] = doc.date.split('.');
        const docDate = new Date(`${y}-${m}-${d}`);
        if (filters.dateFrom) matchDate = matchDate && docDate >= new Date(filters.dateFrom);
        if (filters.dateTo) matchDate = matchDate && docDate <= new Date(filters.dateTo);
      }
      return matchSearch && matchStatus && matchCategory && matchDate;
    });
  }, [localDocs, searchQuery, filters]);

  const chunks = useMemo(() => {
    const result = [];
    const itemsCount = Math.max(2, itemsPerSlide);
    for (let i = 0; i < filteredDocs.length; i += itemsCount) result.push(filteredDocs.slice(i, i + itemsCount));
    return result.length === 0 && filteredDocs.length > 0 ? [[]] : result;
  }, [filteredDocs, itemsPerSlide]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex-1 flex flex-col min-h-0 bg-white/50 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/40 p-[calc(var(--index)*1.2)] shadow-sm relative"
    >
      <div className="flex items-center justify-between mb-[calc(var(--index)*0.8)] shrink-0 px-[calc(var(--index)*0.2)]">
        <h2 className="text-[#1e293b] text-[calc(var(--index)*0.7)] font-bold tracking-tight">Все документы</h2>
        <div className="flex items-center gap-[calc(var(--index)*0.4)]">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsReportOpen(true)} className="flex items-center gap-[calc(var(--index)*0.3)] bg-white/60 border border-white/80 text-slate-700 px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.35)] rounded-[calc(var(--index)*0.4)] text-[calc(var(--index)*0.45)] font-medium hover:bg-white shadow-sm"><DocIcon className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] opacity-70" /> Создать отчет</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsUploadOpen(true)} className="flex items-center gap-[calc(var(--index)*0.3)] bg-white/60 border border-white/80 text-slate-700 px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.35)] rounded-[calc(var(--index)*0.4)] text-[calc(var(--index)*0.45)] font-medium hover:bg-white shadow-sm"><UploadIcon className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] opacity-70" /> Загрузить</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsFilterOpen(true)} className={`flex items-center gap-[calc(var(--index)*0.3)] border px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.35)] rounded-[calc(var(--index)*0.4)] text-[calc(var(--index)*0.45)] font-medium shadow-sm ${filters.status !== 'all' || filters.category || filters.dateFrom ? 'bg-[#4C5A7A] text-white border-[#4C5A7A]' : 'bg-white/60 border-white/80 text-slate-700 hover:bg-white'}`}><FiltersIcon className={`w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] ${filters.status !== 'all' || filters.category || filters.dateFrom ? 'brightness-0 invert' : 'opacity-70'}`} /> Фильтры</motion.button>
        </div>
      </div>

      <div className="relative mb-[calc(var(--index)*0.8)] shrink-0 px-[calc(var(--index)*0.2)]">
        <svg className="absolute left-[calc(var(--index)*0.8)] top-1/2 -translate-y-1/2 w-[calc(var(--index)*0.7)] h-[calc(var(--index)*0.7)] text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input type="text" placeholder="Поиск документов" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/40 border border-white/60 rounded-[calc(var(--index)*0.4)] py-[calc(var(--index)*0.4)] pl-[calc(var(--index)*1.8)] pr-[calc(var(--index)*0.6)] outline-none text-[#1e293b] placeholder:text-slate-500 font-semibold text-[calc(var(--index)*0.5)] transition-all focus:bg-white/60 focus:border-[#4C5A7A]/30 shadow-sm" />
      </div>

      <div className="flex-1 w-full relative overflow-hidden mt-[calc(var(--index)*0.2)]">
        <div className="absolute inset-0" ref={swiperContainerRef}>
          {chunks.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-slate-400 font-medium text-[calc(var(--index)*0.5)]">Документы не найдены</motion.div>
          ) : (
            <Swiper modules={[Pagination, Mousewheel]} pagination={{ clickable: true }} direction="vertical" mousewheel={true} spaceBetween={10} slidesPerView={1} className="h-full w-full custom-docs-swiper pr-[calc(var(--index)*1.5)]">
              {chunks.map((chunk, chunkIndex) => (
                <SwiperSlide key={chunkIndex} className="h-full">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-[calc(var(--index)*0.5)] content-start h-full">
                    <AnimatePresence>
                      {chunk.map((doc, i) => (
                        <motion.div 
                          key={doc.id} 
                          initial={{ opacity: 0, scale: 0.9, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                          transition={{ type: "spring", stiffness: 400, damping: 25, delay: i * 0.05 }}
                          whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.7)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setViewingDoc(doc)} 
                          className="group flex items-center justify-between bg-white/40 border border-white/60 rounded-[calc(var(--index)*0.5)] p-[calc(var(--index)*0.6)] shadow-sm cursor-pointer h-[calc(var(--index)*3.2)]"
                        >
                          <div className="flex items-center gap-[calc(var(--index)*0.6)] min-w-0 flex-1">
                            <div className={`w-[calc(var(--index)*1.6)] h-[calc(var(--index)*1.6)] rounded-[calc(var(--index)*0.4)] border border-white/80 flex items-center justify-center shrink-0 transition-colors ${doc.signed ? 'bg-emerald-50' : 'bg-white/60 group-hover:bg-white'}`}>
                              {doc.signed ? <CompleteDocIcon className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)]" /> : <DocIcon className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)]" />}
                            </div>
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="text-[#1e293b] font-semibold text-[calc(var(--index)*0.55)] truncate group-hover:text-[#4C5A7A] transition-colors">{doc.title}</span>
                              <span className="flex items-center gap-1 text-slate-500 text-[calc(var(--index)*0.4)] mt-[calc(var(--index)*0.05)] truncate font-medium">
                                {doc.signed && <span className="text-emerald-500 font-bold">Подписан</span>}{doc.signed && <span>•</span>}{doc.period} • {doc.date}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} onSubmit={handleUploadSubmit} />
      <ReportModal isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} onSubmit={handleReportSubmit} transactions={transactions} />
      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} filters={filters} setFilters={setFilters} />
      <DocumentViewModal isOpen={!!viewingDoc} onClose={() => setViewingDoc(null)} doc={viewingDoc} onSign={handleSignDoc} onUnsign={handleUnsignDoc} onDelete={handleDeleteDoc} onRename={handleRenameDoc} onDownload={handleDownloadReport} />
    </motion.div>
  );
};

export default DocumentList;