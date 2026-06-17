import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Smartphone, Download, Trash2, FileSpreadsheet, ArrowLeft, LogOut, FileCode } from 'lucide-react';
import { SettingToggle, SettingInput, SettingButton, SettingSelect } from './SettingsUI';
import { useFinance } from '../../../context/FinanceContext';

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const pageVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', damping: 25, stiffness: 300 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

// === 1. ОСНОВНЫЕ ===
export const GeneralTab = ({ settings, setSettings }) => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();

  return (
    <motion.div variants={tabVariants} initial="hidden" animate="visible" className="flex flex-col gap-[calc(var(--index)*0.8)]">
      <SettingSelect 
        label="Валюта по умолчанию" 
        value={settings.currency || 'RUB'}
        onChange={(val) => setSettings({...settings, currency: val})}
        options={[{ value: 'RUB', label: '₽ Рубль' }, { value: 'USD', label: '$ Доллар' }, { value: 'EUR', label: '€ Евро' }, { value: 'KZT', label: '₸ Тенге' }]}
      />
      <SettingSelect 
        label="Формат даты" 
        value={settings.dateFormat || 'DD.MM.YYYY'}
        onChange={(val) => setSettings({...settings, dateFormat: val})}
        options={[{ value: 'DD.MM.YYYY', label: `${dd}.${mm}.${yyyy}` }, { value: 'MM/DD/YYYY', label: `${mm}/${dd}/${yyyy}` }, { value: 'YYYY-MM-DD', label: `${yyyy}-${mm}-${dd}` }]}
      />
      <div className="mt-[calc(var(--index)*0.5)]">
        <SettingToggle 
          label="Скрывать баланс при входе" 
          description="Размывать суммы на экранах для приватности"
          isOn={settings.blurBalance || false}
          onToggle={() => setSettings({...settings, blurBalance: !settings.blurBalance})} 
        />
      </div>
    </motion.div>
  );
};

// === 2. ВНЕШНИЙ ВИД ===
export const AppearanceTab = ({ settings, setSettings }) => (
  <motion.div variants={tabVariants} initial="hidden" animate="visible" className="flex flex-col gap-[calc(var(--index)*0.8)]">
    <SettingSelect 
      label="Стиль графиков" 
      value={settings.chartTheme || 'classic'}
      onChange={(val) => setSettings({...settings, chartTheme: val})}
      options={[{ value: 'classic', label: 'Классическая' }, { value: 'highContrast', label: 'Высокий контраст' }, { value: 'soft', label: 'Пастельная' }]}
    />
    <div className="mt-[calc(var(--index)*0.5)] flex flex-col gap-[calc(var(--index)*0.8)]">
      <SettingToggle 
        label="Темная тема" 
        isOn={settings.darkMode || false} 
        onToggle={() => setSettings({...settings, darkMode: !settings.darkMode})} 
      />
      <SettingToggle 
        label="Компактный режим" 
        isOn={settings.compactMode || false} 
        onToggle={() => setSettings({...settings, compactMode: !settings.compactMode})} 
      />
    </div>
  </motion.div>
);

// === 3. УВЕДОМЛЕНИЯ ===
export const NotificationsTab = ({ settings, setSettings }) => (
  <motion.div variants={tabVariants} initial="hidden" animate="visible" className="flex flex-col gap-[calc(var(--index)*0.8)]">
    <SettingToggle label="Превышение бюджетов" isOn={settings.notifyBudgets !== false} onToggle={() => setSettings({...settings, notifyBudgets: !settings.notifyBudgets})} />
    <SettingToggle label="Напоминания о зарплатах" isOn={settings.notifySalaries || false} onToggle={() => setSettings({...settings, notifySalaries: !settings.notifySalaries})} />
    <SettingToggle label="Новые документы" isOn={settings.notifyDocs || false} onToggle={() => setSettings({...settings, notifyDocs: !settings.notifyDocs})} />
    <SettingToggle label="Email отчеты" isOn={settings.emailNotif || false} onToggle={() => setSettings({...settings, emailNotif: !settings.emailNotif})} />
  </motion.div>
);

