import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// ИМПОРТЫ ПРОВАЙДЕРОВ
import { FinanceProvider } from './context/FinanceContext'; 
import { ModalProvider } from './context/ModalContext';
import Background from './assets/bg.svg?react';

// ИМПОРТЫ СТРАНИЦ
import Landing from './pages/Landing'; 
import Register from './pages/registration/Register'; 
import Login from './pages/registration/Login'; 
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance'; 
import Documents from './pages/Documents';
import Team from './pages/Team';

// ИМПОРТЫ КОМПОНЕНТОВ
import ProtectedRoute from './components/ProtectedRoute';
import ProfileModal from './components/Modals/ProfileModal';
import SettingsModal from './components/Modals/Settings/SettingsModal';
import LockScreen from './components/Auth/LockScreen';

// ИМПОРТ ХУКА АВТОБЛОКИРОВКИ
import { useInactivity } from './hooks/useInactivity'; 
import './App.css';

// 1. КОМПОНЕНТ ДЛЯ ЗАПУСКА ГЛОБАЛЬНЫХ ХУКОВ
function GlobalHooks() {
  useInactivity(); 
  return null;
}

// 2. МАРШРУТИЗАЦИЯ
function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/finance" 
          element={
            <ProtectedRoute>
              <Finance />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/documents" 
          element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/team" 
          element={
            <ProtectedRoute>
              <Team />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

// 3. ОБЕРТКА КОНТЕНТА ДЛЯ ДОСТУПА К USELOCATION
function AppContent() {
  const location = useLocation();
  // Проверяем, находимся ли мы на странице Landing
  const isLanding = location.pathname === '/';

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#e5e5ea] via-[#d8d8dd] to-[#e5e5ea] dark:from-[#0f1115] dark:via-[#161a23] dark:to-[#0f1115] transition-colors duration-500 overflow-x-hidden text-slate-800 dark:text-white">
      
      {/* ГЛОБАЛЬНЫЙ SVG-ФОН (Меняем opacity: 100% на Landing, 70% на других) */}
      <div className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-500 ${isLanding ? 'opacity-100' : 'opacity-70'}`}>
        <div className="bg-wrapper w-full h-full overflow-hidden">
          <Background className="bg-svg w-full h-full object-cover register-bg" />
        </div>
      </div>

      {/* === КОНТЕНТ ПРИЛОЖЕНИЯ === */}
      <div className="relative z-10 w-full h-full min-h-screen flex flex-col">
        <GlobalHooks /> 
        
        <ModalProvider>
          <AppRoutes />
          <ProfileModal />
          <SettingsModal />
          <LockScreen />
        </ModalProvider>
      </div>
    </div>
  );
}

// 4. ГЛАВНЫЙ КОМПОНЕНТ
function App() {
  return (
    <FinanceProvider>
      {/* BrowserRouter оборачивает AppContent, чтобы внутри работал useLocation */}
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>

      {/* SVG-ФИЛЬТРЫ */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="cloud-blur">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="cloud-blur-hover">
            <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
    </FinanceProvider>
  );
}

export default App;