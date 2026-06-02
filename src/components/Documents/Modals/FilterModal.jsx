import React from 'react';
import { createPortal } from 'react-dom';

const FilterModal = ({ isOpen, onClose, filters, setFilters }) => {
  if (!isOpen) return null;

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({ status: 'all', dateFrom: '', dateTo: '', category: '' });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#f8fafc]/95 backdrop-blur-xl border border-white rounded-[calc(var(--index)*0.8)] p-[calc(var(--index)*1)] w-[calc(var(--index)*18)] shadow-2xl" onClick={e => e.stopPropagation()}>
        <h3 className="text-[calc(var(--index)*0.7)] font-bold text-[#1e293b] mb-[calc(var(--index)*0.6)]">Фильтры</h3>
        
        <div className="flex flex-col gap-[calc(var(--index)*0.5)]">
          {/* Статус */}
          <div>
            <label className="text-[calc(var(--index)*0.4)] text-slate-500 font-medium block mb-1">Статус документа</label>
            <select value={filters.status} onChange={e => handleChange('status', e.target.value)} className="w-full bg-white border border-slate-200 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.4)] outline-none text-[calc(var(--index)*0.45)] font-medium">
              <option value="all">Все документы</option>
              <option value="signed">Только подписанные</option>
              <option value="unsigned">Ожидают подписи</option>
            </select>
          </div>

          {/* Категория (поиск текста) */}
          <div>
            <label className="text-[calc(var(--index)*0.4)] text-slate-500 font-medium block mb-1">Категория</label>
            <input type="text" placeholder="Например: Маркетинг" value={filters.category} onChange={e => handleChange('category', e.target.value)} className="w-full bg-white border border-slate-200 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.4)] outline-none text-[calc(var(--index)*0.45)] font-medium" />
          </div>

          {/* Даты */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[calc(var(--index)*0.4)] text-slate-500 font-medium block mb-1">От даты</label>
              <input type="date" value={filters.dateFrom} onChange={e => handleChange('dateFrom', e.target.value)} className="w-full bg-white border border-slate-200 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.4)] outline-none text-[calc(var(--index)*0.45)] font-medium" />
            </div>
            <div>
              <label className="text-[calc(var(--index)*0.4)] text-slate-500 font-medium block mb-1">До даты</label>
              <input type="date" value={filters.dateTo} onChange={e => handleChange('dateTo', e.target.value)} className="w-full bg-white border border-slate-200 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.4)] outline-none text-[calc(var(--index)*0.45)] font-medium" />
            </div>
          </div>

          <div className="flex gap-[calc(var(--index)*0.3)] mt-2">
            <button onClick={onClose} className="flex-1 bg-[#4C5A7A] text-white py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] font-bold active-press text-[calc(var(--index)*0.45)]">Применить</button>
            <button onClick={handleReset} className="flex-1 bg-red-50 text-red-500 border border-red-200 py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] font-bold active-press text-[calc(var(--index)*0.45)]">Сбросить</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FilterModal;