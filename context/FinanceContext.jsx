import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchTransactions,
  createTransaction,
  deleteTransaction as apiDeleteTransaction, 
  updateTransaction as apiUpdateTransaction
} from '../api/transactionsApi';

const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  const [exchangeRates, setExchangeRates] = useState(null);

  // =========================
  // LOAD INITIAL DATA
  // =========================
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setTransactions([]);
          return;
        }

        const data = await fetchTransactions();
        
        if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          setTransactions([]);
        }

      } catch (err) {
        console.error('Ошибка загрузки транзакций:', err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // =========================
  // EXCHANGE RATES
  // =========================
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/RUB');
        const data = await res.json();

        if (data?.rates) {
          setExchangeRates(data.rates);
        }
      } catch (e) {
        console.error('Ошибка курсов валют:', e);
      }
    };

    fetchRates();
  }, []);

  // =========================
  // CRUD OPERATIONS 
  // =========================

  const addTransaction = async (newTransaction) => {
    const created = await createTransaction(newTransaction);
    if (created?.id) {
      setTransactions((prev) => [created, ...prev]);
    }
  };

  // ПЕРЕИМЕНОВАНО: теперь компоненты найдут функцию удаления
  const deleteTransaction = async (id) => {
    await apiDeleteTransaction(id);
    setTransactions((prev) => prev.filter(t => t.id !== id));
  };

  // ПЕРЕИМЕНОВАНО: теперь компоненты найдут функцию обновления
  const updateTransaction = async (id, updatedData) => {
    await apiUpdateTransaction(id, updatedData);
    setTransactions((prev) =>
      prev.map(t =>
        t.id === id ? { ...t, ...updatedData } : t
      )
    );
  };

  // =========================
  // DERIVED STATE 
  // =========================

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpense;

  // =========================
  // PERIOD FILTERING
  // =========================

  const filteredTransactions = transactions.filter(t => {
    if (period === 'all') return true;

    const tDate = new Date(t.date);
    const now = new Date();

    if (period === 'month') {
      return (
        tDate.getMonth() === now.getMonth() &&
        tDate.getFullYear() === now.getFullYear()
      );
    }

    if (period === 'quarter') {
      const currentQ = Math.floor(now.getMonth() / 3);
      const tQ = Math.floor(tDate.getMonth() / 3);
      return currentQ === tQ && tDate.getFullYear() === now.getFullYear();
    }

    if (period === 'year') {
      return tDate.getFullYear() === now.getFullYear();
    }

    return true;
  });

  const periodIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const periodExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        loading,
        addTransaction,
        deleteTransaction, // Передаем под нужным именем
        updateTransaction, // Передаем под нужным именем
        period,
        setPeriod,
        balance,
        periodIncome,
        periodExpense,
        exchangeRates
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);