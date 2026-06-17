import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Palette, Bell, Shield, Database } from 'lucide-react'; 
import { useModal } from '../../../context/ModalContext';
import { GeneralTab, AppearanceTab, NotificationsTab, SecurityTab, DataTab } from './SettingsTabs';
import noiseImage from '../../../assets/noise.png';

const SettingsModal = () => {
  const { isSettingsOpen, closeSettings } = useModal();
  const [activeTab, setActiveTab] = useState('General');

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) return JSON.parse(saved);
    return {
      username: 'Pharono75', email: 'user@ctrlmoneyb.com', blurBalance: true,
      darkMode: false, compactMode: false, pushNotif: true, emailNotif: false, twoFactor: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    window.dispatchEvent(new Event('settingsChanged'));
    if (settings.darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    if (settings.compactMode) document.documentElement.style.setProperty('--index', 'calc(1vw * 0.85)');
    else document.documentElement.style.removeProperty('--index');
    if (settings.blurBalance) document.body.classList.add('hide-amounts');
    else { document.body.classList.remove('hide-amounts'); document.body.classList.remove('reveal-amounts'); }
  }, [settings]);

  const categories = [
    { id: 'General', label: 'Основные', icon: User },
    { id: 'Appearance', label: 'Внешний вид', icon: Palette },
    { id: 'Notifications', label: 'Уведомления', icon: Bell },
    { id: 'Security', label: 'Безопасность', icon: Shield },
    { id: 'Data', label: 'Данные', icon: Database }
  ];

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[calc(var(--index)*1)] font-sans">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-[#000000]/25 dark:bg-black/60 backdrop-blur-[8px] z-0"
            onClick={closeSettings}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative z-10 overflow-hidden flex flex-col md:flex-row shadow-2xl w-full max-w-[calc(var(--index)*45)] h-[calc(var(--index)*29.3)] rounded-[calc(var(--index)*0.83)] border border-white/40 dark:border-white/10 bg-white/10"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute inset-0 z-0 pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url(${noiseImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.6 }} />
            
            <div className="relative z-10 bg-white/50 dark:bg-black/40 border-b md:border-b-0 md:border-r border-white/50 dark:border-white/10 md:w-[30.5%] p-[calc(var(--index)*1.25)] flex flex-col backdrop-blur-xl transition-colors">
              <div className="flex items-center justify-between mb-[calc(var(--index)*.5)] px-[calc(var(--index)*0.5)]">
                <h2 className="text-[calc(var(--index)*1.5)] font-semibold text-[#1e293b] dark:text-white transition-colors">Настройки</h2>
                <button onClick={closeSettings} className="md:hidden p-[calc(var(--index)*0.3)] hover:bg-white/40 dark:hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-[calc(var(--index)*0.7)] h-[calc(var(--index)*0.7)] text-[#1e293b] dark:text-white" />
                </button>
              </div>
              <nav className="flex flex-row md:flex-col gap-[calc(var(--index)*0.4)] overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar mt-[calc(var(--index)*0.5)]">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = activeTab === category.id;
                  return (
                    <button
                      key={category.id} onClick={() => setActiveTab(category.id)}
                      className={`flex items-center gap-[calc(var(--index)*0.6)] px-[calc(var(--index)*0.8)] h-[calc(var(--index)*2)] rounded-[calc(var(--index)*0.6)] transition-all whitespace-nowrap backdrop-blur-md border ${
                        isActive 
                          ? 'bg-[#4C5A7A] dark:bg-white text-white dark:text-black border-transparent shadow-md' 
                          : 'bg-white/50 dark:bg-white/5 text-[#1E293B] dark:text-white/70 border-white/40 dark:border-white/10 hover:bg-white/70 dark:hover:bg-white/10'
                      }`}
                    >
                      <Icon className={`w-[calc(var(--index)*1.04)] h-[calc(var(--index)*1.09)] ${isActive ? 'text-white dark:text-black' : 'text-[#4C5A7A] dark:text-white/60'}`} />
                      <span className="text-[calc(var(--index)*0.6)] font-medium">{category.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="relative z-10 flex-1 bg-white/80 dark:bg-[#0a0a0a]/60 p-[calc(var(--index)*1.5)] flex flex-col h-full overflow-y-auto backdrop-blur-lg transition-colors">
               <div className="hidden md:flex justify-end mb-[calc(var(--index)*0.5)]">
                  <button onClick={closeSettings} className="p-[calc(var(--index)*0.3)] hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors">
                     <X className="w-[calc(var(--index)*0.9)] h-[calc(var(--index)*0.9)] text-[#4C5A7A] dark:text-white" />
                  </button>
               </div>
               <div className="flex-1 max-w-[calc(var(--index)*26)] mx-auto w-full">
                 <h3 className="text-[calc(var(--index)*1.5)] font-semibold text-[#1e293b] dark:text-white mb-[calc(var(--index)*1.5)] transition-colors">
                   {categories.find(c => c.id === activeTab)?.label}
                 </h3>
                 {activeTab === 'General' && <GeneralTab settings={settings} setSettings={setSettings} />}
                 {activeTab === 'Appearance' && <AppearanceTab settings={settings} setSettings={setSettings} />}
                 {activeTab === 'Notifications' && <NotificationsTab settings={settings} setSettings={setSettings} />}
                 {activeTab === 'Security' && <SecurityTab settings={settings} setSettings={setSettings} />}
                 {activeTab === 'Data' && <DataTab />}
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default SettingsModal;