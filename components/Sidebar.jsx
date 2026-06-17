import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Main from '../assets/main.svg?react'
import Fin from '../assets/fin.svg?react'
import Doc from '../assets/doc.svg?react'
import Employee from '../assets/empl.svg?react'
import Profile from '../assets/profile.svg?react'
import Settings from '../assets/settings.svg?react'
import Logout from '../assets/logout.svg?react'
import { useModal } from '../context/ModalContext';
import { useInactivity } from '../hooks/useInactivity';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { openProfile, openSettings } = useModal();
    useInactivity();
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            const profile = JSON.parse(savedProfile);
            if (profile.avatar) {
                setAvatar(profile.avatar);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/');
    }

    const MENU_ITEMS = [
        { path: '/dashboard', label: 'Главная', Icon: Main },
        { path: '/finance', label: 'Финансы', Icon: Fin },
        { path: '/documents', label: 'Документы', Icon: Doc },
        { path: '/team', label: 'Команда', Icon: Employee }, 
    ];

    return (
    <aside className="mobile:hidden shrink-0 w-[calc(var(--index)*3.7)] h-fit bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-[calc(var(--index)*1.1)] border border-white/40 dark:border-white/10 flex flex-col items-center py-[calc(var(--index)*1)] shadow-xl transition-colors duration-500">
            
            <nav className="flex flex-col gap-[calc(var(--index)*0.8)] w-full px-[calc(var(--index)*0.3)]">
                {MENU_ITEMS.map(({ path, label, Icon }) => {
                    const isActive = location.pathname === path;
                    return (
                        <button 
                            key={path}
                            onClick={() => navigate(path)}
                            className="flex flex-col items-center gap-[calc(var(--index)*0.15)] group w-full"
                        >
                            <div className={`p-[calc(var(--index)*0.25)] rounded-[calc(var(--index)*0.4)] transition-all duration-300 w-full flex justify-center ${
                                isActive 
                                    ? 'bg-white dark:bg-white/20 shadow-sm' 
                                    : 'hover:bg-white/30 dark:hover:bg-white/10'
                            }`}>
                                <Icon className={`w-[calc(var(--index)*0.9)] h-[calc(var(--index)*0.9)] transition-colors ${
                                    isActive ? 'text-[#1e293b] dark:text-white' : 'text-slate-500 dark:text-white/60 group-hover:text-[#1e293b] dark:group-hover:text-white'
                                }`} />
                            </div>
                            <span className={`text-[calc(var(--index)*0.45)] font-medium transition-colors ${
                                isActive ? 'text-[#1e293b] dark:text-white' : 'text-slate-500 dark:text-white/60 group-hover:text-[#1e293b] dark:group-hover:text-white'
                            }`}>
                                {label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            {/* Разделитель */}
            <div className="w-[calc(var(--index)*1.1)] h-[calc(var(--index)*0.1)] bg-slate-300 dark:bg-white/20 my-[calc(var(--index)*0.5)] rounded-full transition-colors duration-500" />

            {/* Нижний блок */}
            <div className="flex flex-col items-center gap-[calc(var(--index)*0.8)] w-full px-[calc(var(--index)*0.3)]">
                
                {/* Профиль */}
                <button 
                    onClick={openProfile}
                    className="flex flex-col items-center gap-[calc(var(--index)*0.15)] group w-full"
                >
                    <div className="p-[calc(var(--index)*0.25)] rounded-[calc(var(--index)*0.4)] hover:bg-white/30 dark:hover:bg-[#2a2a2a]/80 transition-all duration-300 w-full flex justify-center">
                        {avatar ? (
                            <img src={avatar} alt="profile" className="w-[calc(var(--index)*0.9)] h-[calc(var(--index)*0.9)] rounded-full object-cover" />
                        ) : (
                            <Profile className="w-[calc(var(--index)*0.9)] h-[calc(var(--index)*0.9)] text-slate-500 dark:text-gray-300 group-hover:text-[#1e293b] dark:group-hover:text-white transition-colors" />
                        )}
                    </div>
                    {/* ВОТ ЭТА ПОДПИСЬ ВЕРНУЛАСЬ */}
                    <span className="text-[calc(var(--index)*0.45)] font-medium text-slate-500 dark:text-gray-400 group-hover:text-[#1e293b] dark:group-hover:text-white transition-colors">
                        Профиль
                    </span>
                </button>

                {/* Настройки */}
                <button 
                    onClick={openSettings}
                    className="flex flex-col items-center gap-[calc(var(--index)*0.15)] group w-full"
                >
                    <div className="p-[calc(var(--index)*0.25)] rounded-[calc(var(--index)*0.4)] hover:bg-white/30 dark:hover:bg-[#2a2a2a]/80 transition-all duration-300 w-full flex justify-center">
                        <Settings className="w-[calc(var(--index)*0.9)] h-[calc(var(--index)*0.9)] text-slate-500 dark:text-gray-300 group-hover:text-[#1e293b] dark:group-hover:text-white transition-colors" />
                    </div>
                    {/* ВОТ ЭТА ПОДПИСЬ ВЕРНУЛАСЬ */}
                    <span className="text-[calc(var(--index)*0.45)] font-medium text-slate-500 dark:text-gray-400 group-hover:text-[#1e293b] dark:group-hover:text-white transition-colors">
                        Настройки
                    </span>
                </button>

                {/* Выход */}
                <button 
                    onClick={handleLogout} 
                    className="flex flex-col items-center gap-[calc(var(--index)*0.15)] group w-full"
                >
                    <div className="p-[calc(var(--index)*0.25)] rounded-[calc(var(--index)*0.4)] hover:bg-red-50/50 dark:hover:bg-red-500/20 transition-all duration-300 w-full flex justify-center">
                        <Logout className="w-[calc(var(--index)*0.9)] h-[calc(var(--index)*0.9)] text-slate-500 dark:text-red-400 group-hover:text-red-500 transition-colors" />
                    </div>
                    {/* ВОТ ЭТА ПОДПИСЬ ВЕРНУЛАСЬ */}
                    <span className="text-[calc(var(--index)*0.45)] font-medium text-slate-500 dark:text-red-400 group-hover:text-red-500 transition-colors">
                        Выход
                    </span>
                </button>
            </div>
       </aside>
    );
}

export default Sidebar;