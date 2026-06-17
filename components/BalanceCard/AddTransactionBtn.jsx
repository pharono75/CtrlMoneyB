import React from 'react';

const AddTransactionBtn = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-[calc(var(--index)*0.4)] mobile:py-3.5 rounded-[calc(var(--index)*0.4)] mobile:rounded-2xl border border-[#64748b]/30 dark:border-white/20 text-[#475569] dark:text-white text-[calc(var(--index)*0.45)] mobile:text-sm font-medium bg-white/25 dark:bg-white/5 hover:bg-[#4C5A7A] dark:hover:bg-white hover:text-white hover:border-[#4C5A7A] dark:hover:text-black dark:hover:border-slate-600 shadow-sm hover:shadow-md transition-all duration-[800ms] ease-[cubic-bezier(0.03,0.74,1,1.01)] cursor-pointer mobile:bg-[#4C5A7A] mobile:text-white mobile:border-[#4C5A7A] mobile:shadow-md mobile:hover:bg-[#3d4a63] ${className}`}
    >
      Добавить транзакцию
    </button>
  );
};

export default AddTransactionBtn;
