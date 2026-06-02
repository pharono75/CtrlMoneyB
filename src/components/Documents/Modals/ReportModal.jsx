import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { generateReportData, createPdfBase64 } from '../../../utils/reportGenerator';

const ReportModal = ({ isOpen, onClose, onSubmit, transactions }) => {
  const [reportType, setReportType] = useState('Финансовая сводка (P&L)');
  const [period, setPeriod] = useState('all'); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [budgets, setBudgets] = useState([]);
  
  const [customOptions, setCustomOptions] = useState({
    summary: true,
    chartsData: true,           
    categoryAnalysis: true,  
    budgetAnalysis: true,    
    recommendations: true    
  });

  useEffect(() => {
    if (isOpen) {
      const savedBudgets = localStorage.getItem('ctrlmoney_budgets');
      if (savedBudgets) setBudgets(JSON.parse(savedBudgets));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOptionChange = (key) => setCustomOptions(prev => ({ ...prev, [key]: !prev[key] }));

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      const reportData = generateReportData(transactions, budgets, period, reportType, customOptions);
      const fullTitle = `Отчет: ${reportType}`;

      const fileUrl = await createPdfBase64(fullTitle, reportData);
      
      onSubmit(fullTitle, fileUrl);
    } catch (error) {
      console.error("Ошибка генерации PDF:", error);
      alert("Не удалось создать PDF-отчет.");
    } finally {
      setIsGenerating(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#f8fafc]/95 backdrop-blur-xl border border-white rounded-[calc(var(--index)*0.8)] p-[calc(var(--index)*1)] w-full max-w-[calc(var(--index)*22)] shadow-2xl transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-[calc(var(--index)*0.6)]">
          <h3 className="text-[calc(var(--index)*0.7)] font-bold text-[#1e293b]">Генерация отчета</h3>
          <button onClick={onClose} disabled={isGenerating} className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={handleGenerate} className="flex flex-col gap-[calc(var(--index)*0.6)]">
          <div>
            <label className="text-[calc(var(--index)*0.45)] text-slate-500 font-medium block mb-2">Шаблон отчета</label>
            <select disabled={isGenerating} value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full bg-white border border-slate-200 rounded-[calc(var(--index)*0.4)] p-[calc(var(--index)*0.4)] outline-none focus:border-[#4C5A7A] text-[calc(var(--index)*0.5)] font-medium">
              <option>Финансовая сводка (P&L)</option>
              <option>Предварительная налоговая декларация (УСН 6%)</option>
              <option>Движение денежных средств (Cash Flow)</option>
              <option className="font-bold text-[#4C5A7A]">Настраиваемый аналитический отчет</option>
            </select>
          </div>

          <div>
            <label className="text-[calc(var(--index)*0.45)] text-slate-500 font-medium block mb-2">За какой период</label>
            <div className="flex bg-slate-100 rounded-[calc(var(--index)*0.3)] p-1 overflow-hidden">
              {[{ id: 'month', label: 'Месяц' }, { id: 'quarter', label: 'Квартал' }, { id: 'year', label: 'Год' }, { id: 'all', label: 'Все время' }].map(p => (
                <button key={p.id} type="button" disabled={isGenerating} onClick={() => setPeriod(p.id)} className={`flex-1 py-1.5 text-[calc(var(--index)*0.4)] font-medium rounded-[calc(var(--index)*0.2)] transition-all ${period === p.id ? 'bg-white shadow-sm text-[#1e293b]' : 'text-slate-500 hover:text-slate-700'}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {reportType === 'Настраиваемый аналитический отчет' && (
            <div className="bg-slate-50 border border-slate-200 rounded-[calc(var(--index)*0.5)] p-[calc(var(--index)*0.6)] animate-in slide-in-from-top-2">
              <label className="text-[calc(var(--index)*0.45)] text-slate-700 font-bold block mb-3">Структура данных для отчета</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'summary', label: 'Сводка' },
                  { id: 'chartsData', label: 'Графики' },
                  { id: 'categoryAnalysis', label: 'Категории' },
                  { id: 'budgetAnalysis', label: 'Бюджеты' },
                  { id: 'recommendations', label: 'Выводы' }
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" disabled={isGenerating} checked={customOptions[opt.id]} onChange={() => handleOptionChange(opt.id)} className="appearance-none w-5 h-5 border-2 border-slate-300 rounded-[4px] checked:bg-[#4C5A7A] checked:border-[#4C5A7A] transition-colors cursor-pointer" />
                      {customOptions[opt.id] && <svg className="absolute w-3 h-3 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-[calc(var(--index)*0.45)] text-slate-600 group-hover:text-slate-900 transition-colors select-none">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-[calc(var(--index)*0.4)] mt-4">
            <button type="submit" disabled={isGenerating} className={`flex-1 text-white py-[calc(var(--index)*0.45)] rounded-[calc(var(--index)*0.4)] font-bold text-[calc(var(--index)*0.5)] shadow-md transition-all flex justify-center items-center gap-2 ${isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#4C5A7A] hover:bg-[#3b465e] active-press'}`}>
              {isGenerating ? (
                <>
                  <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Генерация PDF...
                </>
              ) : "Создать отчет"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ReportModal;