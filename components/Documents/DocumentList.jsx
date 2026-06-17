import React, { useState, useMemo, useRef, useEffect } from 'react';
import DateDisplay from '../Common/DateDisplay';
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
import { fetchDocuments, createDocument, updateDocumentSign, deleteDocument } from '../../api/documentsApi';

const DocumentList = () => {
  const { transactions } = useFinance();
  const [localDocs, setLocalDocs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedDocs, setSavedDocs] = useState([]);

  const loadDocs = async () => {
    try {
      const data = await fetchDocuments();
      if (Array.isArray(data)) setSavedDocs(data);
    } catch (err) { console.error("Ошибка загрузки документов:", err); }
  };

  useEffect(() => {
    loadDocs();
    window.addEventListener('docsUpdated', loadDocs);
    return () => window.removeEventListener('docsUpdated', loadDocs);
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
        date: t.date, signed: false, rawDate: new Date(t.date), url: t.fileUrl || null
      }));

    setLocalDocs(prev => {
      const existingSigned = prev.filter(d => d.signed).map(d => d.id);
      return [...savedDocs, ...txDocs].map(doc => {
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

  const isDbDoc = (id) => typeof id === 'number' || (typeof id === 'string' && !id.startsWith('tx-') && !id.startsWith('sys'));

  const handleUploadSubmit = async (title, category, fileData, fileName) => {
    try {
      const newDoc = await createDocument({ title, period: category, date: new Date().toISOString().split('T')[0], signed: false, url: fileData, fileName, type: 'uploaded' });
      setSavedDocs([newDoc, ...savedDocs]);
      window.dispatchEvent(new Event('docsUpdated'));
    } catch (e) { alert("Ошибка загрузки"); }
    setIsUploadOpen(false);
  };

  const handleReportSubmit = async (title, fileUrl) => {
    try {
      const newDoc = await createDocument({ title, period: 'Системный отчет', date: new Date().toISOString().split('T')[0], signed: false, type: 'pdf', url: fileUrl, fileName: title });
      setSavedDocs([newDoc, ...savedDocs]);
      window.dispatchEvent(new Event('docsUpdated'));
    } catch (e) { alert("Ошибка сохранения"); }
    setIsReportOpen(false);
  };

  const handleDownloadReport = (doc) => {
    if (doc.url) {
      const fileName = doc.type === 'pdf' ? `${doc.title.replace(/[^a-zа-яё0-9]/gi, '_')}.pdf` : (doc.fileName || doc.title);
      downloadFile(doc.url, fileName);
    }
  };

  // ТЕПЕРЬ ПРИНИМАЕМ КРИПТОГРАФИЧЕСКИЕ ДАННЫЕ
  const handleSignDoc = async (id, cryptoData) => {
    if (isDbDoc(id)) {
      try { await updateDocumentSign(id, true, cryptoData); } catch (e) { console.error(e); }
    }
    setLocalDocs(prev => prev.map(doc => doc.id === id ? { ...doc, signed: true, ...cryptoData } : doc));
    setSavedDocs(prev => prev.map(doc => doc.id === id ? { ...doc, signed: true, ...cryptoData } : doc));
    setViewingDoc(prev => ({ ...prev, signed: true, ...cryptoData }));
    window.dispatchEvent(new Event('docsUpdated'));
  };

  const handleUnsignDoc = async (id) => {
    if (isDbDoc(id)) {
      try { await updateDocumentSign(id, false, { signature: null, publicKey: null, certName: null }); } catch (e) { console.error(e); }
    }
    setLocalDocs(prev => prev.map(doc => doc.id === id ? { ...doc, signed: false, signature: null, publicKey: null, certName: null } : doc));
    setSavedDocs(prev => prev.map(doc => doc.id === id ? { ...doc, signed: false, signature: null, publicKey: null, certName: null } : doc));
    setViewingDoc(prev => ({ ...prev, signed: false, signature: null, publicKey: null, certName: null }));
    window.dispatchEvent(new Event('docsUpdated'));
  };

  const handleDeleteDoc = async (id) => {
    if (isDbDoc(id)) { try { await deleteDocument(id); } catch (e) { console.error(e); } }
    setLocalDocs(prev => prev.filter(doc => doc.id !== id));
    setSavedDocs(prev => prev.filter(doc => doc.id !== id));
    if (viewingDoc?.id === id) setViewingDoc(null);
    window.dispatchEvent(new Event('docsUpdated'));
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
      return matchSearch && matchStatus && matchCategory;
    });
  }, [localDocs, searchQuery, filters]);

  const chunks = useMemo(() => {
    const result = [];
    const itemsCount = Math.max(2, itemsPerSlide);
    for (let i = 0; i < filteredDocs.length; i += itemsCount) result.push(filteredDocs.slice(i, i + itemsCount));
    return result.length === 0 && filteredDocs.length > 0 ? [[]] : result;
  }, [filteredDocs, itemsPerSlide]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="flex-1 flex flex-col min-h-0 bg-white/50 dark:bg-black/40 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/40 dark:border-white/10 p-[calc(var(--index)*1.2)] shadow-sm relative">
      <div className="flex items-center justify-between mb-[calc(var(--index)*0.8)] shrink-0 px-[calc(var(--index)*0.2)]">
        <h2 className="text-[#1e293b] dark:text-white text-[calc(var(--index)*0.7)] font-bold tracking-tight">Все документы</h2>
        <div className="flex items-center gap-[calc(var(--index)*0.4)]">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsReportOpen(true)} className="flex items-center gap-[calc(var(--index)*0.3)] bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-700 dark:text-white px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.35)] rounded-[calc(var(--index)*0.4)] text-[calc(var(--index)*0.45)] font-medium shadow-sm"><DocIcon className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] opacity-70" /> Создать отчет</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsUploadOpen(true)} className="flex items-center gap-[calc(var(--index)*0.3)] bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10 text-slate-700 dark:text-white px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.35)] rounded-[calc(var(--index)*0.4)] text-[calc(var(--index)*0.45)] font-medium shadow-sm"><UploadIcon className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] opacity-70" /> Загрузить</motion.button>
        </div>
      </div>

      <div className="relative mb-[calc(var(--index)*0.8)] shrink-0 px-[calc(var(--index)*0.2)]">
        <svg className="absolute left-[calc(var(--index)*0.8)] top-1/2 -translate-y-1/2 w-[calc(var(--index)*0.7)] h-[calc(var(--index)*0.7)] text-slate-400 dark:text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input type="text" placeholder="Поиск документов" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-[calc(var(--index)*0.4)] py-[calc(var(--index)*0.4)] pl-[calc(var(--index)*1.8)] pr-[calc(var(--index)*0.6)] outline-none text-[#1e293b] dark:text-white placeholder:text-slate-500 font-semibold text-[calc(var(--index)*0.5)] shadow-sm" />
      </div>

      <div className="flex-1 w-full relative overflow-hidden mt-[calc(var(--index)*0.2)]">
        <div className="absolute inset-0" ref={swiperContainerRef}>
          {chunks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-white/60 font-medium">Документы не найдены</div>
          ) : (
            <Swiper modules={[Pagination, Mousewheel]} pagination={{ clickable: true }} direction="vertical" mousewheel={true} spaceBetween={10} slidesPerView={1} className="h-full w-full custom-docs-swiper pr-[calc(var(--index)*1.5)]">
              {chunks.map((chunk, chunkIndex) => (
                <SwiperSlide key={chunkIndex} className="h-full">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-[calc(var(--index)*0.5)] content-start h-full">
                    <AnimatePresence>
                      {chunk.map((doc, i) => (
                        <motion.div key={doc.id} onClick={() => setViewingDoc(doc)} className="group flex items-center justify-between bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-[calc(var(--index)*0.5)] p-[calc(var(--index)*0.6)] shadow-sm cursor-pointer h-[calc(var(--index)*3.2)]">
                          <div className="flex items-center gap-[calc(var(--index)*0.6)] min-w-0 flex-1">
                            <div className={`w-[calc(var(--index)*1.6)] h-[calc(var(--index)*1.6)] rounded-[calc(var(--index)*0.4)] border border-white/80 dark:border-white/10 flex items-center justify-center shrink-0 ${doc.signed ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-white/60 dark:bg-white/5'}`}>
                              {doc.signed ? <CompleteDocIcon className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)]" /> : <DocIcon className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)]" />}
                            </div>
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="text-[#1e293b] dark:text-white font-semibold text-[calc(var(--index)*0.55)] truncate">{doc.title}</span>
                              <span className="flex items-center gap-1 text-slate-500 dark:text-white/60 text-[calc(var(--index)*0.4)] mt-[calc(var(--index)*0.05)] truncate font-medium">
                                {doc.signed && <span className="text-emerald-500 font-bold">Подписан</span>}{doc.signed && <span>•</span>}{doc.period} • <DateDisplay date={doc.date} className="inline text-slate-500 text-[calc(var(--index)*0.4)]" />
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