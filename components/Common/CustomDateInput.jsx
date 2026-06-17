import React, { useState, useEffect, useRef } from 'react';

const CustomDateInput = ({ name, value, onChange, disabled, className = "", placeholder }) => {
  const [dateFormat, setDateFormat] = useState('DD.MM.YYYY');
  const [isFocused, setIsFocused] = useState(false);
  const [textValue, setTextValue] = useState('');
  
  const dateInputRef = useRef(null);

  // 1. Читаем формат из настроек
  useEffect(() => {
    const checkSettings = () => {
      const saved = localStorage.getItem('appSettings');
      if (saved) setDateFormat(JSON.parse(saved).dateFormat || 'DD.MM.YYYY');
    };
    
    checkSettings();
    window.addEventListener('settingsChanged', checkSettings);
    return () => window.removeEventListener('settingsChanged', checkSettings);
  }, []);

  // 2. Конвертация из базы (YYYY-MM-DD) в текст для пользователя
  const toText = (isoDate) => {
    if (!isoDate) return '';
    const [y, m, d] = isoDate.split('-');
    if (!y || !m || !d) return isoDate;
    
    if (dateFormat === 'MM/DD/YYYY') return `${m}/${d}/${y}`;
    if (dateFormat === 'YYYY-MM-DD') return `${y}-${m}-${d}`;
    return `${d}.${m}.${y}`;
  };

  // 3. Конвертация из текста обратно в базу (YYYY-MM-DD)
  const toIso = (text) => {
    if (!text) return '';
    const parts = text.split(/[-./]/);
    if (parts.length !== 3) return '';
    
    let y, m, d;
    if (dateFormat === 'MM/DD/YYYY') [m, d, y] = parts;
    else if (dateFormat === 'YYYY-MM-DD') [y, m, d] = parts;
    else [d, m, y] = parts;
    
    if (y && y.length === 4 && m && d) {
       return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
    return '';
  };

  // Синхронизация текста с реальным значением
  useEffect(() => {
    if (!isFocused) setTextValue(toText(value));
  }, [value, dateFormat, isFocused]);

  // 4. Маска ввода (автоматически подставляет точки/слэши/тире)
  const handleTextChange = (e) => {
    const input = e.target.value;
    
    // Если стираем текст (Backspace) - разрешаем удалять свободно
    if (input.length < textValue.length) {
      setTextValue(input);
      return;
    }
    
    // Оставляем только цифры
    let val = input.replace(/\D/g, '');
    let delimiter = dateFormat.includes('.') ? '.' : dateFormat.includes('/') ? '/' : '-';

    // Форматируем на лету
    if (dateFormat === 'YYYY-MM-DD') {
       if (val.length > 4) val = val.slice(0, 4) + delimiter + val.slice(4);
       if (val.length > 7) val = val.slice(0, 7) + delimiter + val.slice(7, 9);
    } else {
       if (val.length > 2) val = val.slice(0, 2) + delimiter + val.slice(2);
       if (val.length > 5) val = val.slice(0, 5) + delimiter + val.slice(5, 9);
    }
    
    setTextValue(val);

    // Если дата введена полностью (10 символов) - сразу сохраняем
    if (val.length === 10) {
       const iso = toIso(val);
       if (iso && onChange) onChange({ target: { name, value: iso } });
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const iso = toIso(textValue);
    if (iso && onChange) {
      onChange({ target: { name, value: iso } });
    } else {
      setTextValue(toText(value)); // Откатываем, если ввели бред (например 99.99.9999)
    }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* 1. Поле для ручного ввода с клавиатуры */}
      <input
        type="text"
        name={name}
        value={isFocused ? textValue : (toText(value) || '')}
        onChange={handleTextChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={placeholder || dateFormat}
        className="bg-transparent border-none outline-none p-0 m-0 w-full h-full text-inherit disabled:cursor-not-allowed pr-7"
      />

      {/* 2. Иконка календаря для мышки */}
      {!disabled && (
        <button
          type="button"
          tabIndex="-1" // Чтобы не сбивать фокус при нажатии Tab
          onClick={(e) => {
            e.stopPropagation();
            try { dateInputRef.current.showPicker(); } catch(err) {}
          }}
          className="absolute right-2 text-slate-400 hover:text-[#4C5A7A] transition-colors cursor-pointer"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      )}

      {/* 3. Невидимый системный календарь (открывается по кнопке выше) */}
      <input
        type="date"
        ref={dateInputRef}
        value={value || ''}
        onChange={(e) => {
          if (onChange) onChange(e);
          setTextValue(toText(e.target.value));
        }}
        disabled={disabled}
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
        tabIndex="-1"
      />
    </div>
  );
};

export default CustomDateInput;