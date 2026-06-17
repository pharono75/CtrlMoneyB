import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthInput = forwardRef(({ label, type = "text", value, onChange, error, onKeyDown, icon, maxLength }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  // Умная проверка: если это строка и содержит точку/слэш/data: - это картинка. Иначе - это эмодзи!
  const isImage = typeof icon === 'string' && (icon.includes('.') || icon.includes('/') || icon.includes('data:'));

  return (
    <div className="relative w-full">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-5 h-5 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {icon && (
            <motion.div
              key={typeof icon === 'string' ? icon : 'node'}
              initial={{ scale: 0, rotate: -90, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 90, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="flex items-center justify-center w-full h-full"
            >
              {isImage ? (
                <img src={icon} alt="icon" className="w-5 h-5 object-contain drop-shadow-sm" />
              ) : (
                <span className="text-[18px] leading-none drop-shadow-sm flex items-center justify-center">{icon}</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <input
        ref={ref}
        type={inputType}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        maxLength={maxLength}
        placeholder=" " 
        /* ИСПРАВЛЕНИЕ: Вернули font-['Poppins...'] */
        className={`block pr-4 pb-2 pt-6 w-full h-[52px] text-[13px] text-slate-800 dark:text-white bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-[16px] border font-['Poppins:Regular','Noto_Sans:Regular',sans-serif] ${
          error ? 'border-red-500' : 'border-white/20 dark:border-white/10 focus:border-[#767d8f]/40 dark:focus:border-white/30'
        } appearance-none focus:outline-none focus:ring-0 peer shadow-sm hover:shadow-md transition-all ${
          icon ? 'pl-[46px]' : 'pl-4'
        }`}
      />
      
      <label
        /* ИСПРАВЛЕНИЕ: Вернули font-['Poppins...'] */
        className={`absolute text-[13px] duration-300 transform -translate-y-3 scale-75 top-[16px] z-10 origin-[0] font-['Poppins:Regular','Noto_Sans:Regular',sans-serif] ${
          icon ? 'start-[46px]' : 'start-4'
        } peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[16px] peer-focus:scale-75 peer-focus:-translate-y-3 cursor-text pointer-events-none ${
          error ? 'text-red-500' : 'text-slate-500 dark:text-white/50 peer-focus:text-[#767d8f] dark:peer-focus:text-white/80'
        }`}
      >
        {label}
      </label>

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#767d8f] dark:text-white/50 hover:text-[#646a7a] dark:hover:text-white transition-colors flex items-center justify-center w-5 h-5 z-20"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      )}
    </div>
  );
});

export default AuthInput;