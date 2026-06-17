import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, UserCircle } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { SettingInput } from './Settings/SettingsUI';

const ProfileModal = () => {
  const { isProfileOpen, closeProfile } = useModal();
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    companyName: '', inn: '', firstName: '', lastName: '', position: '', email: '', phone: '', employeeCount: '', avatar: null,
  });

  useEffect(() => {
    if (isProfileOpen) {
      const token = localStorage.getItem('token');
      if (token) {
        fetch('http://localhost:5000/api/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
          if (data && !data.message) setProfileData(prev => ({ ...prev, ...data }));
        })
        .catch(err => console.error(err));
      }
    }
  }, [isProfileOpen]);

  const handleCustomInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setProfileData(prev => ({ ...prev, avatar: event.target?.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch('http://localhost:5000/api/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(profileData)
      });
      window.dispatchEvent(new Event('profileUpdated'));
      closeProfile();
    } catch (err) {
      console.error(err);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isProfileOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-black/60 backdrop-blur-md p-4 transition-colors" onClick={closeProfile}>
          <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="bg-[#f8fafc]/95 dark:bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/80 dark:border-white/10 rounded-[calc(var(--index)*1)] p-[calc(var(--index)*1.2)] w-full max-w-[calc(var(--index)*30)] max-h-[95vh] overflow-y-auto custom-scrollbar shadow-2xl relative flex flex-col transition-colors" onClick={e => e.stopPropagation()}>
            <button onClick={closeProfile} className="absolute top-[calc(var(--index)*0.8)] right-[calc(var(--index)*0.8)] text-slate-400 dark:text-white/50 hover:text-slate-800 dark:hover:text-white transition-colors bg-white/50 dark:bg-white/10 p-2 rounded-full hover:bg-white dark:hover:bg-white/20 z-20">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-[calc(var(--index)*1)] shrink-0">
              <div className="p-2 bg-[#4C5A7A]/10 dark:bg-white/10 rounded-full text-[#4C5A7A] dark:text-white shadow-inner">
                <UserCircle className="w-[calc(var(--index)*1)] h-[calc(var(--index)*1)]" />
              </div>
              <h2 className="text-[calc(var(--index)*0.8)] font-bold text-slate-800 dark:text-white tracking-tight">Профиль организации</h2>
            </div>

            <div className="flex flex-col gap-[calc(var(--index)*0.8)]">
              <div className="flex flex-col items-center justify-center mb-2 shrink-0">
                <div onClick={() => fileInputRef.current?.click()} className="relative w-[calc(var(--index)*4.5)] h-[calc(var(--index)*4.5)] rounded-full border-2 border-dashed border-slate-300 dark:border-white/20 hover:border-[#4C5A7A] dark:hover:border-white/50 bg-slate-50 dark:bg-white/5 flex items-center justify-center cursor-pointer overflow-hidden group transition-all shadow-sm">
                  {profileData.avatar ? (
                    <><img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-sm"><Camera className="w-6 h-6" /></div></>
                  ) : (
                    <div className="flex flex-col items-center text-slate-400 dark:text-white/40 group-hover:text-[#4C5A7A] dark:group-hover:text-white transition-colors"><Camera className="w-6 h-6 mb-1" /><span className="text-[10px] font-medium uppercase tracking-wider">Фото</span></div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
                <p className="text-[calc(var(--index)*0.35)] text-slate-400 dark:text-white/40 mt-3 text-center font-medium">Нажмите, чтобы загрузить<br/>логотип или фото</p>
              </div>

              <div className="bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-[calc(var(--index)*0.6)] p-[calc(var(--index)*0.8)] flex flex-col gap-[calc(var(--index)*0.6)] transition-colors">
                <h3 className="text-[calc(var(--index)*0.45)] font-bold text-[#4C5A7A] dark:text-white uppercase tracking-wider mb-1">Данные компании</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[calc(var(--index)*0.6)]">
                  <SettingInput label="Название компании / ИП" value={profileData.companyName || ''} onChange={(e) => handleCustomInputChange('companyName', e.target.value)} />
                  <SettingInput label="ИНН" value={profileData.inn || ''} onChange={(e) => handleCustomInputChange('inn', e.target.value)} />
                </div>
                <SettingInput label="Количество сотрудников" value={profileData.employeeCount || ''} onChange={(e) => handleCustomInputChange('employeeCount', e.target.value)} placeholder="Например: 11-50" />
              </div>

              <div className="bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 rounded-[calc(var(--index)*0.6)] p-[calc(var(--index)*0.8)] flex flex-col gap-[calc(var(--index)*0.6)] transition-colors">
                <h3 className="text-[calc(var(--index)*0.45)] font-bold text-[#4C5A7A] dark:text-white uppercase tracking-wider mb-1">Личные данные</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[calc(var(--index)*0.6)]">
                  <SettingInput label="Имя" value={profileData.firstName || ''} onChange={(e) => handleCustomInputChange('firstName', e.target.value)} />
                  <SettingInput label="Фамилия" value={profileData.lastName || ''} onChange={(e) => handleCustomInputChange('lastName', e.target.value)} />
                  <SettingInput label="Должность" value={profileData.position || ''} onChange={(e) => handleCustomInputChange('position', e.target.value)} />
                  <SettingInput label="Телефон" type="tel" value={profileData.phone || ''} onChange={(e) => handleCustomInputChange('phone', e.target.value)} />
                </div>
                <SettingInput label="Email (Логин)" type="email" value={profileData.email || ''} onChange={(e) => handleCustomInputChange('email', e.target.value)} />
              </div>

              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={handleSave} className="w-full mt-2 bg-[#4C5A7A] dark:bg-white text-white dark:text-black py-[calc(var(--index)*0.6)] rounded-[calc(var(--index)*0.5)] font-bold text-[calc(var(--index)*0.55)] shadow-md hover:shadow-lg transition-all">
                Сохранить изменения
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
export default ProfileModal;