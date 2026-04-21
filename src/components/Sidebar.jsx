import React  from "react";
import { useNavigate } from "react-router-dom";
import Main from '../assets/main.svg?react'
import Fin from '../assets/fin.svg?react'
import Doc from '../assets/doc.svg?react'
import Employee from '../assets/empl.svg?react'
import Profile from '../assets/profile.svg?react'
import Settings from '../assets/settings.svg?react'
import Logout from '../assets/logout.svg?react'

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/');
    }

    return (
       <aside className="w-[calc(var(--index)*3.7)] h-fit sticky top-[calc(var(--index)*1)] bg-white/40 backdrop-blur-xl rounded-[calc(var(--index)*1.1)] border border-white/40 flex flex-col items-center py-[calc(var(--index)*1)] shadow-xl">
            {/* Верхние иконки с подписями */}
            <nav className="flex flex-col gap-[calc(var(--index)*0.8)]">
                {/* Главная */}
                <button className="flex flex-col items-center gap-[calc(var(--index)*0.15)] group">
                <div className="p-[calc(var(--index)*0.25)] rounded-[calc(var(--index)*0.4)] hover:bg-white/30 transition-colors">
                    <Main className="w-[calc(var(--index)*0.9)] h-[calc(var(--index)*0.9)] text-primary-icon group-hover:text-primary transition-colors" />
                </div>
                <span className="text-secondary text-[calc(var(--index)*0.45)] font-medium">Главная</span>
                </button>

                {/* Финансы */}
                <button className="flex flex-col items-center gap-[calc(var(--index)*0.15)] group">
                <div className="p-[calc(var(--index)*0.25)] rounded-[calc(var(--index)*0.4)] hover:bg-white/30 transition-colors">
                    <Fin className="w-[calc(var(--index)*0.9)] h-[calc(var(--index)*0.9)] text-primary-icon group-hover:text-primary transition-colors" />
                </div>
                <span className="text-secondary text-[calc(var(--index)*0.45)] font-medium">Финансы</span>
                </button>

                {/* Документы */}
                <button className="flex flex-col items-center gap-[calc(var(--index)*0.15)] group">
                <div className="p-[calc(var(--index)*0.25)] rounded-[calc(var(--index)*0.4)] hover:bg-white/30 transition-colors">
                    <Doc className="w-[calc(var(--index)*0.9)] h-[calc(var(--index)*0.9)] text-primary-icon group-hover:text-primary transition-colors" />
                </div>
                <span className="text-secondary text-[calc(var(--index)*0.45)] font-medium">Документы</span>
                </button>

                {/* Персонал */}
                <button className="flex flex-col items-center gap-[calc(var(--index)*0.15)] group">
                <div className="p-[calc(var(--index)*0.25)] rounded-[calc(var(--index)*0.4)] hover:bg-white/30 transition-colors">
                    <Employee className="w-[calc(var(--index)*0.9)] h-[calc(var(--index)*0.9)] text-primary-icon group-hover:text-primary transition-colors" />
                </div>
                <span className="text-secondary text-[calc(var(--index)*0.45)] font-medium">Персонал</span>
                </button>

                {/* Профиль */}
                <button className="flex flex-col items-center gap-[calc(var(--index)*0.15)] group">
                <div className="p-[calc(var(--index)*0.25)] rounded-[calc(var(--index)*0.4)] hover:bg-white/30 transition-colors">
                    <Profile className="w-[calc(var(--index)*0.9)] h-[calc(var(--index)*0.9)] text-primary-icon group-hover:text-primary transition-colors" />
                </div>
                <span className="text-secondary text-[calc(var(--index)*0.45)] font-medium">Профиль</span>
                </button>
            </nav>

            <div className="w-[calc(var(--index)*1.1)] h-[calc(var(--index)*0.1)] bg-primary-icon/50 my-[calc(var(--index)*0.5)] rounded-full" />

            {/* Нижний блок */}
            <div className="flex flex-col items-center gap-[calc(var(--index)*0.8)]">
                {/* Настройки */}
                <button className="flex flex-col items-center gap-[calc(var(--index)*0.15)] group">
                <div className="p-[calc(var(--index)*0.25)] rounded-[calc(var(--index)*0.4)] hover:bg-white/30 transition-colors">
                    <Settings className="w-[calc(var(--index)*0.9)] h-[calc(var(--index)*0.9)] text-primary-icon group-hover:text-primary transition-colors" />
                </div>
                <span className="text-secondary text-[calc(var(--index)*0.45)] font-medium">Настройки</span>
                </button>

                {/* Выход */}
                <button 
                onClick={handleLogout} 
                className="flex flex-col items-center gap-[calc(var(--index)*0.15)] group"
                >
                <div className="p-[calc(var(--index)*0.25)] rounded-[calc(var(--index)*0.4)] hover:bg-red-50/30 transition-colors">
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