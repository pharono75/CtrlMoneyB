import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import PeriodSwitcher from './PeriodSwitcher';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getCategoryIcon } from '../constants/categories'; // Путь к твоему файлу иконок

const FinanceTransactions = () => {
  const { transactions, period } = useFinance();
  const [filterType, setFilterType] = useState('expense'); // 'income', 'expense', 'all'

  // 1. Фильтруем транзакции по периоду (из контекста) и типу (из локального стейта)
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    
    let filtered = transactions.filter(t => {
      // Фильтр по периоду
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
      // Фильтр по типу
      if (filterType !== 'all' && t.type !== filterType) return false;
      
      return true;
    });

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, period, filterType]);

  // 2. Подготовка данных для кольцевого графика
  const donutData = useMemo(() => {
    const grouped = {};
    let total = 0;

    filteredTransactions.forEach(t => {
      const cat = t.category || 'Прочее';
      grouped[cat] = (grouped[cat] || 0) + Number(t.amount);
      total += Number(t.amount);
    });

    const data = Object.entries(grouped).map(([name, value]) => ({ name, value }));
    return { data, total };
  }, [filteredTransactions]);

  // Цвета для сегментов графика
  const COLORS = ['#475569', '#60a5fa', '#94a3b8', '#3b82f6', '#cbd5e1', '#2563eb'];

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white/40 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/50 p-[calc(var(--index)*1.2)] shadow-sm w-full">
      
      {/* ШАПКА: Фильтры типа и периода */}
      <div className="flex items-center justify-between mb-[calc(var(--index)*1.5)] shrink-0">
        
        {/* Переключатель Доход/Траты/Все */}
        <div className="flex items-center bg-white/60 rounded-[calc(var(--index)*0.4)] p-1 shadow-sm">
          {[
            { id: 'income', label: 'Доход' },
            { id: 'expense', label: 'Траты' },
            { id: 'all', label: 'Все' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-[calc(var(--index)*0.8)] py-[calc(var(--index)*0.25)] rounded-[calc(var(--index)*0.3)] text-[calc(var(--index)*0.5)] font-medium transition-all duration-300 ${
                filterType === tab.id 
                  ? 'bg-[#475569] text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Переключатель Месяц/Квартал/Год */}
        <PeriodSwitcher />
      </div>

      {/* ОСНОВНОЙ КОНТЕНТ: График слева, Список справа */}
      <div className="flex-1 flex flex-col lg:flex-row gap-[calc(var(--index)*2)] min-h-0">
        
        {/* ЛЕВАЯ ЧАСТЬ: Кольцевой график */}
        <div className="flex flex-col items-center justify-center shrink-0 lg:w-[35%] relative">
          <div className="w-[calc(var(--index)*12)] h-[calc(var(--index)*12)] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData.data}
                  cx="50%"
                  cy="50%"
                  innerRadius="75%" // Толщина кольца
                  outerRadius="100%"
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                  isAnimationActive={false} // Отключаем анимацию от лагов
                >
                  {donutData.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Сумма внутри кольца */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[#1e293b] text-[calc(var(--index)*1.2)] font-medium leading-none tracking-tight">
                {donutData.total.toLocaleString('ru-RU')}₽
              </span>
            </div>
          </div>

          {/* Кнопка "Категории" (Фильтр) */}
          <button className="mt-[calc(var(--index)*1.5)] flex items-center gap-2 px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.3)] bg-white/60 hover:bg-white border border-slate-200 rounded-full transition-colors">
            <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="text-slate-600 text-[calc(var(--index)*0.45)] font-medium">Категории</span>
          </button>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: Список транзакций (Скроллируемый) */}
        <div className="flex-1 flex flex-col min-h-0">
          <h3 className="text-[#334155] text-[calc(var(--index)*0.7)] font-medium mb-[calc(var(--index)*0.8)] shrink-0">
            Все транзакции
          </h3>
          
          {/* Контейнер списка со скроллом */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-[calc(var(--index)*0.4)] pr-2">
            {filteredTransactions.length === 0 ? (
              <div className="text-slate-400 text-center mt-10">Нет транзакций за выбранный период</div>
            ) : (
              filteredTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-[calc(var(--index)*0.6)] bg-white/60 rounded-[calc(var(--index)*0.4)] border border-white/40 shadow-sm shrink-0">
                  <div className="flex items-center gap-[calc(var(--index)*0.6)]">
                    <div className="w-[calc(var(--index)*1.6)] h-[calc(var(--index)*1.6)] rounded-full bg-slate-200/50 flex items-center justify-center shrink-0">
                      {getCategoryIcon(t.category, t.counterparty, "w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)] text-[#475569]")}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[#1e293b] text-[calc(var(--index)*0.55)] font-medium truncate max-w-[250px]">{t.description || t.category}</span>
                      <span className="text-slate-400 text-[calc(var(--index)*0.4)] truncate max-w-[250px]">
                        {t.category} • {new Date(t.date).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[calc(var(--index)*0.65)] font-medium whitespace-nowrap ${t.type === 'income' ? 'text-[#1e293b]' : 'text-[#1e293b]'}`}>
                    {t.type === 'income' ? '+' : '-'}{Number(t.amount).toLocaleString('ru-RU')}₽
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinanceTransactions;