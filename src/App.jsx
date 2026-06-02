import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing'; 
import Register from './pages/registration/Register'; 
import Login from './pages/registration/Login'; 
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance'; 
import Documents from './pages/Documents';
import Team from './pages/Team';
import ProtectedRoute from './components/ProtectedRoute';
import { ModalProvider } from './context/ModalContext';
import ProfileModal from './components/Modals/ProfileModal';
import SettingsModal from './components/Modals/SettingsModal';
import './App.css';

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

function App() {
  return (
    <BrowserRouter>
      <ModalProvider>
        <AppRoutes />
        <ProfileModal />
        <SettingsModal />
      </ModalProvider>
    </BrowserRouter>
  );
}

export default App;