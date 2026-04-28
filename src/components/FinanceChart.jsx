import React, { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  LineChart, Line, XAxis, Tooltip, ResponsiveContainer, YAxis 
} from 'recharts';
import PeriodSwitcher from './PeriodSwitcher';

const FinanceChart = () => {
  const { transactions, period, periodIncome, periodExpense } = useFinance();

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
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/50 p-3 rounded-xl shadow-lg">
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
    <div className="flex flex-col lg:flex-row w-full gap-[calc(var(--index)*2)] lg:h-[calc(var(--index)*13.5)]">
      
      {/* ЛЕВАЯ КОЛОНКА */}
      <div className="flex flex-col shrink-0 lg:w-[30%] py-[calc(var(--index)*0.2)]">
        <div className="mb-[calc(var(--index)*.25)]">
          <PeriodSwitcher />
        </div>

        <div className="flex flex-col gap-[calc(var(--index)*1.2)]">
          <div>
            <p className="text-slate-500 font-medium text-[calc(var(--index)*0.45)] mb-[calc(var(--index)*0.2)] opacity-80">Средние траты</p>
            <p className="text-[#1e293b] text-[calc(var(--index)*1.5)] font-medium leading-none tracking-tight">
              {avgExpense.toLocaleString('ru-RU')}₽
            </p>
          </div>
          
          <div>
            <p className="text-slate-500 font-medium text-[calc(var(--index)*0.45)] mb-[calc(var(--index)*0.2)] opacity-80">Средний доход</p>
            <p className="text-[#1e293b] text-[calc(var(--index)*1.5)] font-medium leading-none tracking-tight">
              {avgIncome.toLocaleString('ru-RU')}₽
            </p>
          </div>
          
          <div>
            <p className="text-slate-500 font-medium text-[calc(var(--index)*0.45)] mb-[calc(var(--index)*0.3)] opacity-80">Рентабельность</p>
            <p className="text-[#3b82f6] text-[calc(var(--index)*1.6)] font-medium leading-none tracking-tighter">
              {profitability}%
            </p>
          </div>
        </div>
      </div>

      {/* ПРАВАЯ КОЛОНКА */}
      <div className="flex-1 flex flex-col relative min-w-0 h-full">
        
        {/* Фикс черной рамки */}
        <style dangerouslySetInnerHTML={{ __html: `.recharts-wrapper { outline: none !important; }` }} />

        {chartData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-medium text-[calc(var(--index)*0.5)]">
            Нет данных для графика
          </div>
        ) : (
          <div className="flex-1 w-full relative pb-[calc(var(--index)*2)]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <YAxis hide domain={['auto', 'auto']} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 400 }}
                  dy={10}
                  tickFormatter={(val) => val.charAt(0).toUpperCase() + val.slice(1)}
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '5 5' }} 
                  isAnimationActive={false}
                />
                <Line 
                  hide={hiddenLines.expense}
                  type="monotone" 
                  dataKey="Траты" 
                  stroke="#475569" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0, fill: '#475569' }}
                />
                <Line 
                  hide={hiddenLines.income}
                  type="monotone" 
                  dataKey="Доход" 
                  stroke="#60a5fa" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0, fill: '#60a5fa' }}
                />
              </LineChart>
            </ResponsiveContainer>
            
            {/* ЛЕГЕНДА */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-[calc(var(--index)*0.5)] z-10">
              <div onClick={() => toggleLine('expense')} className={`flex items-center gap-2 px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.2)] rounded-full backdrop-blur-md cursor-pointer transition-all duration-300 select-none ${hiddenLines.expense ? 'bg-slate-300/30 opacity-40 grayscale' : 'bg-[#475569]/15 hover:bg-[#475569]/25'}`}>
                <div className="w-2 h-2 rounded-full bg-[#475569]"></div>
                <span className="text-[calc(var(--index)*0.45)] text-[#334155] font-medium">Траты</span>
              </div>
              <div onClick={() => toggleLine('income')} className={`flex items-center gap-2 px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.2)] rounded-full backdrop-blur-md cursor-pointer transition-all duration-300 select-none ${hiddenLines.income ? 'bg-slate-300/30 opacity-40 grayscale' : 'bg-[#60a5fa]/20 hover:bg-[#60a5fa]/30'}`}>
                <div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>
                <span className="text-[calc(var(--index)*0.45)] text-[#2563eb] font-medium">Доход</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceChart;