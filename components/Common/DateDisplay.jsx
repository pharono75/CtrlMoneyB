import React, { useState, useEffect } from 'react';

const DateDisplay = ({ date, className = "" }) => {
  const [dateFormat, setDateFormat] = useState('DD.MM.YYYY');

  useEffect(() => {
    const checkSettings = () => {
      const saved = localStorage.getItem('appSettings');
      if (saved) {
        setDateFormat(JSON.parse(saved).dateFormat || 'DD.MM.YYYY');
      }
    };
    
    checkSettings();
    window.addEventListener('settingsChanged', checkSettings);
    
    return () => window.removeEventListener('settingsChanged', checkSettings);
  }, []);

  const formatCustomDate = (dateString, format) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();

    if (format === 'MM/DD/YYYY') return `${mm}/${dd}/${yyyy}`;
    if (format === 'YYYY-MM-DD') return `${yyyy}-${mm}-${dd}`;
    return `${dd}.${mm}.${yyyy}`; // По умолчанию
  };

  return <span className={className}>{formatCustomDate(date, dateFormat)}</span>;
};

export default DateDisplay;