// === 4. БЕЗОПАСНОСТЬ (ИСПРАВЛЕНО) ===
export const SecurityTab = ({ settings, setSettings }) => {
  const [activePage, setActivePage] = useState(null); 
  
  // Явно запоминаем, если пользователь открыл кастомный инпут
  const isStandardValue = ['0', '1', '5', '15'].includes(String(settings.autoLockTimer));
  const [isCustomMode, setIsCustomMode] = useState(!isStandardValue && settings.autoLockTimer !== undefined);

  const selectValue = isCustomMode ? 'custom' : String(settings.autoLockTimer || '0');

  // --- ПОДСТРАНИЦА: ПАРОЛЬ ---
  if (activePage === 'password') {
    return (
      <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-[calc(var(--index)*0.6)]">
        <button onClick={() => setActivePage(null)} className="flex items-center gap-2 text-[calc(var(--index)*0.5)] font-medium text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white transition-colors w-fit mb-2">
          <ArrowLeft className="w-[calc(var(--index)*0.7)] h-[calc(var(--index)*0.7)]" /> Назад
        </button>
        <h3 className="text-[calc(var(--index)*0.9)] font-bold text-[#1e293b] dark:text-white mb-2">Изменение пароля</h3>
        <SettingInput label="Текущий пароль" type="password" placeholder="••••••••" />
        <SettingInput label="Новый пароль" type="password" placeholder="••••••••" />
        <SettingInput label="Повторите новый пароль" type="password" placeholder="••••••••" />
        <button onClick={() => { alert('Пароль изменен!'); setActivePage(null); }} className="w-full mt-4 bg-[#4C5A7A] dark:bg-white text-white dark:text-black py-[calc(var(--index)*0.6)] rounded-[calc(var(--index)*0.4)] font-bold text-[calc(var(--index)*0.5)] shadow-md hover:opacity-90 transition-opacity">
          Сохранить пароль
        </button>
      </motion.div>
    );
  }

  // --- ПОДСТРАНИЦА: СЕССИИ ---
  if (activePage === 'sessions') {
    return (
      <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col gap-[calc(var(--index)*0.6)]">
        <button onClick={() => setActivePage(null)} className="flex items-center gap-2 text-[calc(var(--index)*0.5)] font-medium text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white transition-colors w-fit mb-2"><ArrowLeft className="w-[calc(var(--index)*0.7)] h-[calc(var(--index)*0.7)]" /> Назад</button>
        <h3 className="text-[calc(var(--index)*0.9)] font-bold text-[#1e293b] dark:text-white mb-2">Активные сессии</h3>
        <div className="flex flex-col gap-[calc(var(--index)*0.4)] mb-4">
          <div className="bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-[calc(var(--index)*0.6)] rounded-[calc(var(--index)*0.5)] flex items-center justify-between">
            <div>
              <p className="text-[calc(var(--index)*0.5)] font-bold text-slate-800 dark:text-white flex items-center gap-2">Windows • Chrome <span className="text-[calc(var(--index)*0.35)] bg-green-100 dark:bg-white/20 text-green-700 dark:text-white px-[calc(var(--index)*0.3)] py-[calc(var(--index)*0.1)] rounded-full uppercase">Текущая</span></p>
              <p className="text-[calc(var(--index)*0.4)] text-slate-500 dark:text-white/50 mt-1">192.168.1.45 • Сейчас</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // --- ПОДСТРАНИЦА: 2FA ---
  if (activePage === '2fa') {
    return (
      <motion.div variants={pageVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center text-center gap-[calc(var(--index)*0.6)]">
        <button onClick={() => setActivePage(null)} className="self-start flex items-center gap-2 text-[calc(var(--index)*0.5)] font-medium text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white transition-colors w-fit mb-2"><ArrowLeft className="w-[calc(var(--index)*0.7)] h-[calc(var(--index)*0.7)]" /> Назад</button>
        <div className="p-[calc(var(--index)*0.6)] bg-[#4C5A7A]/10 dark:bg-white/10 rounded-full text-[#4C5A7A] dark:text-white mb-2"><Shield className="w-[calc(var(--index)*1.2)] h-[calc(var(--index)*1.2)]"/></div>
        <h3 className="text-[calc(var(--index)*0.9)] font-bold text-slate-800 dark:text-white mb-1">Настройка 2FA</h3>
        <p className="text-[calc(var(--index)*0.5)] text-slate-500 dark:text-white/60 mb-4">Отсканируйте этот QR-код</p>
        <div className="w-[calc(var(--index)*6)] h-[calc(var(--index)*6)] bg-white p-2 rounded-xl border-4 border-slate-200 dark:border-white/20 mb-4"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/CtrlMoney?secret=JBSWY3DPEHPK3PXP`} alt="2FA" className="w-full h-full" /></div>
        <div className="w-full mb-4 text-left"><SettingInput label="Код из приложения" type="text" placeholder="123456" /></div>
        <button onClick={() => { setSettings({...settings, twoFactor: true}); setActivePage(null); }} className="w-full bg-[#4C5A7A] dark:bg-white text-white dark:text-black py-[calc(var(--index)*0.6)] rounded-[calc(var(--index)*0.4)] font-bold shadow-md hover:opacity-90 transition-opacity">Включить</button>
      </motion.div>
    );
  }

  // --- ГЛАВНАЯ СТРАНИЦА БЕЗОПАСНОСТИ ---
  return (
    <AnimatePresence mode="wait">
      <motion.div variants={tabVariants} initial="hidden" animate="visible" exit="hidden" className="flex flex-col gap-[calc(var(--index)*0.8)]">
        
        <div className="flex flex-col gap-2">
          <SettingSelect 
            label="Автоблокировка приложения" 
            value={selectValue}
            onChange={(val) => {
              if (val === 'custom') {
                setIsCustomMode(true);
                setSettings({...settings, autoLockTimer: '30'});
              } else {
                setIsCustomMode(false);
                setSettings({...settings, autoLockTimer: val});
              }
            }}
            options={[
              { value: '0', label: 'Не блокировать' },
              { value: '1', label: 'Через 1 минуту' },
              { value: '5', label: 'Через 5 минут' },
              { value: '15', label: 'Через 15 минут' },
              { value: 'custom', label: 'Произвольное время...' }
            ]}
          />
          
          {/* Инпут теперь не исчезает при стирании */}
          {isCustomMode && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
              <SettingInput 
                label="Минут до блокировки (введите число)" 
                type="number" 
                value={settings.autoLockTimer} 
                onChange={(e) => {
                  // Позволяем писать любые символы, даже если поле пустое
                  setSettings({...settings, autoLockTimer: e.target.value});
                }} 
              />
            </motion.div>
          )}
        </div>

        <SettingButton 
          icon={Shield} label="Двухфакторная аутентификация" 
          description={settings.twoFactor ? 'Включена (нажмите для управления)' : 'Дополнительная защита при входе'} 
          onClick={() => {
            if (settings.twoFactor) {
              if (window.confirm('Вы уверены, что хотите отключить 2FA?')) setSettings({...settings, twoFactor: false});
            } else setActivePage('2fa');
          }} 
        />
        
        <div className="mt-[calc(var(--index)*0.5)] flex flex-col gap-[calc(var(--index)*0.8)]">
          <SettingButton icon={Key} label="Изменить пароль" description="Обновить ваш текущий пароль" onClick={() => setActivePage('password')} />
          <SettingButton icon={Smartphone} label="Активные сессии" description="Управление устройствами, где выполнен вход" onClick={() => setActivePage('sessions')} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// === 5. ДАННЫЕ ===
export const DataTab = () => {
  const { transactions } = useFinance();

  // --- 1. ЭКСПОРТ В JSON ---
  const handleExportJSON = () => {
    if (!transactions.length) return alert('Нет данных для экспорта');
    const dataStr = JSON.stringify(transactions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    downloadBlob(blob, `ctrlmoney_data_${formatDate()}.json`);
  };

  // --- 2. ЭКСПОРТ В CSV ---
  const handleExportCSV = () => {
    if (!transactions.length) return alert('Нет данных для экспорта');
    const headers = ['ID', 'Дата', 'Тип', 'Категория', 'Сумма', 'Контрагент'];
    
    const csvRows = transactions.map(t => {
      const typeStr = t.type === 'income' ? 'Доход' : 'Расход';
      const safeCounterparty = (t.counterparty || '').replace(/"/g, '""');
      return `"${t.id}","${t.date}","${typeStr}","${t.category}","${t.amount}","${safeCounterparty}"`;
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    // \uFEFF — это BOM, он нужен, чтобы Excel правильно читал кириллицу (UTF-8) в CSV
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `ctrlmoney_data_${formatDate()}.csv`);
  };

  // --- 3. ЭКСПОРТ В EXCEL (.xls через HTML-структуру) ---
  const handleExportExcel = () => {
    if (!transactions.length) return alert('Нет данных для экспорта');
    const headers = ['ID', 'Дата', 'Тип', 'Категория', 'Сумма', 'Контрагент'];
    
    const rowsHtml = transactions.map(t => `
      <tr>
        <td>${t.id}</td>
        <td>${t.date}</td>
        <td>${t.type === 'income' ? 'Доход' : 'Расход'}</td>
        <td>${t.category}</td>
        <td>${t.amount}</td>
        <td>${t.counterparty || ''}</td>
      </tr>
    `).join('');

    const tableHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"></head>
      <body>
        <table border="1">
          <thead><tr><th>${headers.join('</th><th>')}</th></tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
    downloadBlob(blob, `ctrlmoney_data_${formatDate()}.xls`);
  };

  // --- УДАЛЕНИЕ АККАУНТА (Очистка данных) ---
  const handleDeleteAccount = () => {
    if (window.confirm('ВЫ УВЕРЕНЫ? Это безвозвратно удалит все ваши транзакции, документы и настройки из памяти браузера!')) {
      localStorage.clear();
      window.location.href = '/'; // Перекидываем на главную страницу входа
    }
  };

  // Вспомогательная функция для скачивания файла
  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = () => {
    const d = new Date();
    return `${d.getFullYear()}${(d.getMonth()+1).toString().padStart(2, '0')}${d.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <motion.div variants={tabVariants} initial="hidden" animate="visible" className="flex flex-col gap-[calc(var(--index)*0.8)]">
      <SettingButton icon={FileSpreadsheet} label="Экспорт в Excel" description="Скачать таблицу с транзакциями (.xls)" onClick={handleExportExcel} />
      <SettingButton icon={Download} label="Экспорт в CSV" description="Скачать данные для других программ (.csv)" onClick={handleExportCSV} />
      <SettingButton icon={FileCode} label="Экспорт в JSON" description="Скачать сырые данные базы (.json)" onClick={handleExportJSON} />
      
      <div className="mt-[calc(var(--index)*1)]">
        <SettingButton 
          icon={Trash2} 
          variant="danger" 
          label="Удалить аккаунт и данные" 
          description="Безвозвратное удаление всех ваших транзакций и настроек" 
          onClick={handleDeleteAccount} 
        />
      </div>
    </motion.div>
  );
};