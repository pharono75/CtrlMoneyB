import React, { createContext, useState, useEffect, useContext } from 'react';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('app_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  // НОВОЕ СОСТОЯНИЕ: Выбранный период (по умолчанию 'month')
  const [period, setPeriod] = useState('month'); 

  useEffect(() => {
    localStorage.setItem('app_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (newTransaction) => {
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter(t => t.id !== id))
  }

  const updateTransaction = (id, updatedData) => {
    setTransactions((prev) => prev.map(t => (t.id === id ? { ...t, ...updatedData } : t)))
  }

  // 1. ГЛАВНЫЙ БАЛАНС (За всё время)
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);
    
  const balance = totalIncome - totalExpense;

  // 2. ФИЛЬТРАЦИЯ ПО ПЕРИОДУ
  const filteredTransactions = transactions.filter(t => {
    if (period === 'all') return true; // Если "Все", берем все транзакции
    
    const tDate = new Date(t.date);
    const now = new Date();
    
    if (period === 'month') {
      return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
    }
    if (period === 'quarter') {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const tQuarter = Math.floor(tDate.getMonth() / 3);
      return currentQuarter === tQuarter && tDate.getFullYear() === now.getFullYear();
    }
    if (period === 'year') {
      return tDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // 3. ДОХОД И РАСХОД ЗА ПЕРИОД
  const periodIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const periodExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    // Раздаем period и setPeriod, чтобы другие компоненты могли переключать вкладки
    <FinanceContext.Provider value={{ 
      transactions, 
      addTransaction,
      deleteTransaction,
      updateTransaction,
      balance, 
      periodIncome, 
      periodExpense,
      period,
      setPeriod
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);