import React from 'react';

const AddTransactionBtn = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full mt-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] border border-[#64748b]/30 text-[#475569] text-[calc(var(--index)*0.45)] font-medium bg-white/10 hover:bg-[#4C5A7A] hover:text-white hover:border-[#4C5A7A] shadow-sm hover:shadow-md transition-all duration-[800ms] ease-[cubic-bezier(0.03,0.74,1,1.01)] cursor-pointer"
    >
      Добавить транзакцию
    </button>
  );
};

export default AddTransactionBtn;