import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

/**
 * Line Chart - Динамика доходов/расходов по месяцам
 */
export const LineChartComponent = ({ monthlyTrend }) => {
  if (!monthlyTrend || Object.keys(monthlyTrend).length === 0) return null;

  const data = Object.entries(monthlyTrend)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, values]) => ({
      month,
      income: values.income,
      expense: values.expense,
    }));

  return (
    <div className="w-full h-80 bg-white rounded-lg border border-slate-200 p-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">📈 Динамика по месяцам</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `${value.toLocaleString('ru-RU')} ₽`} />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#10b981" name="Доходы" strokeWidth={2} />
          <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Расходы" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Waterfall Chart - Распределение расходов
 */
export const WaterfallChartComponent = ({ categories }) => {
  if (!categories || Object.keys(categories).length === 0) return null;

  const data = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, value]) => ({
      name,
      value,
    }));

  const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6'];

  return (
    <div className="w-full h-80 bg-white rounded-lg border border-slate-200 p-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">🌊 Водопад расходов (Top 10)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `${value.toLocaleString('ru-RU')} ₽`} />
          <Bar dataKey="value" name="Сумма" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
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
  if (!budgets || budgets.length === 0) return null;

  return (
    <div className="w-full bg-white rounded-lg border border-slate-200 p-4">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">📊 Прогресс по бюджетам</h3>
      <div className="flex flex-col gap-4">
        {budgets.map((budget) => {
          const spent = expenses[budget.category] || 0;
          const percent = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0;
          const isWarning = spent > budget.limit;
          const statusColor = isWarning ? '#ef4444' : '#3b82f6';

          return (
            <div key={budget.category} style={{ borderLeft: `3px solid ${statusColor}` }} className="bg-white p-3 rounded border">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-sm text-slate-900">{budget.category}</span>
                <span style={{ color: statusColor }} className="font-bold text-sm">
                  {spent.toLocaleString('ru-RU')} / {budget.limit.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded h-2 overflow-hidden">
                <div style={{ width: `${percent}%`, backgroundColor: statusColor }} className="h-full rounded" />
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {Math.round(percent)}% {isWarning ? '⚠️ Превышено' : ''}
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
    <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">🤖 AI Insights & Прогнозирование</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
          <div className="text-sm font-semibold mb-2">📊 Анализ тренда</div>
          <div className="text-base">
            Расходы <span className="font-bold">{trendDirection}</span> на{' '}
            <span className="font-bold">{Math.abs(trendPercent)}%</span> за последние 3 месяца
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
          <div className="text-sm font-semibold mb-2">🔮 Прогноз на следующий месяц</div>
          <div className="text-base">
            Ожидаемые расходы: <span className="font-bold">{forecasted.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20">
          <div className="text-sm font-semibold mb-2">⚠️ Аномалии</div>
          <div className="text-base">
            {anomalies.length > 0 ? `${anomalies.length} месяцев с высокими расходами` : 'Аномалий не обнаружено'}
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
