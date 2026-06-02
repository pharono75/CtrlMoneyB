import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

const ProfileModal = () => {
  const { isProfileOpen, closeProfile } = useModal();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: null,
  });

  // Загрузить данные профиля из localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result;
        setProfileData(prev => ({ ...prev, avatar: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    closeProfile();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 },
    },
    exit: { opacity: 0, scale: 0.95, y: -20 },
  };

  return (
    <AnimatePresence>
      {isProfileOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={closeProfile}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white/95 backdrop-blur-xl rounded-[calc(var(--index)*1.2)] border border-white/60 p-[calc(var(--index)*1.5)] w-[calc(100%-3rem)] max-w-[calc(var(--index)*28)] shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Заголовок */}
            <div className="flex items-center justify-between mb-[calc(var(--index)*1)]">
              <h2 className="text-[calc(var(--index)*1)] font-semibold text-[#1e293b]">
                Профиль
              </h2>
              <button
                onClick={closeProfile}
                className="p-[calc(var(--index)*0.3)] hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-[calc(var(--index)*0.7)] h-[calc(var(--index)*0.7)] text-[#4C5A7A]" />
              </button>
            </div>

            {/* Загрузка аватара */}
            <div className="mb-[calc(var(--index)*1.2)] flex flex-col items-center">
              <div className="relative w-[calc(var(--index)*5)] h-[calc(var(--index)*5)] rounded-full bg-gradient-to-br from-[#4C5A7A]/20 to-[#767d8f]/20 border-2 border-[#4C5A7A]/30 flex items-center justify-center overflow-hidden group">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-[calc(var(--index)*2.5)] text-[#4C5A7A]/50">
                    👤
                  </div>
                )}
                <label className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Upload className="w-[calc(var(--index)*1)] h-[calc(var(--index)*1)] text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-[calc(var(--index)*0.4)] text-[#767d8f] mt-[calc(var(--index)*0.5)]">
                Нажмите для загрузки фото
              </p>
            </div>

            {/* Форма */}
            <div className="space-y-[calc(var(--index)*0.8)]">
              <div>
                <label className="block text-[calc(var(--index)*0.4)] font-medium text-[#4C5A7A] mb-[calc(var(--index)*0.3)]">
                  Имя
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/60 border border-white/80 rounded-[calc(var(--index)*0.6)] px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.5)] text-[calc(var(--index)*0.5)] text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-[#4C5A7A] focus:bg-white transition-all"
                  placeholder="Введите имя"
                />
              </div>

              <div>
                <label className="block text-[calc(var(--index)*0.4)] font-medium text-[#4C5A7A] mb-[calc(var(--index)*0.3)]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/60 border border-white/80 rounded-[calc(var(--index)*0.6)] px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.5)] text-[calc(var(--index)*0.5)] text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-[#4C5A7A] focus:bg-white transition-all"
                  placeholder="Введите email"
                />
              </div>

              <div>
                <label className="block text-[calc(var(--index)*0.4)] font-medium text-[#4C5A7A] mb-[calc(var(--index)*0.3)]">
                  Телефон
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-white/60 border border-white/80 rounded-[calc(var(--index)*0.6)] px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.5)] text-[calc(var(--index)*0.5)] text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-[#4C5A7A] focus:bg-white transition-all"
                  placeholder="Введите телефон"
                />
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-[calc(var(--index)*0.6)] mt-[calc(var(--index)*1.5)]">
              <button
                onClick={closeProfile}
                className="flex-1 px-[calc(var(--index)*0.8)] py-[calc(var(--index)*0.6)] rounded-[calc(var(--index)*0.6)] bg-white/60 border border-white/80 text-[calc(var(--index)*0.5)] font-medium text-[#4C5A7A] hover:bg-white/80 transition-all"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-[calc(var(--index)*0.8)] py-[calc(var(--index)*0.6)] rounded-[calc(var(--index)*0.6)] bg-[#4C5A7A] text-[calc(var(--index)*0.5)] font-medium text-white hover:bg-[#3d4a63] transition-all shadow-md"
              >
                Сохранить
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
