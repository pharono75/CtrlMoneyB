import React, { useState, useEffect } from 'react';
import Settings from '../../assets/settings.svg?react';
import Profile from '../../assets/profile.svg?react';
import { useModal } from '../../context/ModalContext';

const MobileHeader = () => {
  const { openProfile, openSettings } = useModal();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      if (profile.avatar) {
        setAvatar(profile.avatar);
      }
    }
  }, []);

  return (
    <header className="hidden mobile:flex items-center justify-between px-1 pt-2 pb-3 shrink-0">
      <button
        onClick={openProfile}
        className="w-11 h-11 rounded-full overflow-hidden bg-white/50 dark:bg-white/10 border border-white/60 dark:border-white/10 shadow-sm flex items-center justify-center transition-all active:scale-95"
        aria-label="Профиль"
      >
        {avatar ? (
          <img src={avatar} alt="Профиль" className="w-full h-full object-cover" />
        ) : (
          <Profile className="w-6 h-6 text-[#4C5A7A] dark:text-white/80" />
        )}
      </button>

      <button
        onClick={openSettings}
        className="w-11 h-11 rounded-2xl bg-white/50 dark:bg-white/10 border border-white/60 dark:border-white/10 shadow-sm flex items-center justify-center transition-all active:scale-95"
        aria-label="Настройки"
      >
        <Settings className="w-5 h-5 text-[#4C5A7A] dark:text-white/80" />
      </button>
    </header>
  );
};

export default MobileHeader;
