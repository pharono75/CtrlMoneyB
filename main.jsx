import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FinanceProvider } from './context/FinanceContext.jsx'

const saved = localStorage.getItem('appSettings');
let isDark = false;

if (saved) {
  const settings = JSON.parse(saved);
  // Если выбрана "Системная тема" (или тема вообще не задана), читаем настройки Windows/macOS
  if (settings.theme === 'system' || !settings.hasOwnProperty('theme')) {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    isDark = settings.theme === 'dark';
  }
} else {
  // По умолчанию системная
  isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
}

if (isDark) document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FinanceProvider>
      <App />
    </FinanceProvider>
  </StrictMode>,
)
