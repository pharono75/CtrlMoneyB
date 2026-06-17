import html2pdf from 'html2pdf.js';

// ============================================
// ЭТАП 1-2: ПОЛУЧЕНИЕ И ОБРАБОТКА ДАННЫХ
// ============================================

/**
 * Агрегирует данные для отчета: получает доходы, расходы, категории, бюджеты
 */
export const aggregateReportData = (transactions) => {
  const categoryStats = {};
  const categoryIncome = {};
  const categoryExpense = {};
  const monthlyTrend = {};
  
  transactions.forEach(t => {
    const category = t.category || 'Прочее';
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (t.type === 'income') {
      categoryIncome[category] = (categoryIncome[category] || 0) + Number(t.amount);
    } else {
      categoryStats[category] = (categoryStats[category] || 0) + Number(t.amount);
      categoryExpense[category] = (categoryExpense[category] || 0) + Number(t.amount);
    }
    
    monthlyTrend[monthKey] = (monthlyTrend[monthKey] || { income: 0, expense: 0 });
    if (t.type === 'income') {
      monthlyTrend[monthKey].income += Number(t.amount);
    } else {
      monthlyTrend[monthKey].expense += Number(t.amount);
    }
  });
  
  return { categoryStats, categoryIncome, categoryExpense, monthlyTrend };
};

// ============================================
// ЭТАП 3-6: ГЕНЕРАТОРЫ ГРАФИКОВ И ДИАГРАММ
// ============================================

const generateSummaryChart = (income, expense) => {
  const max = Math.max(income, expense, 1);
  const incW = (income / max) * 100;
  const expW = (expense / max) * 100;
  
  return `
    <div style="margin: 20px 0; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; page-break-inside: avoid;">
      <h4 style="margin: 0 0 15px 0; color: #475569; font-size: 14px; font-weight: bold;">Динамика Доходы / Траты</h4>
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 6px;">
          <span style="font-weight: 600;">Поступления</span>
          <span style="color: #10b981; font-weight: bold;">${income.toLocaleString('ru-RU')} ₽</span>
        </div>
        <div style="width: 100%; background: #e2e8f0; border-radius: 6px; height: 16px; overflow: hidden;">
          <div style="width: ${incW}%; background: #10b981; height: 100%; border-radius: 6px;"></div>
        </div>
      </div>
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-bottom: 6px;">
          <span style="font-weight: 600;">Траты</span>
          <span style="color: #ef4444; font-weight: bold;">${expense.toLocaleString('ru-RU')} ₽</span>
        </div>
        <div style="width: 100%; background: #e2e8f0; border-radius: 6px; height: 16px; overflow: hidden;">
          <div style="width: ${expW}%; background: #ef4444; height: 100%; border-radius: 6px;"></div>
        </div>
      </div>
    </div>
  `;
};

const generateCategoryChart = (categories) => {
  const entries = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return '';
  const max = entries[0][1];
  
  let html = `<div style="margin: 20px 0; background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; page-break-inside: avoid;"><h4 style="margin: 0 0 15px 0; color: #475569; font-size: 14px; font-weight: bold;">Диаграмма распределения расходов</h4><div style="display: flex; flex-direction: column; gap: 12px;">`;
  entries.forEach(([name, val]) => {
    const width = Math.max((val / max) * 100, 1);
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#14b8a6'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    html += `<div style="display: flex; align-items: center; gap: 15px;"><div style="width: 130px; font-size: 12px; color: #475569; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${name}">${name}</div><div style="flex: 1; display: flex; align-items: center; gap: 10px;"><div style="width: 100%; background: #f1f5f9; border-radius: 4px; height: 12px; overflow: hidden;"><div style="width: ${width}%; background: ${color}; height: 100%; border-radius: 4px;"></div></div><div style="width: 70px; font-size: 12px; font-weight: bold; color: #1e293b; text-align: right;">${val.toLocaleString('ru-RU')} ₽</div></div></div>`;
  });
  html += `</div></div>`;
  return html;
};

// Генерация дополнительного графика - сравнение категорий
const generateComparativeChart = (categoryIncome, categoryExpense) => {
  const allCategories = new Set([...Object.keys(categoryIncome), ...Object.keys(categoryExpense)]);
  if (allCategories.size === 0) return '';
  
  const max = Math.max(
    ...Array.from(allCategories).map(cat => Math.max(categoryIncome[cat] || 0, categoryExpense[cat] || 0))
  );
  
  let html = `<div style="margin: 20px 0; background: #f0f9ff; padding: 15px; border-radius: 8px; border: 1px solid #bfdbfe; page-break-inside: avoid;"><h4 style="margin: 0 0 15px 0; color: #1e40af; font-size: 14px; font-weight: bold;">Сравнительный анализ: Доходы vs Расходы по категориям</h4><div style="display: flex; flex-direction: column; gap: 10px;">`;
  
  Array.from(allCategories).sort().forEach(cat => {
    const income = categoryIncome[cat] || 0;
    const expense = categoryExpense[cat] || 0;
    const incomeWidth = (income / max) * 100;
    const expenseWidth = (expense / max) * 100;
    
    html += `<div><div style="font-size: 11px; color: #475569; font-weight: 600; margin-bottom: 4px;">${cat}</div><div style="display: flex; gap: 20px; align-items: center;"><div style="flex: 1;"><div style="font-size: 10px; color: #64748b; margin-bottom: 2px;">Доходы</div><div style="background: #f1f5f9; border-radius: 3px; height: 8px; overflow: hidden;"><div style="width: ${incomeWidth}%; background: #10b981; height: 100%;"></div></div></div><div style="flex: 1;"><div style="font-size: 10px; color: #64748b; margin-bottom: 2px;">Расходы</div><div style="background: #f1f5f9; border-radius: 3px; height: 8px; overflow: hidden;"><div style="width: ${expenseWidth}%; background: #ef4444; height: 100%;"></div></div></div></div></div>`;
  });
  
  html += `</div></div>`;
  return html;
};

