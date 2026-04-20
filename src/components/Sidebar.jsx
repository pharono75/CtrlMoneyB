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
       <aside className="w-28 bg-white/40 backdrop-blur-xl rounded-[32px] border border-white/40 flex flex-col items-center py-8 shadow-xl">
            {/* Верхние иконки с подписями */}
            <nav className="flex flex-col gap-6 flex-1">
                {/* Главная */}
                <button className="flex flex-col items-center gap-1 group">
                <div className="p-2 rounded-xl hover:bg-white/30 transition-colors">
                    <Main className="w-7 h-7 text-primary-icon group-hover:text-primary transition-colors" />
                </div>
                <span className="text-secondary text-sm font-medium">Главная</span>
                </button>

                {/* Финансы */}
                <button className="flex flex-col items-center gap-1 group">
                <div className="p-2 rounded-xl hover:bg-white/30 transition-colors">
                    <Fin className="w-7 h-7 text-primary-icon group-hover:text-primary transition-colors" />
                </div>
                <span className="text-secondary text-sm font-medium">Финансы</span>
                </button>

                {/* Документы */}
                <button className="flex flex-col items-center gap-1 group">
                <div className="p-2 rounded-xl hover:bg-white/30 transition-colors">
                    <Doc className="w-7 h-7 text-primary-icon group-hover:text-primary transition-colors" />
                </div>
                <span className="text-secondary text-sm font-medium">Документы</span>
                </button>

                {/* Персонал */}
                <button className="flex flex-col items-center gap-1 group">
                <div className="p-2 rounded-xl hover:bg-white/30 transition-colors">
                    <Employee className="w-7 h-7 text-primary-icon group-hover:text-primary transition-colors" />
                </div>
                <span className="text-secondary text-sm font-medium">Персонал</span>
                </button>

                {/* Профиль */}
                <button className="flex flex-col items-center gap-1 group">
                <div className="p-2 rounded-xl hover:bg-white/30 transition-colors">
                    <Profile className="w-7 h-7 text-primary-icon group-hover:text-primary transition-colors" />
                </div>
                <span className="text-secondary text-sm font-medium">Профиль</span>
                </button>
            </nav>

            <div className="w-8 h-1 bg-primary-icon/50 my-4 rounded-full" />

            {/* Нижний блок */}
            <div className="flex flex-col items-center gap-6 mt-auto">
                {/* Настройки */}
                <button className="flex flex-col items-center gap-1 group">
                <div className="p-2 rounded-xl hover:bg-white/30 transition-colors">
                    <Settings className="w-7 h-7 text-primary-icon group-hover:text-primary transition-colors" />
                </div>
                <span className="text-secondary text-sm font-medium">Настройки</span>
                </button>

                {/* Выход */}
                <button 
                onClick={handleLogout} 
                className="flex flex-col items-center gap-1 group"
                >
                <div className="p-2 rounded-xl hover:bg-red-50/30 transition-colors">
                    <Logout className="w-7 h-7 text-primary-icon group-hover:text-red-500 transition-colors" />
                </div>
                <span className="text-secondary text-sm font-medium group-hover:text-red-500 transition-colors">
                    Выход
                </span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;