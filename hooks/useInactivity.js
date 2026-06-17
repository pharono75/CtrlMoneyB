import { useEffect, useRef } from 'react';

export const useInactivity = () => {
  // Используем useRef, чтобы React не путался в памяти и старых таймерах
  const timeoutRef = useRef(null);
  const timeoutMsRef = useRef(0);
  const isLockedRef = useRef(false);

  useEffect(() => {
    const lockApp = () => {
      if (timeoutMsRef.current === 0 || isLockedRef.current) return;
      isLockedRef.current = true;
      window.dispatchEvent(new Event('appLocked'));
    };

    const resetTimer = () => {
      if (isLockedRef.current) return; // Если уже заблокирован - игнор мыши
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (timeoutMsRef.current > 0) {
        timeoutRef.current = setTimeout(lockApp, timeoutMsRef.current);
      }
    };

    const updateTimeout = () => {
      const saved = localStorage.getItem('appSettings');
      const settings = saved ? JSON.parse(saved) : {};
      
      // Если поле пустое, Number('') выдаст 0. Защищаемся от отрицательных чисел.
      const minutes = Math.max(0, Number(settings.autoLockTimer) || 0);
      
      // ЧЕСТНАЯ МАТЕМАТИКА: минуты * 60 секунд * 1000 мс
      timeoutMsRef.current = minutes * 60 * 1000;
      
      // Можешь проверить в консоли браузера, что таймер ставится правильно!
      console.log(`[SmartLock] Таймер обновлен: ${minutes} минут (${timeoutMsRef.current} мс)`);
      
      resetTimer();
    };

    const unlockApp = () => {
      isLockedRef.current = false;
      resetTimer();
    };

    // Старт
    updateTimeout();

    // Отслеживание активности
    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    const handleActivity = () => resetTimer();

    events.forEach(event => window.addEventListener(event, handleActivity));
    window.addEventListener('settingsChanged', updateTimeout);
    window.addEventListener('appUnlocked', unlockApp);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => window.removeEventListener(event, handleActivity));
      window.removeEventListener('settingsChanged', updateTimeout);
      window.removeEventListener('appUnlocked', unlockApp);
    };
  }, []);
};