// ============================================
// ЭТАП 7-8: АВТОМАТИЧЕСКИЙ АНАЛИЗ
// ============================================

/**
 * Генерирует автоматический анализ с выводами и рекомендациями
 */
export const generateAnalysis = (transactions, budgets, categoryStats) => {
  const warnings = [];
  const recommendations = [];
  const financialTrends = [];
  
  const expenses = transactions.filter(t => t.type === 'expense');
  const incomes = transactions.filter(t => t.type === 'income');
  const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalIncome = incomes.reduce((sum, t) => sum + Number(t.amount), 0);
  
  // Анализ бюджетов
  budgets.forEach(b => {
    const spent = categoryStats[b.category] || 0;
    const percent = Math.round((spent / b.limit) * 100);
    if (percent >= 100) {
      warnings.push(`⚠️ ПРЕВЫШЕН бюджет в категории "${b.category}" на ${(spent - b.limit).toLocaleString('ru-RU')} ₽ (${percent}%)`);
    } else if (percent >= 80) {
      warnings.push(`📊 Бюджет "${b.category}" израсходован на ${percent}% (${spent.toLocaleString('ru-RU')} из ${b.limit.toLocaleString('ru-RU')} ₽)`);
    }
  });
  
  // Анализ категорий
  let topCategory = { name: '', amount: 0 };
  Object.entries(categoryStats).forEach(([name, amount]) => {
    if (amount > topCategory.amount) topCategory = { name, amount };
  });
  
  if (topCategory.amount > 0 && totalExpense > 0) {
    const percent = Math.round((topCategory.amount / totalExpense) * 100);
    financialTrends.push(`Основная статья расходов — "${topCategory.name}" (${percent}% от трат, ${topCategory.amount.toLocaleString('ru-RU')} ₽)`);
  }
  
  // Рекомендации
  if (totalIncome > totalExpense && totalIncome > 0) {
    const profit = totalIncome - totalExpense;
    const percent = Math.round((profit / totalIncome) * 100);
    recommendations.push(`💰 Прибыль составила ${profit.toLocaleString('ru-RU')} ₽ (${percent}% от доходов). Рекомендуем отложить часть в резерв для финансовой подушки безопасности`);
  } else if (totalExpense > totalIncome && totalIncome > 0) {
    const deficit = totalExpense - totalIncome;
    recommendations.push(`⚠️ Кассовый разрыв: расходы превышают доходы на ${deficit.toLocaleString('ru-RU')} ₽. Необходимо пересмотреть бюджеты или увеличить доходы`);
  }
  
  // Анализ динамики
  const avgTransaction = totalExpense > 0 ? totalExpense / expenses.length : 0;
  if (avgTransaction > 0) {
    recommendations.push(`📈 Средняя сумма расхода: ${Math.round(avgTransaction).toLocaleString('ru-RU')} ₽. Рекомендуем контролировать категории с суммами выше этого значения`);
  }
  
  // Анализ периода
  if (transactions.length > 0) {
    recommendations.push(`✅ Всего операций в отчете: ${transactions.length}. Регулярное отслеживание помогает выявить тренды и оптимизировать расходы`);
  }
  
  return { warnings, recommendations, financialTrends };
};

// ============================================
// ЭТАП 9: ФОРМИРОВАНИЕ СТРУКТУРЫ PDF
// ============================================

// 1. Анализ данных
export const generateReportData = (transactions, budgets, period, reportType, customOptions) => {
  const now = new Date();
  
  // Фильтрация транзакций по периоду (ЭТАП 4)
  const filteredTx = transactions.filter(t => {
    if (period === 'all') return true;
    const tDate = new Date(t.date);
    if (period === 'month') return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    if (period === 'quarter') return Math.floor(now.getMonth() / 3) === Math.floor(tDate.getMonth() / 3) && tDate.getFullYear() === now.getFullYear();
    if (period === 'year') return tDate.getFullYear() === now.getFullYear();
    return true;
  });

  const incomes = filteredTx.filter(t => t.type === 'income');
  const expenses = filteredTx.filter(t => t.type === 'expense');
  const incomeTotal = incomes.reduce((acc, t) => acc + Number(t.amount), 0);
  const expenseTotal = expenses.reduce((acc, t) => acc + Number(t.amount), 0);
  const profit = incomeTotal - expenseTotal;

  // Обработка и агрегация данных (ЭТАП 5)
  const { categoryStats, categoryIncome, categoryExpense, monthlyTrend } = aggregateReportData(filteredTx);

  // Анализ бюджетов
  let budgetAnalysisData = [];
  (budgets || []).forEach(b => {
    const spent = categoryStats[b.category] || 0;
    const percent = Math.round((spent / b.limit) * 100);
    budgetAnalysisData.push({ category: b.category, limit: b.limit, spent, percent });
  });

  // Автоматический анализ (ЭТАП 8)
  const { warnings, recommendations, financialTrends } = generateAnalysis(filteredTx, budgets, categoryStats);

  return {
    period, 
    generatedAt: now.toLocaleString('ru-RU'), 
    transactionsCount: filteredTx.length,
    reportType,
    chartsData: reportType !== 'Настраиваемый аналитический отчет' || customOptions.chartsData,
    ...(reportType !== 'Настраиваемый аналитический отчет' || customOptions.summary ? { summary: { incomeTotal, expenseTotal, profit } } : {}),
    ...(reportType !== 'Настраиваемый аналитический отчет' || customOptions.categoryAnalysis ? { categories: categoryStats, categoryIncome, categoryExpense } : {}),
    ...(reportType !== 'Настраиваемый аналитический отчет' || customOptions.budgetAnalysis ? { budgets: budgetAnalysisData } : {}),
    ...(reportType !== 'Настраиваемый аналитический отчет' || customOptions.recommendations ? { analysis: { warnings, recommendations, financialTrends } } : {}),
    ...(monthlyTrend ? { monthlyTrend } : {})
  };
};

