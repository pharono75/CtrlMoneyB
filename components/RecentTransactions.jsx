import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import TransactionDetail from './BalanceCard/TransactionDetail';
import TransactionModal from './BalanceCard/TransactionModal';
import MoneyDisplay from './Common/MoneyDisplay';
import { getCategoryIcon } from '../constants/categories';

const TransactionRow = ({ tx, onClick }) => (
  <div
    onClick={() => onClick(tx)}
    className="flex items-center gap-[calc(var(--index)*0.5)] mobile:gap-3 bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 px-[calc(var(--index)*0.6)] mobile:px-4 py-[calc(var(--index)*0.4)] mobile:py-3 rounded-[calc(var(--index)*0.8)] mobile:rounded-2xl shadow-sm hover:bg-white/60 dark:hover:bg-white/10 transition-colors duration-300 cursor-pointer group"
  >
    <div className="w-[calc(var(--index)*1.6)] h-[calc(var(--index)*1.6)] mobile:w-11 mobile:h-11 rounded-full bg-[#cbd5e1]/40 dark:bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#cbd5e1]/70 dark:group-hover:bg-white/20 transition-colors">
      {getCategoryIcon(tx.category, tx.note, "w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)] mobile:w-5 mobile:h-5 text-[#1e293b] dark:text-white")}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[calc(var(--index)*0.45)] mobile:text-sm font-medium text-[#1e293b] dark:text-white truncate leading-tight group-hover:underline transition-all">
        {tx.note || 'Без названия'}
      </p>
      <p className="text-[calc(var(--index)*0.35)] mobile:text-xs text-slate-500 dark:text-white/60 mt-[calc(var(--index)*0.05)] truncate leading-tight group-hover:underline transition-all font-medium">
        {tx.category}
      </p>
    </div>
    <div className="flex items-center gap-0 text-[calc(var(--index)*0.5)] mobile:text-sm font-medium text-[#1e293b] dark:text-white whitespace-nowrap">
      <span>{tx.type === 'income' ? '+' : '-'}</span>
      <MoneyDisplay amount={tx.amount} className="text-[calc(var(--index)*0.5)] mobile:text-sm font-medium text-[#1e293b] dark:text-white" />
    </div>
  </div>
);

const RecentTransactions = ({ compact = false }) => {
  const { transactions } = useFinance();
  const navigate = useNavigate();
  const [selectedTx, setSelectedTx] = useState(null);
  const [editingTx, setEditingTx] = useState(null);

  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  const topTransactions = sortedTransactions.slice(0, compact ? 3 : 9);
  const chunks = [];
  for (let i = 0; i < topTransactions.length; i += 3) {
    chunks.push(topTransactions.slice(i, i + 3));
  }

  return (
    <section className={`bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] mobile:rounded-3xl border border-white/50 dark:border-white/10 p-[calc(var(--index)*0.8)] mobile:p-5 flex flex-col shadow-xl relative group/section hover:shadow-lg transition-all duration-500 ${compact ? 'h-auto' : 'h-[calc(var(--index)*13)]'}`}>
      <h2 className="text-[calc(var(--index)*0.65)] mobile:text-base text-[#1e293b] dark:text-white mb-[calc(var(--index)*0.6)] mobile:mb-4 px-[calc(var(--index)*0.2)] leading-tight transition-colors duration-500 font-medium">
        Последние транзакции
      </h2>

      {compact ? (
        <div className="flex flex-col gap-3">
          {topTransactions.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-slate-500 dark:text-white/60 font-medium text-sm">
              Нет данных
            </div>
          ) : (
            topTransactions.map(tx => (
              <TransactionRow key={tx.id} tx={tx} onClick={setSelectedTx} />
            ))
          )}
        </div>
      ) : (
        <div className="flex-1 w-full overflow-hidden relative h-full">
          {chunks.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-500 dark:text-white/60 font-medium text-[calc(var(--index)*0.5)]">
              Нет данных
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
              }}
            >
              {chunks.map((chunk, chunkIndex) => (
                <SwiperSlide key={chunkIndex} className="flex flex-col gap-[calc(var(--index)*0.35)] h-full">
                  {chunk.map(tx => (
                    <TransactionRow key={tx.id} tx={tx} onClick={setSelectedTx} />
                  ))}
                  {chunkIndex === chunks.length - 1 && (
                    <div className="mt-auto flex justify-center pb-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.6)]">
                      <button
                        onClick={() => navigate('/finance')}
                        className="w-full py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] border border-[#64748b]/30 dark:border-white/20 text-[#475569] dark:text-white text-[calc(var(--index)*0.45)] font-medium bg-white/10 dark:bg-white/5 hover:bg-[#4C5A7A] dark:hover:bg-white hover:text-white dark:hover:text-black shadow-sm transition-all duration-[400ms] cursor-pointer hover:translate-x-1"
                      >
                        Посмотреть все
                      </button>
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      )}

      {!compact && (
        <style dangerouslySetInnerHTML={{ __html: `
          .vertical-swiper .swiper-pagination-vertical { right: 0px !important; left: auto !important; top: 50% !important; transform: translateY(-50%) !important; display: flex !important; flex-direction: column !important; gap: 6px !important; }
          .vertical-swiper .swiper-pagination-bullet { margin: 0 !important; }
        `}} />
      )}

      <TransactionDetail isOpen={!!selectedTx} transaction={selectedTx} onClose={() => setSelectedTx(null)} onEdit={(tx) => setEditingTx(tx)} />
      <TransactionModal isOpen={!!editingTx} onClose={() => setEditingTx(null)} initialData={editingTx} />
    </section>
  );
};

export default RecentTransactions;