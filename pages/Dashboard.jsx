import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import BalanceCard from '../components/BalanceCard/BalanceCard';
import RecentTransactions from '../components/RecentTransactions';
import FinanceChart from '../components/FinanceChart';
import FinanceAnalysis from '../components/FinanceAnalysis';
import AddTransactionBtn from '../components/BalanceCard/AddTransactionBtn';
import TransactionModal from '../components/BalanceCard/TransactionModal';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

useEffect(() => {
  const token = localStorage.getItem('token')

  if (!token) {
    navigate('/login')
    return
  }

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (!res.ok) {
        localStorage.removeItem('token')
        navigate('/login')
        return
      }

      setUser(data)
    } catch (err) {
      console.error(err)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  fetchUser()
}, [])

if (loading) {
  return (
    <AppLayout>
      <div className="flex items-center justify-center h-full text-[#4C5A7A] dark:text-white/60 font-medium">
        Загрузка...
      </div>
    </AppLayout>
  )
}

  return (
    <AppLayout>
      {/* === ДЕСКТОП / ГОРИЗОНТАЛЬНЫЙ ПЛАНШЕТ === */}
      <div className="mobile:hidden grid grid-cols-12 gap-6 h-full pr-2">
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
          <BalanceCard />
          <RecentTransactions />
        </div>

        <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
          <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/50 dark:border-white/10 p-[calc(var(--index)*1)] shadow-sm w-full h-[calc(var(--index)*18)] lg:h-[calc(var(--index)*15)] transition-colors duration-500 shrink-0">
            <FinanceChart />
          </div>
          <div className="flex-1 w-full flex flex-col">
            <FinanceAnalysis />
          </div>
        </div>
      </div>

      {/* === МОБИЛЬНЫЙ / ВЕРТИКАЛЬНЫЙ ПЛАНШЕТ === */}
      <div className="hidden mobile:flex flex-col gap-4 pb-2">
        <BalanceCard hideAddButton />

        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-white/10 p-4 shadow-sm w-full">
          <div className="h-[200px] w-full">
            <FinanceChart compact />
          </div>
          <div className="flex justify-end mt-2">
            <button
              onClick={() => navigate('/finance')}
              className="text-xs font-medium text-[#64748b] dark:text-white/50 hover:text-[#4C5A7A] dark:hover:text-white transition-colors"
            >
              Подробнее...
            </button>
          </div>
        </div>

        <RecentTransactions compact />

        <AddTransactionBtn onClick={() => setIsModalOpen(true)} />

        <TransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </AppLayout>
  );
};

export default Dashboard;