// ============================================
// НОВЫЕ ТИПЫ ДИАГРАММ (ЭТАП 6)
// ============================================

/**
 * Генерирует Line Chart для динамики доходов/расходов по месяцам
 */
const generateLineChart = (monthlyTrend) => {
  if (!monthlyTrend || Object.keys(monthlyTrend).length === 0) return '';
  
  const months = Object.keys(monthlyTrend).sort();
  const incomeData = months.map(m => monthlyTrend[m].income);
  const expenseData = months.map(m => monthlyTrend[m].expense);
  const monthLabels = months.map(m => {
    const [year, month] = m.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('ru-RU', { month: 'short', year: '2-digit' });
  });
  
  // SVG Line Chart
  const maxValue = Math.max(...incomeData, ...expenseData, 1);
  const chartHeight = 180;
  const chartWidth = 500;
  const padding = 40;
  const pointRadius = 3;
  const step = (chartWidth - 2 * padding) / (months.length - 1 || 1);
  
  let pathIncome = `M ${padding} ${chartHeight - (incomeData[0] / maxValue) * (chartHeight - 60)}`;
  let pathExpense = `M ${padding} ${chartHeight - (expenseData[0] / maxValue) * (chartHeight - 60)}`;
  
  for (let i = 1; i < months.length; i++) {
    const x = padding + i * step;
    const yIncome = chartHeight - (incomeData[i] / maxValue) * (chartHeight - 60);
    const yExpense = chartHeight - (expenseData[i] / maxValue) * (chartHeight - 60);
    pathIncome += ` L ${x} ${yIncome}`;
    pathExpense += ` L ${x} ${yExpense}`;
  }
  
  let svg = `<svg viewBox="0 0 ${chartWidth} ${chartHeight}" xmlns="http://www.w3.org/2000/svg" style="margin: 20px 0; width: 100%; height: auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0;">`;
  
  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const y = 20 + (i * (chartHeight - 60)) / 4;
    svg += `<line x1="${padding}" y1="${y}" x2="${chartWidth - padding}" y2="${y}" stroke="#f1f5f9" stroke-width="1"/>`;
  }
  
  // Paths
  svg += `<path d="${pathExpense}" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  svg += `<path d="${pathIncome}" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  
  // Points
  for (let i = 0; i < months.length; i++) {
    const x = padding + i * step;
    const yIncome = chartHeight - (incomeData[i] / maxValue) * (chartHeight - 60);
    const yExpense = chartHeight - (expenseData[i] / maxValue) * (chartHeight - 60);
    svg += `<circle cx="${x}" cy="${yIncome}" r="${pointRadius}" fill="#10b981"/>`;
    svg += `<circle cx="${x}" cy="${yExpense}" r="${pointRadius}" fill="#ef4444"/>`;
  }
  
  // Axis labels
  svg += `<text x="10" y="${chartHeight - 30}" font-size="11" fill="#64748b">${(maxValue).toLocaleString('ru-RU')} ₽</text>`;
  svg += `<text x="10" y="${chartHeight / 2}" font-size="11" fill="#64748b">${(maxValue / 2).toLocaleString('ru-RU')} ₽</text>`;
  svg += `<text x="10" y="30" font-size="11" fill="#64748b">0 ₽</text>`;
  
  // Month labels
  monthLabels.forEach((label, i) => {
    const x = padding + i * step;
    svg += `<text x="${x}" y="${chartHeight - 5}" font-size="10" fill="#64748b" text-anchor="middle">${label}</text>`;
  });
  
  // Legend
  svg += `<g>`;
  svg += `<circle cx="${chartWidth - 120}" cy="15" r="3" fill="#10b981"/>`;
  svg += `<text x="${chartWidth - 110}" y="20" font-size="11" fill="#1e293b">Доходы</text>`;
  svg += `<circle cx="${chartWidth - 120}" cy="35" r="3" fill="#ef4444"/>`;
  svg += `<text x="${chartWidth - 110}" y="40" font-size="11" fill="#1e293b">Расходы</text>`;
  svg += `</g>`;
  
  svg += `</svg>`;
  
  return `<div style="margin: 20px 0; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; page-break-inside: avoid;">
    <h4 style="margin: 0 0 15px 0; color: #475569; font-size: 14px; font-weight: bold;">📈 Динамика по месяцам</h4>
    ${svg}
  </div>`;
};

/**
 * Генерирует Budget Progress диаграмму
 */
const generateBudgetProgress = (budgets, expenses) => {
  if (!budgets || budgets.length === 0) return '';
  
  let html = `<div style="margin: 20px 0; background: #fef3f2; padding: 15px; border-radius: 8px; border: 1px solid #fecaca; page-break-inside: avoid;">
    <h4 style="margin: 0 0 15px 0; color: #7f1d1d; font-size: 14px; font-weight: bold;">📊 Прогресс по бюджетам</h4>
    <div style="display: flex; flex-direction: column; gap: 12px;">`;
  
  budgets.forEach(budget => {
    const spent = expenses[budget.category] || 0;
    const percent = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0;
    const status = spent > budget.limit ? 'warning' : 'normal';
    const statusColor = status === 'warning' ? '#ef4444' : '#3b82f6';
    
    html += `<div style="background: #ffffff; padding: 12px; border-radius: 6px; border-left: 3px solid ${statusColor};">
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span style="font-size: 12px; font-weight: 600; color: #1e293b;">${budget.category}</span>
        <span style="font-size: 12px; color: ${statusColor}; font-weight: bold;">${spent.toLocaleString('ru-RU')} / ${budget.limit.toLocaleString('ru-RU')} ₽</span>
      </div>
      <div style="width: 100%; background: #e2e8f0; border-radius: 4px; height: 10px; overflow: hidden;">
        <div style="width: ${percent}%; background: ${statusColor}; height: 100%; border-radius: 4px;"></div>
      </div>
      <div style="font-size: 10px; color: #64748b; margin-top: 4px;">${Math.round(percent)}% ${status === 'warning' ? '⚠️ Превышено' : ''}</div>
    </div>`;
  });
  
  html += `</div></div>`;
  return html;
};

