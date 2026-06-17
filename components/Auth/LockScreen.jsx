import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fingerprint, Smartphone, Lock, ArrowRight } from 'lucide-react';

const PIN_CODE = "1234";

const LockScreen = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [qrToken, setQrToken] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const handleLock = () => {
      setIsLocked(true);
      setPin('');
      setError('');
      setQrToken(Math.random().toString(36).substring(2) + Date.now());
      document.body.style.overflow = 'hidden'; // Блокируем скролл сайта
      
      // Авто-фокус на инпут после рендера модалки
      setTimeout(() => inputRef.current?.focus(), 100);
    };

    window.addEventListener('appLocked', handleLock);
    return () => window.removeEventListener('appLocked', handleLock);
  }, []);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pin === PIN_CODE) {
      setIsLocked(false);
      setError('');
      document.body.style.overflow = ''; // Возвращаем скролл
      window.dispatchEvent(new Event('appUnlocked')); // Даем сигнал хуку, что мы разблокировались
    } else {
      setError('Неверный PIN-код');
      setPin('');
      inputRef.current?.focus();
    }
  };

  const handleWebAuthn = () => {
    alert(`Заглушка WebAuthn.\n\nВ будущем здесь будет вызов системной биометрии:\n- Touch ID\n- Face ID\n- Windows Hello`);
  };

  if (!isLocked) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }} 
        animate={{ opacity: 1, backdropFilter: "blur(20px)" }} 
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f8fafc]/50 dark:bg-black/60 transition-colors"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
          className="bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/80 dark:border-white/10 rounded-[calc(var(--index)*1)] p-[calc(var(--index)*1.5)] w-full max-w-[400px] shadow-2xl flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-[#4C5A7A]/10 dark:bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Lock className="w-8 h-8 text-[#4C5A7A] dark:text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Сессия заблокирована</h2>
          <p className="text-slate-500 dark:text-white/60 mb-8 text-sm">Введите PIN-код для продолжения (1234)</p>

          <form onSubmit={handleUnlock} className="w-full flex flex-col gap-4">
            <div className="relative">
              <input 
                ref={inputRef}
                type="password" 
                maxLength={4}
                value={pin}
                onChange={(e) => { setPin(e.target.value); setError(''); }}
                placeholder="••••" 
                className={`w-full bg-white dark:bg-white/5 border ${error ? 'border-red-500' : 'border-slate-200 dark:border-white/10'} rounded-xl px-4 py-4 text-center text-2xl tracking-[1em] outline-none text-slate-800 dark:text-white focus:border-[#4C5A7A] dark:focus:border-white transition-all shadow-sm`}
              />
              {error && <p className="absolute -bottom-6 left-0 right-0 text-red-500 text-sm font-medium">{error}</p>}
            </div>

            <button type="submit" className="w-full bg-[#4C5A7A] dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold mt-4 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md">
              Разблокировать <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="flex items-center gap-4 mt-8 w-full">
            <button onClick={handleWebAuthn} type="button" className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/80 cursor-pointer">
              <Fingerprint className="w-6 h-6" />
              <span className="text-xs font-medium">Биометрия</span>
            </button>
            <div className="flex-1 flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/80">
              <Smartphone className="w-6 h-6" />
              <span className="text-[10px] text-center leading-tight">QR-Unlock<br/><span className="opacity-50">в разработке</span></span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LockScreen;