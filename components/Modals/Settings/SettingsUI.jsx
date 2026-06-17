import React from 'react';
import { motion } from 'framer-motion';

export const SettingToggle = ({ label, description, isOn, onToggle }) => (
  <div className="bg-white dark:bg-white/5 p-[calc(var(--index)*0.8)] rounded-[calc(var(--index)*0.73)] shadow-sm border border-gray-100 dark:border-white/10 flex items-center justify-between cursor-pointer hover:border-[#4C5A7A]/30 dark:hover:border-white/30 transition-colors" onClick={onToggle}>
    <div className="pr-4">
      <p className="text-[calc(var(--index)*0.6)] font-medium text-[#1e293b] dark:text-white">{label}</p>
      {description && <p className="text-[calc(var(--index)*0.45)] text-[#767d8f] dark:text-white/50 mt-1">{description}</p>}
    </div>
    <button className={`relative w-[calc(var(--index)*2.2)] h-[calc(var(--index)*1.2)] rounded-full transition-colors duration-300 flex-shrink-0 ${isOn ? 'bg-[#4C5A7A] dark:bg-white' : 'bg-[#E2E8F0] dark:bg-white/20'}`}>
      <motion.div
        className="absolute top-[calc(var(--index)*0.1)] left-[calc(var(--index)*0.1)] w-[calc(var(--index)*1)] h-[calc(var(--index)*1)] bg-white dark:bg-black rounded-full shadow-sm"
        animate={{ x: isOn ? 'calc(var(--index)*1)' : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  </div>
);

export const SettingInput = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="bg-white dark:bg-white/5 p-[calc(var(--index)*0.8)] rounded-[calc(var(--index)*0.73)] shadow-sm border border-gray-100 dark:border-white/10 flex flex-col gap-[calc(var(--index)*0.4)] focus-within:border-[#4C5A7A]/50 dark:focus-within:border-white/50 focus-within:ring-1 focus-within:ring-[#4C5A7A]/20 dark:focus-within:ring-white/20 transition-all">
    <label className="text-[calc(var(--index)*0.45)] font-medium text-[#767d8f] dark:text-white/60 uppercase tracking-wider">{label}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="text-[calc(var(--index)*0.65)] font-medium text-[#1e293b] dark:text-white bg-transparent border-none outline-none w-full placeholder:text-gray-300 dark:placeholder:text-white/30" />
  </div>
);

export const SettingButton = ({ label, description, onClick, variant = 'primary', icon: Icon }) => {
  const variants = {
    primary: "bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#1e293b] dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 hover:border-[#4C5A7A]/30 dark:hover:border-white/30",
    danger: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-100 dark:border-red-500/30"
  };
  return (
    <div className={`p-[calc(var(--index)*0.8)] rounded-[calc(var(--index)*0.73)] shadow-sm flex items-center justify-between cursor-pointer transition-colors ${variants[variant]}`} onClick={onClick}>
      <div className="flex items-center gap-[calc(var(--index)*0.6)]">
        {Icon && <Icon className={`w-[calc(var(--index)*1.2)] h-[calc(var(--index)*1.2)] ${variant === 'danger' ? 'text-red-500 dark:text-red-400' : 'text-[#4C5A7A] dark:text-white'}`} />}
        <div>
          <p className="text-[calc(var(--index)*0.6)] font-medium">{label}</p>
          {description && <p className={`text-[calc(var(--index)*0.45)] mt-1 ${variant === 'danger' ? 'text-red-400 dark:text-red-400/80' : 'text-[#767d8f] dark:text-white/50'}`}>{description}</p>}
        </div>
      </div>
      <svg className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)] opacity-50 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    </div>
  );
};

export const SettingSelect = ({ label, description, value, options, onChange }) => (
  <div className="bg-white dark:bg-white/5 p-[calc(var(--index)*0.8)] rounded-[calc(var(--index)*0.73)] shadow-sm border border-gray-100 dark:border-white/10 flex items-center justify-between cursor-pointer hover:border-[#4C5A7A]/30 dark:hover:border-white/30 transition-colors">
    <div className="pr-4">
      <p className="text-[calc(var(--index)*0.6)] font-medium text-[#1e293b] dark:text-white">{label}</p>
      {description && <p className="text-[calc(var(--index)*0.45)] text-[#767d8f] dark:text-white/50 mt-1">{description}</p>}
    </div>
    <div className="relative shrink-0">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="bg-[#f8fafc] dark:bg-[#121212] border border-gray-200 dark:border-white/10 text-[#1e293b] dark:text-white text-[calc(var(--index)*0.55)] font-medium rounded-[calc(var(--index)*0.4)] pl-[calc(var(--index)*0.5)] pr-[calc(var(--index)*1.2)] py-[calc(var(--index)*0.35)] outline-none focus:ring-2 focus:ring-[#4C5A7A]/20 dark:focus:ring-white/20 transition-all appearance-none cursor-pointer min-w-[calc(var(--index)*6)]">
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-slate-400 dark:text-white/50 absolute right-[calc(var(--index)*0.3)] top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    </div>
  </div>
);