/**
 * Генерирует Waterfall Chart (водопад расходов)
 */
const generateWaterfallChart = (categories) => {
  if (!categories || Object.keys(categories).length === 0) return '';
  
  const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const total = sorted.reduce((sum, [, val]) => sum + val, 0);
  
  const chartHeight = 250;
  const barHeight = 20;
  const maxWidth = 400;
  
  let svg = `<svg viewBox="0 0 600 ${chartHeight}" xmlns="http://www.w3.org/2000/svg" style="margin: 20px 0; width: 100%; height: auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0;">`;
  
  const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6'];
  
  sorted.forEach(([ name, val ], i) => {
    const barWidth = (val / total) * maxWidth;
    const color = colors[i % colors.length];
    const y = 20 + i * (barHeight + 8);
    
    // Bar
    svg += `<rect x="140" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="3"/>`;
    
    // Value
    svg += `<text x="${150 + barWidth}" y="${y + barHeight / 2 + 4}" font-size="11" fill="#1e293b" font-weight="bold">${val.toLocaleString('ru-RU')} ₽</text>`;
    
    // Label
    svg += `<text x="130" y="${y + barHeight / 2 + 4}" font-size="11" fill="#475569" text-anchor="end">${name.substring(0, 20)}</text>`;
  });
  
  svg += `</svg>`;
  
  return `<div style="margin: 20px 0; background: #f9fafb; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; page-break-inside: avoid;">
    <h4 style="margin: 0 0 15px 0; color: #475569; font-size: 14px; font-weight: bold;">🌊 Водопад расходов (Top 10)</h4>
    ${svg}
  </div>`;
};

/**
 * Генерирует Sankey Diagram для потока денег
 */
const generateSankeyDiagram = (categoryIncome, categoryExpense) => {
  const incomeCategories = Object.entries(categoryIncome).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const expenseCategories = Object.entries(categoryExpense).sort((a, b) => b[1] - a[1]).slice(0, 5);
  
  if (incomeCategories.length === 0 && expenseCategories.length === 0) return '';
  
  const totalIncome = incomeCategories.reduce((sum, [, val]) => sum + val, 0);
  const totalExpense = expenseCategories.reduce((sum, [, val]) => sum + val, 0);
  
  const svgWidth = 600;
  const svgHeight = 300;
  const leftX = 50;
  const rightX = 500;
  const topY = 30;
  const bottomY = svgHeight - 30;
  const centerX = (leftX + rightX) / 2;
  const centerY = svgHeight / 2;
  
  let svg = `<svg viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg" style="margin: 20px 0; width: 100%; height: auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0;">`;
  
  // Draw income flows (left to center)
  const maxTotal = Math.max(totalIncome, totalExpense, 1);
  let incomeY = topY;
  incomeCategories.forEach(([name, value]) => {
    const height = (value / maxTotal) * (bottomY - topY);
    const color = '#10b981';
    const opacity = 0.3 + (value / totalIncome) * 0.5;
    
    // Bezier curve
    svg += `<path d="M ${leftX} ${incomeY} Q ${centerX} ${centerY} ${centerX} ${centerY}" fill="none" stroke="${color}" stroke-width="${Math.max(height / 2, 2)}" opacity="${opacity}" stroke-linecap="round"/>`;
    
    // Label
    svg += `<text x="${leftX - 5}" y="${incomeY + height / 2}" font-size="10" fill="#475569" text-anchor="end">${name.substring(0, 15)}</text>`;
    svg += `<text x="${leftX - 5}" y="${incomeY + height / 2 + 12}" font-size="9" fill="#64748b" text-anchor="end">${value.toLocaleString('ru-RU')} ₽</text>`;
    
    incomeY += height + 2;
  });
  
  // Draw center node
  svg += `<circle cx="${centerX}" cy="${centerY}" r="25" fill="#3b82f6" opacity="0.1" stroke="#3b82f6" stroke-width="2"/>`;
  svg += `<text x="${centerX}" y="${centerY + 4}" font-size="12" fill="#1e40af" text-anchor="middle" font-weight="bold">БАЛАНС</text>`;
  
  // Draw expense flows (center to right)
  let expenseY = topY;
  expenseCategories.forEach(([name, value]) => {
    const height = (value / maxTotal) * (bottomY - topY);
    const color = '#ef4444';
    const opacity = 0.3 + (value / totalExpense) * 0.5;
    
    // Bezier curve
    svg += `<path d="M ${centerX} ${centerY} Q ${(centerX + rightX) / 2} ${expenseY + height / 2} ${rightX} ${expenseY + height / 2}" fill="none" stroke="${color}" stroke-width="${Math.max(height / 2, 2)}" opacity="${opacity}" stroke-linecap="round"/>`;
    
    // Label
    svg += `<text x="${rightX + 5}" y="${expenseY + height / 2}" font-size="10" fill="#475569" text-anchor="start">${name.substring(0, 15)}</text>`;
    svg += `<text x="${rightX + 5}" y="${expenseY + height / 2 + 12}" font-size="9" fill="#64748b" text-anchor="start">${value.toLocaleString('ru-RU')} ₽</text>`;
    
    expenseY += height + 2;
  });
  
  // Legend
  svg += `<text x="15" y="${svgHeight - 10}" font-size="11" fill="#475569">🔵 Доходы → 💰 Баланс → 📉 Расходы</text>`;
  
  svg += `</svg>`;
  
  return `<div style="margin: 20px 0; background: #eff6ff; padding: 15px; border-radius: 8px; border: 1px solid #bfdbfe; page-break-inside: avoid;">
    <h4 style="margin: 0 0 15px 0; color: #1e40af; font-size: 14px; font-weight: bold;">🌊 Поток денег (Sankey)</h4>
    ${svg}
  </div>`;
};

