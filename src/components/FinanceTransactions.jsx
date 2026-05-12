import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import PeriodSwitcher from './PeriodSwitcher';
import { getCategoryIcon } from '../constants/categories'; // Путь к твоему файлу иконок

const FinanceTransactions = () => {
  const { transactions, period } = useFinance();
  
  // Состояния фильтров
  const [filterType, setFilterType] = useState('expense'); // 'income', 'expense', 'all'

  // 1. Фильтрация транзакций
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    
    let filtered = transactions.filter(t => {
      // Фильтр по периоду (из контекста)
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
      // Фильтр по типу (Доход/Траты/Все)
      if (filterType !== 'all' && t.type !== filterType) return false;
      
      return true;
    });

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, period, filterType]);

  // 2. Данные для графика
  const donutData = useMemo(() => {
    // В отличие от макета с категориями, мы показываем только общую сумму отфильтрованных транзакций
    // Чтобы график не лагал, мы делаем однотонное кольцо
    const totalAmount = filteredTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
    return [{ name: "Всего", value: totalAmount || 1 }]; // `|| 1` чтобы Recharts не сломался на 0
  }, [filteredTransactions]);

  // 3. Чанки для Swiper (нарезаем транзакции по 3 штуки на слайд)
  const ITEMS_PER_SLIDE = 3;
  const chunks = [];
  for (let i = 0; i < filteredTransactions.length; i += ITEMS_PER_SLIDE) {
    chunks.push(filteredTransactions.slice(i, i + ITEMS_PER_SLIDE));
  }

  return (
    // Главный контейнер (FFFFFF 50%, backdrop-blur)
    <section className="flex-1 flex flex-col min-h-0 bg-white/50 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/40 p-[calc(var(--index)*1.2)] shadow-sm w-full h-full relative">
      
      {/* --- ШАПКА (СТРОГО ПО МАКЕТУ) --- */}
      <div className="flex items-center justify-between mb-[calc(var(--index)*1.2)] shrink-0">
        
        {/* Переключатель Доход/Траты/Все */}
        <div className="flex items-center bg-white/50 rounded-[calc(var(--index)*0.25)] p-[calc(var(--index)*0.1)] border border-white/30 shadow-sm">
          {[
            { id: 'income', label: 'Доход' },
            { id: 'expense', label: 'Траты' },
            { id: 'all', label: 'Все' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-[calc(var(--index)*0.8)] py-[calc(var(--index)*0.25)] rounded-[calc(var(--index)*0.15)] text-[calc(var(--index)*0.45)] font-medium transition-all duration-300 ${
                filterType === tab.id 
                  ? 'bg-[#4C5A7A] text-white shadow-md' // Активный стиль (4C5A7A)
                  : 'text-slate-500 hover:text-[#4C5A7A]' // Неактивный стиль
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Переключатель периодов (импортируем твой компонент, если он есть) */}
        {/* Если PeriodSwitcher выглядит не так, как на макете, присылай его код. Пока предполагаю, что он стилизован аналогично переключателю выше. */}
        <div className="shrink-0 w-fit">
          <PeriodSwitcher />
        </div>
      </div>

      {/* --- ОСНОВНАЯ ЧАСТЬ --- */}
      <div className="flex-1 flex flex-col lg:flex-row gap-[calc(var(--index)*2)] min-h-0 h-full relative">
        
        {/* ЛЕВАЯ КОЛОНКА: График и кнопка Категории */}
        <div className="flex flex-col items-center justify-start shrink-0 lg:w-[35%] relative">
          
          <div className="w-[calc(var(--index)*11)] h-[calc(var(--index)*11)] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius="75%" 
                  outerRadius="100%"
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={false} // Отключаем анимацию от лагов
                >
                  {/* Однотонное темно-серое/синее кольцо */}
                  <Cell fill="#4C5A7A" /> 
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Сумма по центру кольца */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[#1e293b] text-[calc(var(--index)*1)] font-medium leading-none tracking-tight">
                {donutData[0].value.toLocaleString('ru-RU')}₽
              </span>
            </div>
          </div>

          <button className="mt-[calc(var(--index)*1)] self-start flex items-center gap-[calc(var(--index)*0.25)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.25)] bg-white/60 border border-slate-300 rounded-full hover:bg-white transition-colors cursor-pointer shadow-sm">
            <svg className="w-[calc(var(--index)*0.55)] h-[calc(var(--index)*0.55)] text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="text-slate-600 text-[calc(var(--index)*0.4)] font-medium">Категории</span>
          </button>
        </div>

        {/* ПРАВАЯ КОЛОНКА: Swiper Список */}
        <div className="flex-1 flex flex-col min-h-0 w-full relative pb-[calc(var(--index)*1)]">
          <h3 className="text-[#334155] text-[calc(var(--index)*0.6)] font-medium mb-[calc(var(--index)*0.6)] shrink-0 px-[calc(var(--index)*0.2)]">
            Все транзакции
          </h3>
          
          <div className="flex-1 w-full h-full relative">
            {chunks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400 font-medium text-[calc(var(--index)*0.5)]">
                Транзакций пока нет
              </div>
            ) : (
              <Swiper
                modules={[Pagination, Mousewheel]}
                pagination={{ clickable: true }}
                direction="horizontal"
                mousewheel={true}
                spaceBetween={20}
                slidesPerView={1}
                className="h-full w-full custom-horizontal-swiper pb-[calc(var(--index)*1.2)]"
                style={{
                  "--swiper-pagination-color": "#4C5A7A", // Цвет точек (активный)
                  "--swiper-pagination-bullet-inactive-color": "#cbd5e1", // Цвет точек (неактивный)
                  "--swiper-pagination-bullet-inactive-opacity": "1",
                  "--swiper-pagination-bullet-size": "8px",
                  "--swiper-pagination-bottom": "0px"
                }}
              >
                {chunks.map((chunk, chunkIndex) => (
                  <SwiperSlide key={chunkIndex} className="flex flex-col gap-[calc(var(--index)*0.35)]">
                    {chunk.map(tx => (
                      // КАРТОЧКА: (FFFFFF 50%, закругления, отступы)
                      <div key={tx.id} className="flex items-center justify-between bg-white/50 border border-white/60 px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.45)] rounded-[calc(var(--index)*0.6)] shadow-sm shrink-0">
                        <div className="flex items-center gap-[calc(var(--index)*0.6)]">
                          {/* Иконка */}
                          <div className="w-[calc(var(--index)*1.6)] h-[calc(var(--index)*1.6)] rounded-full bg-[#cbd5e1]/40 flex items-center justify-center shrink-0">
                            {getCategoryIcon(tx.category, tx.counterparty, "w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)] text-[#1e293b]")}
                          </div>
                          
                          <div className="flex flex-col">
                            <span className="text-[calc(var(--index)*0.5)] font-medium text-[#1e293b] truncate max-w-[calc(var(--index)*10)] leading-tight">
                              {tx.counterparty || 'Транзакция'}
                            </span>
                            <span className="text-[calc(var(--index)*0.38)] text-slate-400 mt-[calc(var(--index)*0.08)]">
                              {tx.category} • {new Date(tx.date).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        </div>
                        
                        {/* Сумма */}
                        <span className={`text-[calc(var(--index)*0.6)] font-medium whitespace-nowrap text-[#1e293b]`}>
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

    </section>
  );
};

export default FinanceTransactions;