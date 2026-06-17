import React, { useRef, useEffect, useState } from 'react';
// Импортируем наш контекст (проверь, правильный ли у тебя путь до FinanceContext)
import { useFinance } from '../../context/FinanceContext';

const MoneyDisplay = ({ amount, className = "" }) => {
  const canvasRef = useRef(null);
  
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const [currency, setCurrency] = useState('RUB');
  const [language, setLanguage] = useState('ru');

  // ДОСТАЕМ КУРСЫ ВАЛЮТ ИЗ КОНТЕКСТА
  // Ставим fallback {}, на случай если компонент отрендерится вне провайдера
  const { exchangeRates } = useFinance() || {}; 

  // УМНОЕ ФОРМАТИРОВАНИЕ И КОНВЕРТАЦИЯ
  // УМНОЕ ФОРМАТИРОВАНИЕ ДЕНЕГ
  const formatMoney = (val) => {
    let finalAmount = Number(val);

    if (currency !== 'RUB' && exchangeRates && exchangeRates[currency]) {
      finalAmount = finalAmount * exchangeRates[currency];
    }
    return new Intl.NumberFormat('ru-RU', { 
      style: 'currency', 
      currency: currency, 
      maximumFractionDigits: 0 
    }).format(finalAmount);
  };

  useEffect(() => {
    const checkSettings = () => {
      const saved = localStorage.getItem('appSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setIsFeatureEnabled(parsed.blurBalance);
        setIsRevealed(!parsed.blurBalance);
        setCurrency(parsed.currency || 'RUB');
        setLanguage(parsed.language || 'ru');
      }
    };
    
    checkSettings();
    window.addEventListener('settingsChanged', checkSettings);
    
    const handleGlobalToggle = () => setIsRevealed(prev => !prev);
    window.addEventListener('toggleAmounts', handleGlobalToggle);

    return () => {
      window.removeEventListener('settingsChanged', checkSettings);
      window.removeEventListener('toggleAmounts', handleGlobalToggle);
    };
  }, []);

  useEffect(() => {
    if (!isFeatureEnabled || isRevealed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;

    const resize = () => {
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };
    resize();

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.8,
      dy: (Math.random() - 0.5) * 0.8
    }));

    let animationId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = document.documentElement.classList.contains('dark');
      ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(76, 90, 122, 0.7)"; 
           
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [isFeatureEnabled, isRevealed]); 

  const handleClick = (e) => {
    e.stopPropagation();
    if (isFeatureEnabled) {
      window.dispatchEvent(new Event('toggleAmounts'));
    }
  };

  return (
    <span className={`relative inline-block cursor-pointer select-none ${className}`} onClick={handleClick}>
      {/* Теперь formatMoney сам конвертирует и рендерит валюту */}
      <span className={`transition-colors duration-[350ms] ease-out ${!isRevealed && isFeatureEnabled ? 'text-transparent' : 'text-current'}`}>
        {formatMoney(amount)}
      </span>
      {isFeatureEnabled && (
        <span className={`absolute inset-[-2px] rounded-[4px] overflow-hidden pointer-events-none transition-all duration-[400ms] ease-out ${isRevealed ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
          <canvas ref={canvasRef} className="w-full h-full block" />
        </span>
      )}
    </span>
  );
};

export default MoneyDisplay;