/**
 * Генерирует AI Insights & Forecasting раздел
 */
const generateAIInsights = (monthlyTrend) => {
  const months = Object.keys(monthlyTrend || {}).sort();
  if (months.length === 0) return '';
  
  // Расчет тренда
  const recentMonths = months.slice(-3);
  const recentExpenseValues = recentMonths.map(m => (monthlyTrend[m]?.expense || 0));
  const avgRecentExpense = recentExpenseValues.reduce((a, b) => a + b, 0) / recentExpenseValues.length || 0;
  
  const previousMonths = months.slice(Math.max(0, months.length - 6), months.length - 3);
  const prevExpenses = previousMonths.map(m => (monthlyTrend[m]?.expense || 0));
  const avgPrevExpense = prevExpenses.length > 0 ? prevExpenses.reduce((a, b) => a + b, 0) / prevExpenses.length : 0;
  
  const trendPercent = avgPrevExpense > 0 ? Math.round(((avgRecentExpense - avgPrevExpense) / avgPrevExpense) * 100) : 0;
  const trendDirection = trendPercent > 0 ? '↗️ РАСТУТ' : trendPercent < 0 ? '↘️ ПАДАЮТ' : '→ СТАБИЛЬНЫ';
  
  // Прогноз на следующий месяц
  const avgExpense = Object.values(monthlyTrend).reduce((sum, m) => sum + (m.expense || 0), 0) / Object.keys(monthlyTrend).length || 0;
  const forecasted = avgExpense + (avgRecentExpense - avgPrevExpense);
  
  // Выявление аномалий
  const allExpenses = months.map(m => monthlyTrend[m].expense);
  const avgAll = allExpenses.reduce((a, b) => a + b, 0) / allExpenses.length || 0;
  const stdDev = Math.sqrt(allExpenses.reduce((sum, val) => sum + Math.pow(val - avgAll, 2), 0) / allExpenses.length);
  const anomalyThreshold = avgAll + stdDev * 1.5;
  const anomalies = months.filter(m => monthlyTrend[m].expense > anomalyThreshold);
  
  let html = `<div style="margin: 20px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; color: #ffffff; page-break-inside: avoid;">
    <h4 style="margin: 0 0 15px 0; color: #ffffff; font-size: 14px; font-weight: bold;">🤖 AI Insights & Forecasting</h4>
    
    <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 6px; margin-bottom: 12px; border-left: 3px solid #fbbf24;">
      <div style="font-size: 12px; font-weight: 600; margin-bottom: 4px;">📊 Анализ тренда</div>
      <div style="font-size: 13px;">Ваши расходы ${trendDirection} на <span style="font-weight: bold;">${Math.abs(trendPercent)}%</span> за последние 3 месяца</div>
    </div>
    
    <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 6px; margin-bottom: 12px; border-left: 3px solid #60a5fa;">
      <div style="font-size: 12px; font-weight: 600; margin-bottom: 4px;">🔮 Прогноз на следующий месяц</div>
      <div style="font-size: 13px;">Ожидаемые расходы: <span style="font-weight: bold;">${forecasted.toLocaleString('ru-RU')} ₽</span></div>
    </div>
    
    <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 6px; border-left: 3px solid #34d399;">
      <div style="font-size: 12px; font-weight: 600; margin-bottom: 4px;">⚠️ Обнаруженные аномалии</div>
      <div style="font-size: 13px;">${anomalies.length > 0 ? `Месяцы с необычно высокими расходами: ${anomalies.join(', ')}` : 'Аномалий не обнаружено, расходы в норме'}</div>
    </div>
  </div>`;
  
  return html;
};

