import React, { useMemo, useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  LineChart, Line, XAxis, Tooltip, ResponsiveContainer, YAxis 
} from 'recharts';
import PeriodSwitcher from './PeriodSwitcher';
import MoneyDisplay from './Common/MoneyDisplay';

// === 1. КОНФИГУРАЦИЯ ТЕМ ===
const THEMES = {
  classic: {
    income: '#60a5fa', // Голубой
    expense: '#475569', // Серый (Слейт)
    text: '#94a3b8',
    grid: '#cbd5e1'
  },
  highContrast: {
    income: '#000000', // Черный
    expense: '#991b1b', // Бордовый
    text: '#000000',
    grid: '#000000'
  },
  soft: {
    income: '#34d399', // Мятный
    expense: '#fb7185', // Розовый
    text: '#94a3b8',
    grid: '#e2e8f0'
  }
};

// === 2. ХУК ЧТЕНИЯ ТЕМЫ ===
const useChartTheme = () => {
  const [themeName, setThemeName] = useState('classic');

  useEffect(() => {
    const checkTheme = () => {
      const saved = localStorage.getItem('appSettings');
      if (saved) {
        setThemeName(JSON.parse(saved).chartTheme || 'classic');
      }
    };
    checkTheme();
    window.addEventListener('settingsChanged', checkTheme);
    return () => window.removeEventListener('settingsChanged', checkTheme);
  }, []);

  return THEMES[themeName] || THEMES.classic;
};

