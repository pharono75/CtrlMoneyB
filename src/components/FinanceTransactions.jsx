import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import PeriodSwitcher from './PeriodSwitcher';
import { getCategoryIcon } from '../constants/categories';
import TransactionDetail from './BalanceCard/TransactionDetail';
import TransactionModal from './BalanceCard/TransactionModal';

// --- ПЛАВНАЯ ФИГУРА ДЛЯ НАВЕДЕНИЯ НА КОЛЬЦО ---
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, fillOpacity } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 6}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      opacity={fillOpacity}
      style={{ transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)' }}
    />
  );
};

const FinanceTransactions = () => {
  const { transactions, period } = useFinance();
  
  const [filterType, setFilterType] = useState('expense'); 
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  
  const [selectedTx, setSelectedTx] = useState(null);
  const [editingTx, setEditingTx] = useState(null);

  // Ссылка на контейнер Swiper для измерения высоты
  const swiperContainerRef = useRef(null);
  const [itemsPerSlide, setItemsPerSlide] = useState(5); // Динамическое количество

  // === ДИНАМИЧЕСКИЙ РАСЧЕТ ВМЕСТИМОСТИ ЭЛЕМЕНТОВ ===
  useEffect(() => {
    const container = swiperContainerRef.current;
    if (!container) return;

    const updateItemsPerSlide = (height) => {
      // Получаем физический размер --index (1vw + 1vh) в пикселях
      const indexPx = (window.innerWidth * 0.01) + (window.innerHeight * 0.01);
      
      // Высота одной плашки (включает внутренние отступы, высоту иконки) + gap
      // ~ 2.3 * index + gap 0.35 * index. Берем 2.8 с небольшим запасом, чтобы не обрезалось
      const itemHeight = 2.8 * indexPx;
      
      // Сколько целых плашек влезет в текущую высоту контейнера
      const calculatedCount = Math.floor(height / itemHeight);
      
      // Задаем минимум 2 плашки, чтобы список не сломался на очень мелких экранах
      setItemsPerSlide(Math.max(2, calculatedCount)); 
    };

    // Слушаем изменение размеров контейнера
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        updateItemsPerSlide(entry.contentRect.height);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const toggleCategory = (catName) => {
    if (!catName) return;
    setSelectedCategories(prev => 
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    );
  };

  // 1. ФИЛЬТРАЦИЯ
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let filtered = transactions.filter(t => {
      if (period !== 'all') {
        const tDate = new Date(t.date);
        if (period === 'month' && (tDate.getMonth() !== now.getMonth() || tDate.getFullYear() !== now.getFullYear())) return false;
        if (period === 'quarter') {
          const currentQ = Math.floor(now.getMonth() / 3);
          const tQ = Math.floor(tDate.getMonth() / 3);
          if (currentQ !== tQ || tDate.getFullYear() !== now.getFullYear()) return false;
        }
        if (period === 'year' && tDate.getFullYear() !== now.getFullYear()) return false;
      }
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(t.category)) return false;
      return true;
    });

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, period, filterType, selectedCategories]);

  // 2. ДАННЫЕ ДЛЯ КОЛЬЦА
  const { donutData, totalAmount } = useMemo(() => {
    const grouped = {};
    let total = 0;

    const baseTransactions = transactions.filter(t => {
      const now = new Date();
      if (period !== 'all') {
        const tDate = new Date(t.date);
        if (period === 'month' && (tDate.getMonth() !== now.getMonth() || tDate.getFullYear() !== now.getFullYear())) return false;
        if (period === 'quarter') {
          const currentQ = Math.floor(now.getMonth() / 3);
          const tQ = Math.floor(tDate.getMonth() / 3);
          if (currentQ !== tQ || tDate.getFullYear() !== now.getFullYear()) return false;
        }
        if (period === 'year' && tDate.getFullYear() !== now.getFullYear()) return false;
      }
      if (filterType !== 'all' && t.type !== filterType) return false;
      return true;
    });

    baseTransactions.forEach(t => {
      const cat = t.category || 'Прочее';
      grouped[cat] = (grouped[cat] || 0) + Number(t.amount);
      total += Number(t.amount);
    });

    const data = Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
      
    return { 
      donutData: data.length > 0 ? data : [{ name: 'Нет транзакций', value: 1, isEmpty: true }], 
      totalAmount: total 
    };
  }, [transactions, period, filterType]);

  // 3. НАРЕЗКА ДЛЯ СВАЙПЕРА (Теперь динамическая!)
  const chunks = useMemo(() => {
    const result = [];
    for (let i = 0; i < filteredTransactions.length; i += itemsPerSlide) {
      result.push(filteredTransactions.slice(i, i + itemsPerSlide));
    }
    return result;
  }, [filteredTransactions, itemsPerSlide]);

  const COLORS = ['#4C5A7A', '#5d6b8c', '#6e7e9e', '#7f90b0', '#90a3c2', '#a1b6d4', '#b2c9e6'];

  const activeCenterData = hoveredIndex !== -1 
    ? donutData[hoveredIndex] 
    : (selectedCategories.length === 1 ? donutData.find(d => d.name === selectedCategories[0]) : null);

  const categoriesList = useMemo(() => donutData.filter(d => !d.isEmpty), [donutData]);

  return (
    <section className="flex-1 flex flex-col min-h-0 bg-white/50 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/40 p-[calc(var(--index)*1.2)] shadow-sm w-full h-full relative">
      
      {/* --- ШАПКА --- */}
      <div className="flex items-center justify-between gap-[calc(var(--index)*1)] mb-[calc(var(--index)*1.2)] shrink-0 w-full px-[calc(var(--index)*0.2)]">
        <div className="relative flex bg-white/30 backdrop-blur-md border border-white/50 rounded-[calc(var(--index)*0.4)] shadow-sm overflow-hidden">
          <div 
            className="absolute top-0 bottom-0 left-0 w-1/3 bg-[#4C5A7A] rounded-[calc(var(--index)*0.4)] shadow-md transition-transform duration-[400ms] ease-[cubic-bezier(0.03,0.74,1,1.01)]"
            style={{ transform: `translateX(${filterType === 'income' ? '0%' : filterType === 'expense' ? '100%' : '200%'})` }}
          ></div>
          {[
            { id: 'income', label: 'Доход' },
            { id: 'expense', label: 'Траты' },
            { id: 'all', label: 'Все' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setFilterType(tab.id); setSelectedCategories([]); setIsCategoryMenuOpen(false); }}
              className={`relative z-10 w-[calc(var(--index)*4.5)] py-[calc(var(--index)*0.35)] text-[calc(var(--index)*0.45)] font-medium transition-colors duration-[150ms] active-press ${
                filterType === tab.id ? 'text-white' : 'text-slate-500 hover:text-[#1e293b]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="w-[calc(var(--index)*16)] relative flex">
          <PeriodSwitcher />
        </div>
      </div>

      {/* --- ОСНОВНАЯ ЧАСТЬ --- */}
      <div className="flex-1 flex flex-col lg:flex-row gap-[calc(var(--index)*2)] min-h-0 h-full relative">
        
        {/* ЛЕВАЯ КОЛОНКА: График и Категории */}
        <div className="flex flex-col items-center justify-start shrink-0 lg:w-[46%] relative pt-[calc(var(--index)*0.5)] overflow-y-auto no-scrollbar pb-[calc(var(--index)*1)]">
          
          {/* ГРАФИК */}
          <div className="relative w-full flex justify-center" style={{ minHeight: '220px', height: 'calc(var(--index)*12)' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius="72%" 
                  outerRadius="95%"
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={true}
                  animationDuration={800}
                  activeIndex={hoveredIndex}
                  activeShape={renderActiveShape}
                  onClick={(data) => !data.payload.isEmpty && toggleCategory(data.name)}
                  onMouseEnter={(_, index) => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(-1)}
                  className="outline-none cursor-pointer"
                >
                  {donutData.map((entry, index) => {
                    const isHovered = hoveredIndex === index;
                    const isSelected = selectedCategories.includes(entry.name);
                    let opacity = 1;
                    if (hoveredIndex !== -1) opacity = isHovered ? 1 : 0.4; 
                    else if (selectedCategories.length > 0) opacity = isSelected ? 1 : 0.4; 

                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isEmpty ? '#e2e8f0' : COLORS[index % COLORS.length]} 
                        fillOpacity={opacity}
                        style={{ transition: 'fill-opacity 0.3s ease' }}
                      />
                    );
                  })}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              <span className="text-slate-500 text-[calc(var(--index)*0.45)] font-medium uppercase tracking-wider mb-1 truncate w-full transition-all duration-300">
                {activeCenterData ? activeCenterData.name : 'Всего'}
              </span>
              <span className="text-[#1e293b] text-[calc(var(--index)*1.1)] font-semibold leading-none tracking-tight transition-all duration-300">
                {activeCenterData ? activeCenterData.value.toLocaleString('ru-RU') : totalAmount.toLocaleString('ru-RU')}₽
              </span>
              {activeCenterData && totalAmount > 0 && (
                <span className="text-[#4C5A7A] text-[calc(var(--index)*0.45)] font-bold mt-1 bg-[#4C5A7A]/10 px-[calc(var(--index)*0.3)] py-[calc(var(--index)*0.1)] rounded-full animate-fade-in-up">
                  {Math.round((activeCenterData.value / totalAmount) * 100)}%
                </span>
              )}
            </div>
          </div>

          {/* ИНТЕРАКТИВНЫЙ БЛОК КАТЕГОРИЙ */}
          <div className="w-full mt-[calc(var(--index)*1.5)] flex flex-row items-start gap-[calc(var(--index)*0.5)] z-20 min-h-[calc(var(--index)*2)]">
            
            <button 
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className={`shrink-0 flex items-center justify-center transition-all duration-300 cursor-pointer active-press shadow-sm z-10 ${
                isCategoryMenuOpen
                  ? 'w-[calc(var(--index)*1.6)] h-[calc(var(--index)*1.6)] rounded-full bg-[#4C5A7A] text-white' 
                  : selectedCategories.length > 0
                    ? 'gap-[calc(var(--index)*0.3)] px-[calc(var(--index)*0.6)] h-[calc(var(--index)*1.6)] rounded-full bg-[#4C5A7A]/10 text-[#4C5A7A] border border-[#4C5A7A]/20' 
                    : 'gap-[calc(var(--index)*0.3)] px-[calc(var(--index)*0.6)] h-[calc(var(--index)*1.6)] rounded-full bg-white/60 text-slate-600 border border-white/80 hover:bg-white'
              }`}
            >
              {isCategoryMenuOpen ? (
                <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <>
                  <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <span className="text-[calc(var(--index)*0.5)] font-medium">Категории</span>
                  {selectedCategories.length > 0 && (
                    <span className="bg-[#4C5A7A] text-white text-[calc(var(--index)*0.35)] px-[calc(var(--index)*0.25)] py-[calc(var(--index)*0.05)] rounded-full ml-1">
                      {selectedCategories.length}
                    </span>
                  )}
                </>
              )}
            </button>

            {isCategoryMenuOpen && (
              <div className="flex-1 flex flex-wrap gap-[calc(var(--index)*0.35)] pb-2">
                
                {selectedCategories.length > 0 && (
                  <div className="snake-item" style={{ animationDelay: `0ms` }}>
                    <button 
                      onClick={() => { setSelectedCategories([]); setIsCategoryMenuOpen(false); }}
                      className="flex items-center gap-[calc(var(--index)*0.2)] px-[calc(var(--index)*0.5)] h-[calc(var(--index)*1.6)] rounded-full text-[calc(var(--index)*0.45)] font-medium text-red-500 bg-red-50/80 hover:bg-red-100 transition-colors active-press border border-red-100 shadow-sm"
                    >
                      <svg className="w-[calc(var(--index)*0.5)] h-[calc(var(--index)*0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Сбросить
                    </button>
                  </div>
                )}

                {categoriesList.map((cat, index) => {
                  const isSelected = selectedCategories.includes(cat.name);
                  const delayIndex = selectedCategories.length > 0 ? index + 1 : index;

                  return (
                    <div key={cat.name} className="snake-item" style={{ animationDelay: `${delayIndex * 40}ms` }}>
                      <button 
                        onClick={() => toggleCategory(cat.name)}
                        className={`flex items-center gap-[calc(var(--index)*0.3)] px-[calc(var(--index)*0.5)] h-[calc(var(--index)*1.6)] rounded-full text-[calc(var(--index)*0.45)] font-medium transition-all duration-300 active-press border shadow-sm ${
                          isSelected 
                            ? 'bg-[#4C5A7A] text-white border-[#4C5A7A]' 
                            : 'bg-white/60 text-slate-600 border-white/60 hover:bg-white hover:shadow-sm'
                        }`}
                      >
                        <div className={`flex items-center justify-center transition-all ${isSelected ? 'brightness-0 invert' : 'text-[#4C5A7A]'}`}>
                          {getCategoryIcon(cat.name, '', "w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] currentColor")}
                        </div>
                        {cat.name}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: ВЕРТИКАЛЬНЫЙ СВАЙПЕР ТРАНЗАКЦИЙ */}
        <div className="flex-1 flex flex-col min-h-0 w-full relative">
          <div className="flex items-center justify-between mb-[calc(var(--index)*0.6)] shrink-0 px-[calc(var(--index)*0.2)]">
            <h3 className="text-[#334155] text-[calc(var(--index)*0.6)] font-semibold">
              {selectedCategories.length > 0 ? 'Отфильтровано' : 'Все транзакции'}
            </h3>
            <span className="text-slate-400 text-[calc(var(--index)*0.45)] font-medium">
              {filteredTransactions.length} шт.
            </span>
          </div>
          
          <div className="flex-1 w-full h-full relative overflow-hidden">
            {/* Обертка для ResizeObserver */}
            <div className="absolute inset-0" ref={swiperContainerRef}>
              {chunks.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-400 font-medium text-[calc(var(--index)*0.5)]">
                  Транзакций не найдено
                </div>
              ) : (
                <Swiper
                  modules={[Pagination, Mousewheel]}
                  pagination={{ clickable: true }}
                  direction="vertical"
                  mousewheel={true}
                  spaceBetween={10}
                  slidesPerView={1}
                  className="h-full w-full custom-finance-swiper pr-[calc(var(--index)*1.5)]"
                  style={{
                    "--swiper-pagination-color": "#4C5A7A",
                    "--swiper-pagination-bullet-inactive-color": "#cbd5e1",
                    "--swiper-pagination-bullet-inactive-opacity": "0.7",
                    "--swiper-pagination-bullet-size": "6px"
                  }}
                >
                  {chunks.map((chunk, chunkIndex) => (
                    <SwiperSlide key={chunkIndex} className="h-full flex flex-col justify-start gap-[calc(var(--index)*0.35)]">
                      {chunk.map(tx => (
                        <div 
                          key={tx.id} 
                          onClick={() => setSelectedTx(tx)}
                          className="flex items-center justify-between bg-white/40 border border-white/60 px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.6)] shadow-sm shrink-0 cursor-pointer hover:bg-white/70 hover-soft-lift active-press group transition-all"
                        >
                          <div className="flex items-center gap-[calc(var(--index)*0.6)] min-w-0">
                            <div className="w-[calc(var(--index)*1.5)] h-[calc(var(--index)*1.5)] rounded-full bg-[#cbd5e1]/30 border border-white/50 flex items-center justify-center shrink-0 group-hover:bg-[#cbd5e1]/50 transition-colors">
                              {getCategoryIcon(tx.category, tx.counterparty, "w-[calc(var(--index)*0.75)] h-[calc(var(--index)*0.75)] text-[#4C5A7A]")}
                            </div>
                            
                            <div className="flex flex-col min-w-0">
                              <span className="text-[calc(var(--index)*0.5)] font-medium text-[#1e293b] truncate group-hover:underline">
                                {tx.counterparty || 'Транзакция'}
                              </span>
                              <span className="text-[calc(var(--index)*0.38)] text-slate-500 mt-[calc(var(--index)*0.05)] truncate">
                                {tx.category} • {new Date(tx.date).toLocaleDateString('ru-RU')}
                              </span>
                            </div>
                          </div>
                          
                          <span className={`text-[calc(var(--index)*0.55)] font-medium whitespace-nowrap shrink-0 ml-2 text-[#1e293b]`}>
                            {tx.type === 'income' ? '+' : '-'}{Number(tx.amount).toLocaleString('ru-RU')}₽
                          </span>
                        </div>
                      ))}
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* --- ИДЕАЛЬНАЯ АНИМАЦИЯ ЗМЕЙКИ --- */
        @keyframes snakePop {
          0% {
            opacity: 0;
            transform: translateX(-15px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .snake-item {
          opacity: 0;
          animation: snakePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* --- СКРЫТИЕ ПОЛЗУНКА СКРОЛЛА --- */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* --- ВЕРТИКАЛЬНАЯ ПАГИНАЦИЯ SWIPER --- */
        .custom-finance-swiper .swiper-pagination-vertical {
          right: 0px !important;
          left: auto !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
        }
        .custom-finance-swiper .swiper-pagination-bullet {
          margin: 0 !important;
          transition: all 0.3s ease;
        }
        .custom-finance-swiper .swiper-pagination-bullet-active {
          height: 14px !important;
          border-radius: 4px !important;
        }
      `}} />

      <TransactionDetail isOpen={!!selectedTx} transaction={selectedTx} onClose={() => setSelectedTx(null)} onEdit={(tx) => setEditingTx(tx)} />
      <TransactionModal isOpen={!!editingTx} onClose={() => setEditingTx(null)} initialData={editingTx} />
    </section>
  );
};

export default FinanceTransactions;