// 2. HTML ШАБЛОН - ПОЛНАЯ СТРУКТУРА PDF (ЭТАП 9-10)
export const buildReportHTML = (title, data) => {
  const periodText = data.period === 'month' ? 'Текущий месяц' : data.period === 'quarter' ? 'Квартал' : data.period === 'year' ? 'Год' : 'Все время';
  const pageStyle = 'style="font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; page-break-after: always; padding: 40px; background-color: #ffffff; min-height: 100vh;"';
  
  // СТРАНИЦА 1: ТИТУЛЬНАЯ СТРАНИЦА
  let html = `<div ${pageStyle}>
    <div style="text-align: center; display: flex; flex-direction: column; justify-content: center; height: 80vh; gap: 30px;">
      <div>
        <div style="font-size: 48px; font-weight: 900; color: #0f172a; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px;">CtrlMoney</div>
        <div style="font-size: 14px; color: #64748b; letter-spacing: 1px;">ФИНАНСОВЫЙ ОТЧЕТ</div>
      </div>
      <h1 style="color: #3b82f6; font-size: 36px; margin: 0; font-weight: bold;">${title}</h1>
      <div style="border-top: 2px solid #e2e8f0; border-bottom: 2px solid #e2e8f0; padding: 20px 0;">
        <p style="color: #475569; font-size: 16px; margin: 5px 0; font-weight: 600;">Период: <span style="color: #1e293b;">${periodText}</span></p>
        <p style="color: #475569; font-size: 16px; margin: 5px 0;">Дата: <span style="color: #1e293b;">${data.generatedAt}</span></p>
        <p style="color: #475569; font-size: 16px; margin: 5px 0;">Всего операций: <span style="color: #1e293b; font-weight: bold;">${data.transactionsCount}</span></p>
      </div>
      <div style="color: #94a3b8; font-size: 12px;">Автоматически сгенерировано системой CtrlMoney</div>
    </div>
  </div>`;
  
  // СТРАНИЦА 2: ОБЩАЯ ФИНАНСОВАЯ СВОДКА
  if (data.summary) {
    html += `<div ${pageStyle}>
      <h2 style="color: #0f172a; font-size: 32px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 30px; margin-top: 0;">2. Общая финансовая сводка</h2>
      ${generateSummaryChart(data.summary.incomeTotal, data.summary.expenseTotal)}
      <div style="margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; page-break-inside: avoid;">
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
          <div style="font-size: 13px; color: #047857; font-weight: 600; margin-bottom: 5px;">ДОХОДЫ</div>
          <div style="font-size: 28px; color: #10b981; font-weight: bold;">${data.summary.incomeTotal.toLocaleString('ru-RU')} ₽</div>
        </div>
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;">
          <div style="font-size: 13px; color: #991b1b; font-weight: 600; margin-bottom: 5px;">РАСХОДЫ</div>
          <div style="font-size: 28px; color: #ef4444; font-weight: bold;">${data.summary.expenseTotal.toLocaleString('ru-RU')} ₽</div>
        </div>
      </div>
      <div style="margin-top: 20px; background: ${data.summary.profit >= 0 ? '#ecfdf5' : '#fef2f2'}; padding: 25px; border-radius: 8px; text-align: center; border: 2px solid ${data.summary.profit >= 0 ? '#10b981' : '#ef4444'}; page-break-inside: avoid;">
        <div style="font-size: 14px; color: #475569; margin-bottom: 10px; font-weight: 600;">ИТОГОВАЯ ПРИБЫЛЬ / УБЫТОК</div>
        <div style="font-size: 40px; font-weight: 900; color: ${data.summary.profit >= 0 ? '#059669' : '#dc2626'};">${data.summary.profit.toLocaleString('ru-RU')} ₽</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 10px;">${data.summary.profit >= 0 ? '✅ Положительный результат' : '⚠️ Отрицательный результат'}</div>
      </div>
    </div>`;
  }
  
  // СТРАНИЦА 3: ДОХОДЫ И РАСХОДЫ
  if (data.summary) {
    html += `<div ${pageStyle}>
      <h2 style="color: #0f172a; font-size: 32px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 30px; margin-top: 0;">3. Доходы и расходы</h2>
      <div style="margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
              <th style="padding: 15px; text-align: left; font-weight: 600; color: #475569;">Показатель</th>
              <th style="padding: 15px; text-align: right; font-weight: 600; color: #475569;">Сумма</th>
              <th style="padding: 15px; text-align: right; font-weight: 600; color: #475569;">% от доходов</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background: #ffffff; border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px; font-weight: 600; color: #10b981;">Всего доходов</td>
              <td style="padding: 12px; text-align: right; font-weight: bold; color: #10b981;">${data.summary.incomeTotal.toLocaleString('ru-RU')} ₽</td>
              <td style="padding: 12px; text-align: right;">100%</td>
            </tr>
            <tr style="background: #fef2f2; border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 12px; font-weight: 600; color: #ef4444;">Всего расходов</td>
              <td style="padding: 12px; text-align: right; font-weight: bold; color: #ef4444;">-${data.summary.expenseTotal.toLocaleString('ru-RU')} ₽</td>
              <td style="padding: 12px; text-align: right;">${data.summary.incomeTotal > 0 ? Math.round((data.summary.expenseTotal / data.summary.incomeTotal) * 100) : 0}%</td>
            </tr>
            <tr style="background: ${data.summary.profit >= 0 ? '#ecfdf5' : '#fef2f2'}; border-top: 2px solid #cbd5e1; border-bottom: 2px solid #cbd5e1;">
              <td style="padding: 15px; font-weight: 700; color: #1e293b;">ПРИБЫЛЬ/УБЫТОК</td>
              <td style="padding: 15px; text-align: right; font-weight: 900; font-size: 16px; color: ${data.summary.profit >= 0 ? '#059669' : '#dc2626'};">${data.summary.profit.toLocaleString('ru-RU')} ₽</td>
              <td style="padding: 15px; text-align: right; font-weight: 700;">${Math.round((Math.abs(data.summary.profit) / data.summary.incomeTotal) * 100) || 0}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`;
  }
  
  // СТРАНИЦА 4: ГРАФИКИ И ДИАГРАММЫ
  if (data.categories && Object.keys(data.categories).length > 0) {
    html += `<div ${pageStyle}>
      <h2 style="color: #0f172a; font-size: 32px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 30px; margin-top: 0;">4. Графики и диаграммы</h2>
      ${data.chartsData ? generateCategoryChart(data.categories) : ''}
      ${data.categoryIncome && Object.keys(data.categoryIncome).length > 0 && data.categoryExpense ? generateComparativeChart(data.categoryIncome, data.categoryExpense) : ''}
    </div>`;
  }
  
  // СТРАНИЦА 4: АНАЛИЗ КАТЕГОРИЙ
  if (data.categories && Object.keys(data.categories).length > 0) {
    html += `<div ${pageStyle}>
      <h2 style="color: #0f172a; font-size: 32px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 30px; margin-top: 0;">4. Анализ по категориям</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <thead>
          <tr style="background: #475569; color: white;">
            <th style="padding: 12px; border: 1px solid #cbd5e1; text-align: left; font-weight: 600;">Категория</th>
            <th style="padding: 12px; border: 1px solid #cbd5e1; text-align: right; font-weight: 600;">Сумма</th>
            <th style="padding: 12px; border: 1px solid #cbd5e1; text-align: right; font-weight: 600;">% от расходов</th>
          </tr>
        </thead>
        <tbody>`;
    
    const totalExpense = Object.values(data.categories).reduce((a, b) => a + b, 0);
    Object.entries(data.categories).sort((a, b) => b[1] - a[1]).forEach(([cat, amount], idx) => {
      const percent = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
      html += `<tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: 500;">${cat}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold;">${amount.toLocaleString('ru-RU')} ₽</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: right; font-weight: 600;">${percent}%</td>
      </tr>`;
    });
    
    html += `</tbody></table>
    </div>`;
  }
  
  // СТРАНИЦА 5: АНАЛИЗ БЮДЖЕТОВ (ЕСЛИ ЕСТЬ БЕЗ БЮДЖЕТОВ - ПРОПУСКАЕМ)
  if (data.budgets && data.budgets.length > 0) {
    html += `<div ${pageStyle}>
      <h2 style="color: #0f172a; font-size: 32px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 30px; margin-top: 0;">5. Анализ бюджетов</h2>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
        <thead>
          <tr style="background: #475569; color: white;">
            <th style="padding: 12px; border: 1px solid #cbd5e1; text-align: left; font-weight: 600;">Категория</th>
            <th style="padding: 12px; border: 1px solid #cbd5e1; text-align: right; font-weight: 600;">Потрачено</th>
            <th style="padding: 12px; border: 1px solid #cbd5e1; text-align: right; font-weight: 600;">Лимит</th>
            <th style="padding: 12px; border: 1px solid #cbd5e1; text-align: right; font-weight: 600;">Освоение</th>
          </tr>
        </thead>
        <tbody>`;
    
    data.budgets.forEach((b, idx) => {
      const isOver = b.percent >= 100;
      const isWarning = b.percent >= 80 && b.percent < 100;
      const bgColor = isOver ? '#fef2f2' : isWarning ? '#fffbeb' : idx % 2 === 0 ? '#ffffff' : '#f8fafc';
      const textColor = isOver ? '#dc2626' : isWarning ? '#d97706' : '#059669';
      
      html += `<tr style="background: ${bgColor}; border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: 500;">${b.category}</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold;">${b.spent.toLocaleString('ru-RU')} ₽</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold;">${b.limit.toLocaleString('ru-RU')} ₽</td>
        <td style="padding: 12px; border: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: ${textColor};">${b.percent}%</td>
      </tr>`;
    });
    
    html += `</tbody></table>
    </div>`;
  }
  
  // СТРАНИЦА 7: АВТОМАТИЧЕСКИЕ ВЫВОДЫ
  if (data.analysis && data.analysis.financialTrends && data.analysis.financialTrends.length > 0) {
    html += `<div ${pageStyle}>
      <h2 style="color: #0f172a; font-size: 32px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 30px; margin-top: 0;">7. Автоматические выводы системы</h2>
      <div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">📊 Анализ финансовой динамики</h3>
        <ul style="color: #1e40af; margin: 0; padding-left: 20px; line-height: 1.8;">`;
    
    data.analysis.financialTrends.forEach(trend => {
      html += `<li style="margin-bottom: 8px;">${trend}</li>`;
    });
    
    html += `</ul></div>`;
    
    if (data.analysis.warnings && data.analysis.warnings.length > 0) {
      html += `<div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #b91c1c; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">⚠️ Внимание</h3>
        <ul style="color: #991b1b; margin: 0; padding-left: 20px; line-height: 1.8;">`;
      
      data.analysis.warnings.forEach(warning => {
        html += `<li style="margin-bottom: 8px;">${warning}</li>`;
      });
      
      html += `</ul></div>`;
    }
    
    html += `</div>`;
  }
  
  // СТРАНИЦА 8: РЕКОМЕНДАЦИИ
  if (data.analysis && data.analysis.recommendations && data.analysis.recommendations.length > 0) {
    html += `<div ${pageStyle}>
      <h2 style="color: #0f172a; font-size: 32px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 30px; margin-top: 0;">8. Рекомендации</h2>
      <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 20px; border-radius: 8px;">
        <h3 style="color: #15803d; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">✅ Советы по улучшению финансов</h3>
        <ul style="color: #166534; margin: 0; padding-left: 20px; line-height: 2;">`;
    
    data.analysis.recommendations.forEach(rec => {
      html += `<li style="margin-bottom: 12px; font-size: 14px;">${rec}</li>`;
    });
    
    html += `</ul></div>
    </div>`;
  }
  
  // СТРАНИЦА 5: ДИНАМИКА ПО МЕСЯЦАМ (LINE CHART)
  if (data.monthlyTrend && Object.keys(data.monthlyTrend).length > 1) {
    html += `<div ${pageStyle}>
      <h2 style="color: #0f172a; font-size: 32px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 30px; margin-top: 0;">5. Динамика доходов и расходов</h2>
      ${generateLineChart(data.monthlyTrend)}
    </div>`;
  }
  
  // СТРАНИЦА 6: BUDGET PROGRESS
  if (data.budgets && data.budgets.length > 0) {
    const expensesByCategory = {};
    // Реконструируем расходы по категориям для бюджета
    Object.keys(data.categories || {}).forEach(cat => {
      expensesByCategory[cat] = data.categories[cat];
    });
    html += `<div ${pageStyle}>
      <h2 style="color: #0f172a; font-size: 32px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 30px; margin-top: 0;">6. Статус бюджетов</h2>
      ${generateBudgetProgress(data.budgets, expensesByCategory)}
    </div>`;
  }
  
  // СТРАНИЦА 7: WATERFALL CHART
  if (data.categories && Object.keys(data.categories).length > 0) {
    html += `<div ${pageStyle}>
      <h2 style="color: #0f172a; font-size: 32px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 30px; margin-top: 0;">7. Анализ расходов (Водопад)</h2>
      ${generateWaterfallChart(data.categories)}
    </div>`;
  }
  
  // СТРАНИЦА 8: SANKEY DIAGRAM
  if ((data.categoryIncome && Object.keys(data.categoryIncome).length > 0) || (data.categoryExpense && Object.keys(data.categoryExpense).length > 0)) {
    html += `<div ${pageStyle}>
      <h2 style="color: #0f172a; font-size: 32px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 30px; margin-top: 0;">8. Поток денег</h2>
      ${generateSankeyDiagram(data.categoryIncome || {}, data.categoryExpense || {})}
    </div>`;
  }
  
  // СТРАНИЦА 9: AI INSIGHTS & FORECASTING
  if (data.monthlyTrend && Object.keys(data.monthlyTrend).length > 0) {
    html += `<div ${pageStyle}>
      <h2 style="color: #0f172a; font-size: 32px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 30px; margin-top: 0;">9. AI Insights & Прогнозирование</h2>
      ${generateAIInsights(data.monthlyTrend, data.categories || {}, data.categoryIncome || {})}
      
      <div style="margin-top: 20px; background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; page-break-inside: avoid;">
        <h4 style="margin: 0 0 15px 0; color: #475569; font-size: 14px; font-weight: bold;">💡 Рекомендации для оптимизации</h4>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="padding: 10px; background: #ecfdf5; border-left: 3px solid #10b981; border-radius: 4px; font-size: 12px; color: #065f46;">
            <span style="font-weight: 600;">✅ Позитивный тренд:</span> Если расходы падают, рекомендуем увеличить сумму сбережений
          </div>
          <div style="padding: 10px; background: #fef3c7; border-left: 3px solid #f59e0b; border-radius: 4px; font-size: 12px; color: #78350f;">
            <span style="font-weight: 600;">⚠️ Растущие расходы:</span> Пересмотрите наиболее затратные категории и найдите возможности для экономии
          </div>
          <div style="padding: 10px; background: #dbeafe; border-left: 3px solid #3b82f6; border-radius: 4px; font-size: 12px; color: #1e40af;">
            <span style="font-weight: 600;">📊 Анализ категорий:</span> Сосредоточьтесь на категориях, которые превышают плановый бюджет
          </div>
        </div>
      </div>
    </div>`;
  }
  
  // СТРАНИЦА 10: ИТОГОВАЯ СТАТИСТИКА
  html += `<div ${pageStyle}>
    <h2 style="color: #0f172a; font-size: 32px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; margin-bottom: 30px; margin-top: 0;">10. Итоговая статистика</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div style="font-size: 12px; color: #64748b; font-weight: 600; margin-bottom: 8px;">ВСЕГО ОПЕРАЦИЙ</div>
        <div style="font-size: 36px; font-weight: 900; color: #3b82f6;">${data.transactionsCount}</div>
      </div>
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div style="font-size: 12px; color: #64748b; font-weight: 600; margin-bottom: 8px;">ПЕРИОД ОТЧЕТА</div>
        <div style="font-size: 18px; font-weight: bold; color: #1e293b;">${periodText}</div>
      </div>
    </div>
    <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 30px;">
      <div style="font-size: 12px; color: #64748b; font-weight: 600; margin-bottom: 10px;">ДАТА СОЗДАНИЯ ОТЧЕТА</div>
      <div style="font-size: 16px; color: #1e293b;">${data.generatedAt}</div>
    </div>
    <div style="margin-top: 40px; text-align: center; color: #94a3b8; font-size: 11px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
      <p style="margin: 0 0 5px 0;">Документ сгенерирован автоматически в системе CtrlMoney</p>
      <p style="margin: 0;">© 2026 CtrlMoney. Все права защищены.</p>
    </div>
  </div>`;
  
  return html;
};

