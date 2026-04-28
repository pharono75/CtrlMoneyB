import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing'; 
import Register from './pages/registration/Register'; 
import Login from './pages/registration/Login'; 
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance'; // <-- НОВЫЙ ИМПОРТ
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Закрытые маршруты */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* НОВЫЙ МАРШРУТ ФИНАНСОВ */}
        <Route 
          path="/finance" 
          element={
            <ProtectedRoute>
              <Finance />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;