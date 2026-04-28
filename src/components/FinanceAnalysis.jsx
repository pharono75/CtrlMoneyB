import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';

const FinanceAnalysis = () => {
  const { transactions } = useFinance();

  // Продвинутый алгоритм анализа данных
  const insights = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let currentIncome = 0;
    let currentExpense = 0;
    let pastIncome = 0;
    let pastExpense = 0;
    const catStats = {};

    // 1. Сбор и распределение данных через FinanceContext
    transactions.forEach(t => {
      const d = new Date(t.date);
      const amount = Number(t.amount);
      
      const isCurrentMonth = d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      // Проверка прошлого месяца (с учетом перехода года с января на декабрь)
      const isPastMonth = d.getMonth() === (currentMonth === 0 ? 11 : currentMonth - 1) &&
                          d.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear);

      if (isCurrentMonth) {
        if (t.type === 'income') currentIncome += amount;
        if (t.type === 'expense') {
          currentExpense += amount;
          // Так как t.category у тебя уже строка ('Маркетинг', 'Аренда'), просто суммируем
          const catName = t.category || 'Прочее';
          catStats[catName] = (catStats[catName] || 0) + amount;
        }
      } else if (isPastMonth) {
        if (t.type === 'income') pastIncome += amount;
        if (t.type === 'expense') pastExpense += amount;
      }
    });

    // 2. Ищем самую крупную статью расходов текущего месяца
    let topCatName = "Траты";
    let topAmt = 0;
    Object.entries(catStats).forEach(([name, amt]) => {
      if (amt > topAmt) {
        topAmt = amt;
        topCatName = name;
      }
    });

    // 3. Математика для советов
    const incomeDiff = pastIncome > 0 ? Math.round(((currentIncome - pastIncome) / pastIncome) * 100) : 0;
    const expenseDiff = pastExpense > 0 ? Math.round(((currentExpense - pastExpense) / pastExpense) * 100) : 0;
    const savingsRate = currentIncome > 0 ? Math.round(((currentIncome - currentExpense) / currentIncome) * 100) : 0;
    
    // Предлагаем срезать 20% с самой большой категории
    const potentialSaving = Math.round(topAmt * 0.2); 
    const topCatPercentage = currentExpense > 0 ? Math.round((topAmt / currentExpense) * 100) : 0;

    // 4. Формирование текстов
    return {
      growth: {
        title: "Рост доходов",
        text: pastIncome > 0 
          ? `Ваш доход ${incomeDiff >= 0 ? 'вырос' : 'снизился'} на <span class='text-[#60a5fa] font-medium'>${Math.abs(incomeDiff)}%</span> по сравнению с прошлым месяцем`
          : `Ваш доход в этом месяце составил <span class='text-[#60a5fa] font-medium'>${currentIncome.toLocaleString('ru-RU')}₽</span>`,
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
        color: "text-[#60a5fa]"
      },
      activity: {
        title: "Анализ активности",
        text: topAmt > 0 
          ? `Расходы на категорию «${topCatName.toLowerCase()}» составили <span class='text-[#fb923c] font-medium'>${topCatPercentage}%</span> от всех трат за месяц`
          : "Ваши расходы в норме, необычной активности не замечено",
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
        color: topCatPercentage > 30 ? "text-[#fb923c]" : "text-[#4ade80]" // Оранжевый, если категория жрет больше 30% бюджета
      },
      tip: {
        title: "Совет по оптимизации",
        text: topAmt > 0 
          ? `Снизив траты на «${topCatName.toLowerCase()}» на 20%, можно сэкономить примерно <span class='text-[#60a5fa] font-medium'>${potentialSaving.toLocaleString('ru-RU')}₽</span> / месяц`
          : "У вас пока нет расходов для оптимизации",
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
        color: "text-[#60a5fa]"
      },
      stability: {
        title: "Финансовая стабильность",
        text: currentIncome > 0
          ? `В этом месяце вы сохраняете <span class='${savingsRate >= 15 ? 'text-[#4ade80]' : 'text-[#fb923c]'} font-medium'>${savingsRate}%</span> от общего дохода`
          : "Добавьте доходы для расчета финансовой стабильности",
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
        color: "text-[#4ade80]"
      },
      recommendation: {
        title: "Рекомендация",
        text: topAmt > 0 
          ? `Самая ресурсоемкая статья бюджета сейчас — это «${topCatName}».<br/><br/>Оптимизация в этой категории может сократить затраты примерно на <span class='text-[#c084fc] font-medium'>${potentialSaving.toLocaleString('ru-RU')}₽</span>. Отложите эти деньги в резервный фонд.`
          : "Ваш бюджет отлично сбалансирован.<br/><br/>Сохраняйте этот темп, чтобы быстрее достичь поставленных финансовых целей.",
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
        color: "text-[#c084fc]"
      }
    };
  }, [transactions]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white/40 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/50 p-[calc(var(--index)*1.2)] shadow-sm w-full overflow-hidden">
      
      <h2 className="text-[#334155] text-[calc(var(--index)*0.95)] font-medium mb-[calc(var(--index)*1)] shrink-0">
        Автоматический анализ ваших финансов
      </h2>

      <div className="flex-1 min-h-0 grid grid-cols-1 gap-[calc(var(--index)*1)] lg:grid-cols-[1.4fr_0.6fr]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[calc(var(--index)*0.8)] min-h-0">
          {[insights.growth, insights.activity, insights.tip, insights.stability].map((item, i) => (
            <div key={i} className="bg-white/60 border border-white/60 rounded-[calc(var(--index)*0.6)] p-[calc(var(--index)*0.8)] shadow-sm flex flex-col gap-[calc(var(--index)*0.4)] min-h-[10rem]">
              <div className="flex items-center gap-[calc(var(--index)*0.3)] shrink-0">
                <svg className={`w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)] ${item.color}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {item.icon}
                </svg>
                <h3 className="text-[#1e293b] font-medium text-[calc(var(--index)*0.65)]">{item.title}</h3>
              </div>
              <p className="text-slate-500 text-[calc(var(--index)*0.48)] leading-relaxed" dangerouslySetInnerHTML={{ __html: item.text }} />
            </div>
          ))}
        </div>

        <div className="bg-white/60 border border-white/60 rounded-[calc(var(--index)*0.6)] p-[calc(var(--index)*0.8)] shadow-sm flex flex-col gap-[calc(var(--index)*0.6)] h-full min-h-[18rem]">
          <div className="flex items-center gap-[calc(var(--index)*0.3)] shrink-0">
            <svg className={`w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)] ${insights.recommendation.color}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {insights.recommendation.icon}
            </svg>
            <h3 className="text-[#1e293b] font-medium text-[calc(var(--index)*0.65)]">{insights.recommendation.title}</h3>
          </div>
          <p className="text-slate-500 text-[calc(var(--index)*0.48)] leading-relaxed h-full" dangerouslySetInnerHTML={{ __html: insights.recommendation.text }} />
        </div>
      </div>
    </div>
  );
};

export default FinanceAnalysis;