const FinanceChart = ({ compact = false }) => {
  const { transactions, period, periodIncome, periodExpense } = useFinance();
  const theme = useChartTheme(); // <--- ПОЛУЧАЕМ АКТУАЛЬНУЮ ТЕМУ

  const [hiddenLines, setHiddenLines] = useState({
    expense: false,
    income: false
  });

  const chartData = useMemo(() => {
    const now = new Date();
    const filtered = transactions.filter(t => {
      if (period === 'all') return true;
      const tDate = new Date(t.date);
      if (period === 'month') return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      if (period === 'quarter') {
        const currentQuarter = Math.floor(now.getMonth() / 3);
        const tQuarter = Math.floor(tDate.getMonth() / 3);
        return currentQuarter === tQuarter && tDate.getFullYear() === now.getFullYear();
      }
      if (period === 'year') return tDate.getFullYear() === now.getFullYear();
      return true;
    });

    const grouped = {};
    filtered.forEach(t => {
      const d = new Date(t.date);
      const dateKey = (period === 'year' || period === 'all' || period === 'quarter')
        ? d.toLocaleDateString('ru-RU', { month: 'short' }) 
        : d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });

      if (!grouped[dateKey]) grouped[dateKey] = { name: dateKey, Доход: 0, Траты: 0, rawDate: d };
      if (t.type === 'income') grouped[dateKey].Доход += Number(t.amount);
      if (t.type === 'expense') grouped[dateKey].Траты += Number(t.amount);
    });

    return Object.values(grouped).sort((a, b) => a.rawDate - b.rawDate);
  }, [transactions, period]);

  const daysOrMonths = chartData.length || 1; 
  const avgIncome = Math.round(periodIncome / daysOrMonths);
  const avgExpense = Math.round(periodExpense / daysOrMonths);
  const profitability = periodIncome > 0 ? Math.round(((periodIncome - periodExpense) / periodIncome) * 100) : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 p-3 rounded-xl shadow-lg">
          <p className="text-slate-500 font-medium text-[calc(var(--index)*0.45)] mb-2 capitalize">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-[calc(var(--index)*0.5)] font-medium" style={{ color: entry.color }}>
              <span>{entry.name}:</span>
              <span>{Number(entry.value).toLocaleString('ru-RU')} ₽</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const toggleLine = (lineKey) => {
    setHiddenLines(prev => ({ ...prev, [lineKey]: !prev[lineKey] }));
  };

  return (
    <div className={`flex flex-col w-full ${compact ? 'h-[220px]' : 'lg:flex-row lg:h-[calc(var(--index)*13.5)] gap-[calc(var(--index)*2)]'}`}>
      
      {/* ЛЕВАЯ КОЛОНКА — только на десктопе */}
      {!compact && (
      <div className="flex flex-col shrink-0 lg:w-[30%] py-[calc(var(--index)*0.2)]">
        <div className="mb-[calc(var(--index)*.25)]">
          <PeriodSwitcher />
        </div>

        <div className="flex flex-col gap-[calc(var(--index)*1.2)]">
          <div>
            <p className="text-slate-500 dark:text-white/60 font-medium text-[calc(var(--index)*0.45)] mb-[calc(var(--index)*0.2)] opacity-80">Средние траты</p>
            <MoneyDisplay amount={avgExpense} className="text-[#1e293b] dark:text-white text-[calc(var(--index)*1.5)] font-medium leading-none tracking-tight" />
          </div>
          
          <div>
            <p className="text-slate-500 dark:text-white/60 font-medium text-[calc(var(--index)*0.45)] mb-[calc(var(--index)*0.2)] opacity-80">Средний доход</p>
            <MoneyDisplay amount={avgIncome} className="text-[#1e293b] dark:text-white text-[calc(var(--index)*1.5)] font-medium leading-none tracking-tight" />
          </div>
          
          <div>
            <p className="text-slate-500 dark:text-white/60 font-medium text-[calc(var(--index)*0.45)] mb-[calc(var(--index)*0.3)] opacity-80">Рентабельность</p>
            <p className="text-[#3b82f6] dark:text-white text-[calc(var(--index)*1.6)] font-medium leading-none tracking-tighter transition-colors">
              {profitability}%
            </p>
          </div>
        </div>
      </div>
      )}

      {/* ПРАВАЯ КОЛОНКА / График */}
      <div className={`flex-1 flex flex-col relative min-w-0 ${compact ? 'h-full' : 'h-full'}`}>
        
        <style dangerouslySetInnerHTML={{ __html: `.recharts-wrapper { outline: none !important; }` }} />

        {chartData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-medium text-[calc(var(--index)*0.5)]">
            Нет данных для графика
          </div>
        ) : (
          <div className={`flex-1 w-full relative transition-colors duration-500 ${compact ? 'pb-0' : 'pb-[calc(var(--index)*2)]'}`}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <YAxis hide domain={['auto', 'auto']} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: theme.text, fontSize: 11, fontWeight: 400 }}
                  dy={10}
                  tickFormatter={(val) => val.charAt(0).toUpperCase() + val.slice(1)}
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ stroke: theme.grid, strokeWidth: 1, strokeDasharray: '5 5' }} 
                  isAnimationActive={false}
                />
                <Line 
                  hide={hiddenLines.expense}
                  type="monotone" 
                  dataKey="Траты" 
                  stroke={theme.expense} // ДИНАМИЧЕСКИЙ ЦВЕТ
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0, fill: theme.expense }}
                />
                <Line 
                  hide={hiddenLines.income}
                  type="monotone" 
                  dataKey="Доход" 
                  stroke={theme.income} // ДИНАМИЧЕСКИЙ ЦВЕТ
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0, fill: theme.income }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            {/* ЛЕГЕНДА — скрыта в compact */}
            {!compact && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-[calc(var(--index)*0.5)] z-10">
              <div 
                onClick={() => toggleLine('expense')} 
                className={`flex items-center gap-2 px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.2)] rounded-full backdrop-blur-md cursor-pointer transition-all duration-300 select-none ${hiddenLines.expense ? 'bg-slate-300/30 opacity-40 grayscale' : 'bg-black/5 hover:bg-black/10'}`}
              >
                {/* Кружочек и текст легенды тоже меняют цвет по теме! */}
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.expense }}></div>
                <span className="text-[calc(var(--index)*0.45)] font-medium" style={{ color: theme.expense }}>Траты</span>
              </div>
              <div 
                onClick={() => toggleLine('income')} 
                className={`flex items-center gap-2 px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.2)] rounded-full backdrop-blur-md cursor-pointer transition-all duration-300 select-none ${hiddenLines.income ? 'bg-slate-300/30 opacity-40 grayscale' : 'bg-black/5 hover:bg-black/10'}`}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.income }}></div>
                <span className="text-[calc(var(--index)*0.45)] font-medium" style={{ color: theme.income }}>Доход</span>
              </div>
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceChart;