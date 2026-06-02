import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

const SettingsModal = () => {
  const { isSettingsOpen, closeSettings } = useModal();
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    darkMode: false,
    autoSave: true,
  });

  // Загрузить настройки из localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    closeSettings();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 },
    },
    exit: { opacity: 0, scale: 0.95, y: -20 },
  };

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeSettings}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white/95 backdrop-blur-xl rounded-[calc(var(--index)*1.2)] border border-white/60 p-[calc(var(--index)*1.5)] w-[calc(100%-3rem)] max-w-[calc(var(--index)*28)] shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-[calc(var(--index)*1)]">
              <h2 className="text-[calc(var(--index)*1)] font-semibold text-[#1e293b]">
                Настройки
              </h2>
              <button
                onClick={closeSettings}
                className="p-[calc(var(--index)*0.3)] hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-[calc(var(--index)*0.7)] h-[calc(var(--index)*0.7)] text-[#4C5A7A]" />
              </button>
            </div>

            {/* Элементы настроек */}
            <div className="space-y-[calc(var(--index)*0.8)]">
              
              {/* Уведомления */}
              <div className="flex items-center justify-between p-[calc(var(--index)*0.6)] rounded-[calc(var(--index)*0.6)] bg-white/40 border border-white/60 hover:bg-white/60 transition-all">
                <div>
                  <p className="text-[calc(var(--index)*0.5)] font-medium text-[#1e293b]">
                    Уведомления в приложении
                  </p>
                  <p className="text-[calc(var(--index)*0.35)] text-[#767d8f] mt-[calc(var(--index)*0.2)]">
                    Получайте важные уведомления
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('notifications')}
                  className={`relative w-[calc(var(--index)*1.2)] h-[calc(var(--index)*0.7)] rounded-full transition-all ${
                    settings.notifications ? 'bg-[#4C5A7A]' : 'bg-white/60 border border-[#767d8f]/30'
                  }`}
                >
                  <motion.div
                    className="absolute top-[calc(var(--index)*0.05)] w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] bg-white rounded-full shadow-md"
                    animate={{
                      x: settings.notifications ? `calc(var(--index)*0.5)` : 0,
                    }}
                    transition={{ type: 'spring', damping: 20 }}
                  />
                </button>
              </div>

              {/* Email уведомления */}
              <div className="flex items-center justify-between p-[calc(var(--index)*0.6)] rounded-[calc(var(--index)*0.6)] bg-white/40 border border-white/60 hover:bg-white/60 transition-all">
                <div>
                  <p className="text-[calc(var(--index)*0.5)] font-medium text-[#1e293b]">
                    Email уведомления
                  </p>
                  <p className="text-[calc(var(--index)*0.35)] text-[#767d8f] mt-[calc(var(--index)*0.2)]">
                    Получайте отчеты по почте
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('emailNotifications')}
                  className={`relative w-[calc(var(--index)*1.2)] h-[calc(var(--index)*0.7)] rounded-full transition-all ${
                    settings.emailNotifications ? 'bg-[#4C5A7A]' : 'bg-white/60 border border-[#767d8f]/30'
                  }`}
                >
                  <motion.div
                    className="absolute top-[calc(var(--index)*0.05)] w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] bg-white rounded-full shadow-md"
                    animate={{
                      x: settings.emailNotifications ? `calc(var(--index)*0.5)` : 0,
                    }}
                    transition={{ type: 'spring', damping: 20 }}
                  />
                </button>
              </div>

              {/* Автосохранение */}
              <div className="flex items-center justify-between p-[calc(var(--index)*0.6)] rounded-[calc(var(--index)*0.6)] bg-white/40 border border-white/60 hover:bg-white/60 transition-all">
                <div>
                  <p className="text-[calc(var(--index)*0.5)] font-medium text-[#1e293b]">
                    Автосохранение
                  </p>
                  <p className="text-[calc(var(--index)*0.35)] text-[#767d8f] mt-[calc(var(--index)*0.2)]">
                    Автоматически сохранять изменения
                  </p>
                </div>
                <button
                  onClick={() => handleToggle('autoSave')}
                  className={`relative w-[calc(var(--index)*1.2)] h-[calc(var(--index)*0.7)] rounded-full transition-all ${
                    settings.autoSave ? 'bg-[#4C5A7A]' : 'bg-white/60 border border-[#767d8f]/30'
                  }`}
                >
                  <motion.div
                    className="absolute top-[calc(var(--index)*0.05)] w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] bg-white rounded-full shadow-md"
                    animate={{
                      x: settings.autoSave ? `calc(var(--index)*0.5)` : 0,
                    }}
                    transition={{ type: 'spring', damping: 20 }}
                  />
                </button>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-[calc(var(--index)*0.6)] mt-[calc(var(--index)*1.5)]">
              <button
                onClick={closeSettings}
                className="flex-1 px-[calc(var(--index)*0.8)] py-[calc(var(--index)*0.6)] rounded-[calc(var(--index)*0.6)] bg-white/60 border border-white/80 text-[calc(var(--index)*0.5)] font-medium text-[#4C5A7A] hover:bg-white/80 transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-[calc(var(--index)*0.8)] py-[calc(var(--index)*0.6)] rounded-[calc(var(--index)*0.6)] bg-[#4C5A7A] text-[calc(var(--index)*0.5)] font-medium text-white hover:bg-[#3d4a63] transition-all shadow-md"
              >
                Сохранить
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
