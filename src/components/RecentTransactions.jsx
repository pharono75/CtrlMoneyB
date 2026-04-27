import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import TransactionDetail from './BalanceCard/TransactionDetail';
import TransactionModal from './BalanceCard/TransactionModal';

// Подключаем единую функцию получения иконок
import { getCategoryIcon } from '../constants/categories';

const RecentTransactions = () => {
  const { transactions } = useFinance();
  const navigate = useNavigate();
  
  const [selectedTx, setSelectedTx] = useState(null)
  const [editingTx, setEditingTx] = useState(null)

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  const topTransactions = sortedTransactions.slice(0, 9);

  const chunks = [];
  for (let i = 0; i < topTransactions.length; i += 3) {
    chunks.push(topTransactions.slice(i, i + 3));
  }

  return (
    <section className="bg-white/40 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/50 p-[calc(var(--index)*0.8)] flex flex-col h-[calc(var(--index)*13)] shadow-xl relative group/section hover:shadow-lg transition-all duration-300">
      <h2 className="text-[calc(var(--index)*0.65)] text-[#1e293b] mb-[calc(var(--index)*0.6)] px-[calc(var(--index)*0.2)] leading-tight">
        Последние транзакции
      </h2>

      <div className="flex-1 w-full overflow-hidden relative h-full">
        {chunks.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 font-medium text-[calc(var(--index)*0.5)]">
            Транзакций пока нет
          </div>
        ) : (
          <Swiper
            modules={[Pagination, Mousewheel]}
            pagination={{ clickable: true }}
            direction="vertical"
            mousewheel={true} 
            spaceBetween={10}
            slidesPerView={1}
            className="h-full w-full vertical-swiper"
            style={{
              "--swiper-pagination-color": "#4C5A7A",
              "--swiper-pagination-bullet-inactive-color": "#94a3b8",
              "--swiper-pagination-bullet-inactive-opacity": "0.5",
              "--swiper-pagination-bullet-size": "6px",
              "--swiper-pagination-bullet-horizontal-gap": "0",
              "--swiper-pagination-bullet-vertical-gap": "6px"
            }}
          >
            {chunks.map((chunk, chunkIndex) => (
              <SwiperSlide key={chunkIndex} className="flex flex-col gap-[calc(var(--index)*0.35)] h-full">
                
                {/* Отрисовываем 3 (или меньше) транзакции в текущем слайде */}
                {chunk.map(tx => (
                  // ВНУТРЕННЯЯ КАРТОЧКА: Свой фон "таблетки" как на макете, УБРАЛИ ЖИРНОСТЬ
                  <div key={tx.id} onClick={() => setSelectedTx(tx)} className="flex items-center gap-[calc(var(--index)*0.5)] bg-white/40 border border-white/60 px-[calc(var(--index)*0.6)] py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.8)] shadow-sm hover:bg-white/60 transition-colors duration-300 cursor-pointer group">
                    
                    {/* Серый кружок для иконки */}
                    <div className="w-[calc(var(--index)*1.6)] h-[calc(var(--index)*1.6)] rounded-full bg-[#cbd5e1]/40 flex items-center justify-center shrink-0 group-hover:bg-[#cbd5e1]/70 transition-colors">
                      {getCategoryIcon(tx.category, tx.counterparty,"w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)] text-[#1e293b]")}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-[calc(var(--index)*0.45)] font-medium text-[#1e293b] truncate leading-tight group-hover:underline transition-all">
                        {tx.counterparty || 'Транзакция'}
                      </p>
                      <p className="text-[calc(var(--index)*0.35)] text-slate-500 mt-[calc(var(--index)*0.05)] truncate leading-tight group-hover:underline transition-all font-medium">
                        {tx.category}
                      </p>
                    </div>
                    
                    {/* Сумма (Темная, НЕ ЖИРНАЯ, как в макете) */}
                    <div className="text-[calc(var(--index)*0.5)] font-medium text-[#1e293b] whitespace-nowrap">
                      {tx.type === 'income' ? '+' : '-'}{Number(tx.amount).toLocaleString('ru-RU')}₽
                    </div>
                  </div>
                ))}

                {/* 5. Кнопка "Посмотреть все транзакции" в стиле AddTransactionBtn, только на последнем слайде */}
                {chunkIndex === chunks.length - 1 && (
                  <div className="mt-auto flex justify-center pb-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.6)]">
                    <button 
                      onClick={() => navigate('/finance')}
                      className="w-full py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] border border-[#64748b]/30 text-[#475569] text-[calc(var(--index)*0.45)] font-medium bg-white/10 hover:bg-[#4C5A7A] hover:text-white hover:border-[#4C5A7A] shadow-sm hover:shadow-md transition-all duration-[400ms] ease-[cubic-bezier(0.03,0.74,1,1.01)] cursor-pointer hover:translate-x-1 transition-transform"
                    >
                      Посмотреть все транзакции →
                    </button>
                  </div>
                )}
                
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      
      {/* 6. Кастомный стиль для позиционирования вертикальной пагинации справа */}
      <style dangerouslySetInnerHTML={{ __html: `
        .vertical-swiper .swiper-pagination-vertical {
          right: 0px !important;
          left: auto !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
        }
        .vertical-swiper .swiper-pagination-bullet {
          margin: 0 !important;
        }
      `}} />

      <TransactionDetail 
        isOpen={!!selectedTx} 
        transaction={selectedTx} 
        onClose={() => setSelectedTx(null)} 
        onEdit={(tx) => setEditingTx(tx)} // <-- Передаем транзакцию в форму редактирования
      />

      <TransactionModal 
        isOpen={!!editingTx}
        onClose={() => setEditingTx(null)}
        initialData={editingTx} // <-- Передаем старые данные
      />
    </section>
  );
};

export default RecentTransactions;