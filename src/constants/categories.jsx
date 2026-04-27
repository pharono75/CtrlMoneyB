import React from 'react';

// 1. Сюда импортируешь все свои SVG
import Salary from '../assets/salary.svg?react';
import Marketing from '../assets/marketing.svg?react';
import Admin from '../assets/admin.svg?react';
import Rent from '../assets/rent.svg?react';
import Taxes from '../assets/tax.svg?react';
import Purchases from '../assets/purchases.svg?react';
import IT from '../assets/it.svg?react';
import Logistics from '../assets/delivery.svg?react';
import Trip from '../assets/trip.svg?react';
import Equipment from '../assets/equipment.svg?react';
import Bank from '../assets/bank.svg?react';
import Sales from '../assets/sale.svg?react';
import Services from '../assets/services.svg?react';
import Online from '../assets/online-sale.svg?react';
import Retail from '../assets/retail.svg?react';
import Wholesale from '../assets/wholesale.svg?react';
import Advance from '../assets/advance.svg?react';
import Refund from '../assets/refund.svg?react';
import RentIncome from '../assets/sale.svg?react';
import Investment from '../assets/invest.svg?react';
import Percent from '../assets/percent.svg?react'

// 2. Списки для модального окна
export const EXPENSE_CATEGORIES = [
  'Зарплата', 'Маркетинг', 'Административные расходы', 'Аренда офиса',
  'Налоги и сборы', 'Закупки и сырье', 'IT и ПО', 'Логистика и доставка',
  'Командировки', 'Оборудование', 'Банковские комиссии', 'Прочее'
];

export const INCOME_CATEGORIES = [
  'Продажа', 'Услуги', 'Онлайн-продажи', 'Розничная торговля',
  'Оптовая торговля', 'Авансовые платежи', 'Возвраты', 'Аренда (доход)',
  'Инвестиции', 'Проценты на остаток', 'Прочее'
];

// 3. Единый словарь иконок
export const getCategoryIcon = (category, counterparty, className) => {
  const icons = {
    'Зарплата': <Salary className={className} />,
    'Маркетинг': <Marketing className={className} />,
    'Административные расходы': <Admin className={className} />,
    'Аренда офиса': <Rent className={className} />,
    'Налоги и сборы': <Taxes className={className} />,
    'Закупки и сырье': <Purchases className={className} />,
    'IT и ПО': <IT className={className} />,
    'Логистика и доставка': <Logistics className={className} />,
    'Командировки': <Trip className={className} />,
    'Оборудование': <Equipment className={className} />,
    'Банковские комиссии': <Bank className={className} />,
    'Продажа': <Sales className={className} />,
    'Услуги': <Services className={className} />,
    'Онлайн-продажи': <Online className={className} />,
    'Розничная торговля': <Retail className={className} />,
    'Оптовая торговля': <Wholesale className={className} />,
    'Авансовые платежи': <Advance className={className} />,
    'Возвраты': <Refund className={className} />,
    'Аренда (доход)': <RentIncome className={className} />,
    'Инвестиции': <Investment className={className} />,
    'Проценты на остаток': <Percent className={className} />
  };

  const IconComponent = icons[category];

  // Если иконка найдена — отдаем её
  if (IconComponent) {
    return IconComponent;
  }

  // Если нет (или это "Прочее") — отдаем дефолтную первую букву
const fallbackLetter = counterparty ? counterparty.charAt(0) : '?';

return (
    <span className="text-[calc(var(--index)*0.7)] font-bold text-slate-500 uppercase leading-none">
      {fallbackLetter}
    </span>
  );
};