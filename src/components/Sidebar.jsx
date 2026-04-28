import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Main from '../assets/main.svg?react'
import Fin from '../assets/fin.svg?react'
import Doc from '../assets/doc.svg?react'
import Employee from '../assets/empl.svg?react'
import Profile from '../assets/profile.svg?react'
import Settings from '../assets/settings.svg?react'
import Logout from '../assets/logout.svg?react'

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Хук для получения текущего URL

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/');
    }

    // Массив для верхнего меню — избавляемся от дублирования кода
    const MENU_ITEMS = [
        { path: '/dashboard', label: 'Главная', Icon: Main },
        { path: '/finance', label: 'Финансы', Icon: Fin },
        { path: '/documents', label: 'Документы', Icon: Doc },
        { path: '/employees', label: 'Персонал', Icon: Employee },
        { path: '/profile', label: 'Профиль', Icon: Profile },
    ];

    return (
       <aside className="w-[calc(var(--index)*3.7)] h-fit sticky top-[calc(var(--index)*1)] bg-white/40 backdrop-blur-xl rounded-[calc(var(--index)*1.1)] border border-white/40 flex flex-col items-center py-[calc(var(--index)*1)] shadow-xl">
            
            {/* Верхние иконки с подписями */}
            <nav className="flex flex-col gap-[calc(var(--index)*0.8)] w-full px-[calc(var(--index)*0.3)]">
                {MENU_ITEMS.map(({ path, label, Icon }) => {
                    // Проверяем, активна ли сейчас эта страница
                    const isActive = location.pathname === path;

                    return (
                        <button 
                            key={path}
                            onClick={() => navigate(path)}
                            className="flex flex-col items-center gap-[calc(var(--index)*0.15)] group w-full"
                        >
                            <div className={`p-[calc(var(--index)*0.25)] rounded-[calc(var(--index)*0.4)] transition-all duration-300 w-full flex justify-center ${
                                isActive 
                                    ? 'bg-white shadow-sm' // Стиль АКТИВНОЙ кнопки (белый фон)
                                    : 'hover:bg-white/30' // Стиль неактивной кнопки
                            }`}>
                                <Icon className={`w-[calc(var(--index)*0.9)] h-[calc(var(--index)*0.9)] transition-colors ${
                                    isActive ? 'text-primary' : 'text-primary-icon group-hover:text-primary'
                                }`} />
                            </div>
                            <span className={`text-[calc(var(--index)*0.45)] font-medium transition-colors ${
                                isActive ? 'text-primary' : 'text-secondary'
                            }`}>
                                {label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            {/* Разделитель */}
            <div className="w-[calc(var(--index)*1.1)] h-[calc(var(--index)*0.1)] bg-primary-icon/50 my-[calc(var(--index)*0.5)] rounded-full" />

            {/* Нижний блок */}
            <div className="flex flex-col items-center gap-[calc(var(--index)*0.8)] w-full px-[calc(var(--index)*0.3)]">
                
                {/* Настройки (пока без роута) */}
                <button className="flex flex-col items-center gap-[calc(var(--index)*0.15)] group w-full">
                    <div className="p-[calc(var(--index)*0.25)] rounded-[calc(var(--index)*0.4)] hover:bg-white/30 transition-all duration-300 w-full flex justify-center">
                        <Settings className="w-[calc(var(--index)*0.9)] h-[calc(var(--index)*0.9)] text-primary-icon group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-secondary text-[calc(var(--index)*0.45)] font-medium">
                        Настройки
                    </span>
                </button>

                {/* Выход */}
                <button 
                    onClick={handleLogout} 
                    className="flex flex-col items-center gap-[calc(var(--index)*0.15)] group w-full"
                >
                    <div className="p-[calc(var(--index)*0.25)] rounded-[calc(var(--index)*0.4)] hover:bg-red-50/50 transition-all duration-300 w-full flex justify-center">
                        <Logout className="w-[calc(var(--index)*0.9)] h-[calc(var(--index)*0.9)] text-primary-icon group-hover:text-red-500 transition-colors" />
                    </div>
                    <span className="text-secondary text-[calc(var(--index)*0.45)] font-medium group-hover:text-red-500 transition-colors">
                        Выход
                    </span>
                </button>
            </div>
       </aside>
    );
}

export default Sidebar;