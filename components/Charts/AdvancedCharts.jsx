import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// === 1. ЕДИНАЯ КОНФИГУРАЦИЯ ТЕМ (Синхронизировано с FinanceChart) ===
const THEMES = {
  classic: { 
    income: '#60a5fa', // Голубой
    expense: '#475569', // Серый (Слейт)
    grid: '#cbd5e1',
    text: '#94a3b8',
    budgetSafe: '#60a5fa', 
    budgetWarning: '#ef4444', // Оставляем красным для внимания
    // Градиент от серого к синему для водопада
    waterfall: ['#475569', '#64748b', '#94a3b8', '#cbd5e1', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb']
  },
  highContrast: { 
    income: '#000000', // Черный
    expense: '#991b1b', // Темно-бордовый
    grid: '#000000',
    text: '#000000',
    budgetSafe: '#000000', 
    budgetWarning: '#991b1b', 
    waterfall: ['#991b1b', '#b91c1c', '#dc2626', '#ef4444', '#000000', '#1e293b', '#334155', '#475569']
  },
  soft: { 
    income: '#34d399', // Мятный
    expense: '#fb7185', // Розовый
    grid: '#e2e8f0',
    text: '#94a3b8',
    budgetSafe: '#7dd3fc', 
    budgetWarning: '#fb7185', 
    waterfall: ['#fb7185', '#fda4af', '#fecdd3', '#d9f99d', '#bbf7d0', '#6ee7b7', '#5eead4', '#67e8f9']
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


/**
 * Line Chart - Динамика доходов/расходов по месяцам
 */
export const LineChartComponent = ({ monthlyTrend }) => {
  const theme = useChartTheme();

  if (!monthlyTrend || Object.keys(monthlyTrend).length === 0) return null;

  const data = Object.entries(monthlyTrend)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, values]) => ({
      month,
      income: values.income,
      expense: values.expense,
    }));

  return (
    <div className="w-full h-80 bg-white rounded-lg border border-slate-200 p-4 transition-colors duration-500">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">📈 Динамика по месяцам</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
          <XAxis dataKey="month" tick={{ fill: theme.text }} axisLine={{ stroke: theme.grid }} />
          <YAxis tick={{ fill: theme.text }} axisLine={{ stroke: theme.grid }} />
          <Tooltip 
            formatter={(value) => `${value.toLocaleString('ru-RU')} ₽`} 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend />
          <Line type="monotone" dataKey="income" stroke={theme.income} name="Доходы" strokeWidth={3} dot={{ r: 4, fill: theme.income }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="expense" stroke={theme.expense} name="Расходы" strokeWidth={3} dot={{ r: 4, fill: theme.expense }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Waterfall Chart - Распределение расходов
 */
export const WaterfallChartComponent = ({ categories }) => {
  const theme = useChartTheme();

  if (!categories || Object.keys(categories).length === 0) return null;

  const data = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({
      name,
      value,
    }));

  return (
    <div className="w-full h-80 bg-white rounded-lg border border-slate-200 p-4 transition-colors duration-500">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">🌊 Водопад расходов (Top 10)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
          <XAxis dataKey="name" tick={{ fill: theme.text }} axisLine={{ stroke: theme.grid }} />
          <YAxis tick={{ fill: theme.text }} axisLine={{ stroke: theme.grid }} />
          <Tooltip 
            formatter={(value) => `${value.toLocaleString('ru-RU')} ₽`}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="value" name="Сумма" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={theme.waterfall[index % theme.waterfall.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Budget Progress - Прогресс по бюджетам
 */
export const BudgetProgressComponent = ({ budgets, expenses }) => {
  const theme = useChartTheme();

  if (!budgets || budgets.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-lg border border-slate-200 p-4 transition-colors duration-500">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">📊 Прогресс по бюджетам</h3>
      <div className="flex flex-col gap-4">
        {budgets.map((budget) => {
          const spent = expenses[budget.category] || 0;
          const percent = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0;
          const isWarning = spent > budget.limit;
          
          const statusColor = isWarning ? theme.budgetWarning : theme.budgetSafe;

          return (
            <div key={budget.category} style={{ borderLeft: `3px solid ${statusColor}` }} className="bg-white p-3 rounded border shadow-sm transition-all duration-300">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-sm text-slate-900">{budget.category}</span>
                <span style={{ color: statusColor }} className="font-bold text-sm transition-colors duration-300">
                  {spent.toLocaleString('ru-RU')} / {budget.limit.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  style={{ width: `${percent}%`, backgroundColor: statusColor }} 
                  className="h-full rounded-full transition-all duration-500 ease-out" 
                />
              </div>
              <div className="text-xs text-slate-500 mt-2 font-medium">
                {Math.round(percent)}% {isWarning ? '⚠️ Лимит превышен' : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * AI Insights Card
 */
export const AIInsightsComponent = ({ monthlyTrend }) => {
  if (!monthlyTrend || Object.keys(monthlyTrend).length === 0) return null;

  const months = Object.keys(monthlyTrend).sort();
  const recentMonths = months.slice(-3);
  const recentExpenses = recentMonths.map((m) => monthlyTrend[m]?.expense || 0);
  const avgRecentExpense = recentExpenses.reduce((a, b) => a + b, 0) / recentExpenses.length || 0;

  const previousMonths = months.slice(Math.max(0, months.length - 6), months.length - 3);
  const prevExpenses = previousMonths.map((m) => monthlyTrend[m]?.expense || 0);
  const avgPrevExpense = prevExpenses.length > 0 ? prevExpenses.reduce((a, b) => a + b, 0) / prevExpenses.length : 0;

  const trendPercent = avgPrevExpense > 0 ? Math.round(((avgRecentExpense - avgPrevExpense) / avgPrevExpense) * 100) : 0;
  const trendDirection = trendPercent > 0 ? '↗️ РАСТУТ' : trendPercent < 0 ? '↘️ ПАДАЮТ' : '→ СТАБИЛЬНЫ';

  const avgExpense = Object.values(monthlyTrend).reduce((sum, m) => sum + (m.expense || 0), 0) / Object.keys(monthlyTrend).length || 0;
  const forecasted = avgExpense + (avgRecentExpense - avgPrevExpense);

  const allExpenses = months.map((m) => monthlyTrend[m].expense);
  const avgAll = allExpenses.reduce((a, b) => a + b, 0) / allExpenses.length || 0;
  const stdDev = Math.sqrt(allExpenses.reduce((sum, val) => sum + Math.pow(val - avgAll, 2), 0) / allExpenses.length);
  const anomalyThreshold = avgAll + stdDev * 1.5;
  const anomalies = months.filter((m) => monthlyTrend[m].expense > anomalyThreshold);

  return (
    <div className="w-full bg-gradient-to-br from-[#4C5A7A] to-[#3b465e] rounded-lg p-6 text-white shadow-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>🤖</span> AI Insights & Прогнозирование
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 hover:bg-white/15 transition-colors">
          <div className="text-sm font-medium text-slate-200 mb-2">📊 Анализ тренда</div>
          <div className="text-base">
            Расходы <span className="font-bold">{trendDirection}</span> на{' '}
            <span className="font-bold">{Math.abs(trendPercent)}%</span> за последние 3 месяца
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 hover:bg-white/15 transition-colors">
          <div className="text-sm font-medium text-slate-200 mb-2">🔮 Прогноз на след. месяц</div>
          <div className="text-base">
            Ожидаемые расходы: <br/>
            <span className="font-bold text-lg">{forecasted.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 hover:bg-white/15 transition-colors">
          <div className="text-sm font-medium text-slate-200 mb-2">⚠️ Аномалии</div>
          <div className="text-base">
            {anomalies.length > 0 ? (
              <><span className="font-bold text-red-300">{anomalies.length} месяцев</span> с очень высокими тратами</>
            ) : (
              'Критических аномалий не обнаружено'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  LineChartComponent,
  WaterfallChartComponent,
  BudgetProgressComponent,
  AIInsightsComponent,
};