// ============================================
// ЭТАП 10-11: ГЕНЕРАЦИЯ И ЗАГРУЗКА PDF
// ============================================

// 3. ФУНКЦИЯ СОЗДАНИЯ PDF
export const createPdfBase64 = async (title, data) => {
  const htmlContent = buildReportHTML(title, data);
  const opt = {
    margin: [10, 10, 10, 10], 
    filename: `Report_${Date.now()}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  return await html2pdf().set(opt).from(htmlContent).output('datauristring');
};

/**
 * Функция для загрузки файла (позволяет скачать файл на компьютер)
 * ЭТАП 11: Сохранение и выдача готового отчета пользователю
 */
export const downloadFile = (fileUrl, fileName) => {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName || `Report_${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Функция для загрузки файла с компьютера пользователя
 */
export const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({
        name: file.name,
        size: file.size,
        type: file.type,
        data: e.target.result
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Функция для сохранения загруженного файла в localStorage
 */
export const saveUploadedFile = (fileData, title, category) => {
  const fileRecord = {
    id: `file-${Date.now()}`,
    title: title || fileData.name,
    category: category,
    date: new Date().toLocaleDateString('ru-RU'),
    fileName: fileData.name,
    fileSize: fileData.size,
    fileType: fileData.type,
    fileData: fileData.data
  };
  
  try {
    // Проверка размера localStorage
    const existingFiles = JSON.parse(localStorage.getItem('ctrlmoney_uploaded_files') || '[]');
    existingFiles.push(fileRecord);
    localStorage.setItem('ctrlmoney_uploaded_files', JSON.stringify(existingFiles));
    return fileRecord;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      throw new Error('Память браузера переполнена. Удалите старые файлы.');
    }
    throw error;
  }
};