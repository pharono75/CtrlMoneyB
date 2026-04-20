import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#dcdde1] flex p-6 gap-6 font-sans text-slate-800">
        {/*<Sidebar />*/}
      <main className="flex-1 grid grid-cols-12 gap-6">
        
        {/* Здесь будут располагаться карточки: баланс, график, транзакции */}

      </main>
    </div>
  );
};

export default Dashboard;