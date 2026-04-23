import React from 'react';

const AddTransactionBtn = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full mt-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] border border-[#64748b]/30 text-[#475569] text-[calc(var(--index)*0.45)] font-medium hover:bg-white/40 hover:text-[#1e293b] transition-colors cursor-pointer"
    >
      Добавить транзакцию
    </button>
  );
};

export default AddTransactionBtn;