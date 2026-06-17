import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Main from '../assets/main.svg?react';
import Fin from '../assets/fin.svg?react';
import Doc from '../assets/doc.svg?react';
import Employee from '../assets/empl.svg?react';

const MobileNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const MENU_ITEMS = [
        { path: '/dashboard', label: 'Главная', Icon: Main },
        { path: '/finance', label: 'Финансы', Icon: Fin },
        { path: '/documents', label: 'Документы', Icon: Doc },
        { path: '/team', label: 'Команда', Icon: Employee },
    ];

    return (
        <nav className="hidden mobile:flex fixed bottom-4 left-4 right-4 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-2xl rounded-[1.75rem] border border-white/60 dark:border-white/10 justify-around items-center py-2.5 px-2 shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
            style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
        >
            {MENU_ITEMS.map(({ path, label, Icon }) => {
                const isActive = location.pathname === path;
                return (
                    <button
                        key={path}
                        onClick={() => navigate(path)}
                        aria-label={label}
                        className="flex items-center justify-center p-1 rounded-2xl transition-all min-w-[3.5rem]"
                    >
                        <div className={`p-2.5 rounded-2xl transition-all duration-300 ${
                            isActive
                                ? 'bg-white dark:bg-white/20 shadow-md'
                                : 'bg-transparent'
                        }`}>
                            <Icon className={`w-6 h-6 transition-colors ${
                                isActive
                                    ? 'text-[#1e293b] dark:text-white'
                                    : 'text-[#64748b] dark:text-white/50'
                            }`} />
                        </div>
                    </button>
                );
            })}
        </nav>
    );
};

export default MobileNav;
