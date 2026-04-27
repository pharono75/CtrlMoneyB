import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import BalanceCard from '../components/BalanceCard';
import RecentTransactions from '../components/RecentTransactions';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#dcdde1] flex p-6 gap-6 font-sans text-slate-800">
        <Sidebar />
      <main className="flex-1 grid grid-cols-12 gap-6">
        
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6 h-full">
          <BalanceCard />
          <RecentTransactions />
        </div>

      </main>
    </div>
  );
};

export default Dashboard;