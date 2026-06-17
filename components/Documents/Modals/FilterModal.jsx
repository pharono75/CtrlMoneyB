import React from 'react';
import { createPortal } from 'react-dom';
import CustomDateInput from '../../Common/CustomDateInput';

const FilterModal = ({ isOpen, onClose, filters, setFilters }) => {
  if (!isOpen) return null;
  const handleChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const handleReset = () => { setFilters({ status: 'all', dateFrom: '', dateTo: '', category: '' }); onClose(); };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-colors" onClick={onClose}>
      <div className="bg-[#f8fafc]/95 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border border-white dark:border-white/10 rounded-[calc(var(--index)*0.8)] p-[calc(var(--index)*1)] w-[calc(var(--index)*18)] shadow-2xl transition-colors" onClick={e => e.stopPropagation()}>
        <h3 className="text-[calc(var(--index)*0.7)] font-bold text-[#1e293b] dark:text-white mb-[calc(var(--index)*0.6)]">Фильтры</h3>
        <div className="flex flex-col gap-[calc(var(--index)*0.5)]">
          <div>
            <label className="text-[calc(var(--index)*0.4)] text-slate-500 dark:text-white/60 font-medium block mb-1">Статус документа</label>
            <select value={filters.status} onChange={e => handleChange('status', e.target.value)} className="w-full bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.4)] outline-none text-[calc(var(--index)*0.45)] font-medium dark:text-white">
              <option value="all" className="dark:bg-[#121212]">Все документы</option>
              <option value="signed" className="dark:bg-[#121212]">Только подписанные</option>
              <option value="unsigned" className="dark:bg-[#121212]">Ожидают подписи</option>
            </select>
          </div>
          <div>
            <label className="text-[calc(var(--index)*0.4)] text-slate-500 dark:text-white/60 font-medium block mb-1">Категория</label>
            <input type="text" placeholder="Например: Маркетинг" value={filters.category} onChange={e => handleChange('category', e.target.value)} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.4)] outline-none text-[calc(var(--index)*0.45)] font-medium dark:text-white dark:placeholder:text-white/30 focus:border-[#4C5A7A] dark:focus:border-white" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[calc(var(--index)*0.4)] text-slate-500 dark:text-white/60 font-medium block mb-1">От даты</label>
              <CustomDateInput value={filters.dateFrom} onChange={e => handleChange('dateFrom', e.target.value)} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.4)] outline-none text-[calc(var(--index)*0.45)] font-medium dark:text-white focus:border-[#4C5A7A] dark:focus:border-white" />
            </div>
            <div>
              <label className="text-[calc(var(--index)*0.4)] text-slate-500 dark:text-white/60 font-medium block mb-1">До даты</label>
              <CustomDateInput value={filters.dateTo} onChange={e => handleChange('dateTo', e.target.value)} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.4)] outline-none text-[calc(var(--index)*0.45)] font-medium dark:text-white focus:border-[#4C5A7A] dark:focus:border-white" />
            </div>
          </div>
          <div className="flex gap-[calc(var(--index)*0.3)] mt-2">
            <button onClick={onClose} className="flex-1 bg-[#4C5A7A] dark:bg-white text-white dark:text-black py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] font-bold active-press text-[calc(var(--index)*0.45)] dark:hover:bg-gray-200 transition-colors">Применить</button>
            <button onClick={handleReset} className="flex-1 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-500/30 py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] font-bold active-press text-[calc(var(--index)*0.45)] dark:hover:bg-red-500/20 transition-colors">Сбросить</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
export default FilterModal;