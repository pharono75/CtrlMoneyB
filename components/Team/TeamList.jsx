import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Mail, Phone } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const TeamList = ({ list, loading, departments, searchQuery, setSearchQuery, selectedDept, setSelectedDept, onOpenView }) => {
  const swiperContainerRef = useRef(null);
  const [itemsPerSlide, setItemsPerSlide] = useState(5);

  const filteredList = useMemo(() => list.filter(emp => {
    const matchSearch = `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDept = selectedDept === 'Все' || (emp.department || 'Без отдела') === selectedDept;
    return matchSearch && matchDept;
  }), [list, searchQuery, selectedDept]);

  useEffect(() => {
    const container = swiperContainerRef.current;
    if (!container) return;
    const updateItemsPerSlide = (height) => {
      const rows = Math.max(3, Math.floor(height / 90));
      setItemsPerSlide(rows);
    };
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) updateItemsPerSlide(entry.contentRect.height);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const chunks = useMemo(() => {
    const result = [];
    for (let i = 0; i < filteredList.length; i += itemsPerSlide) {
      result.push(filteredList.slice(i, i + itemsPerSlide));
    }
    return result.length === 0 ? [[]] : result;
  }, [filteredList, itemsPerSlide]);

  return (
    <>
      <h1 className="text-[calc(var(--index)*0.9)] font-bold text-[#1e293b] dark:text-white mb-6">Сотрудники</h1>

      <div className="relative mb-6 shrink-0">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-slate-400 dark:text-white/50" />
        <input type="text" placeholder="Поиск сотрудников" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
          className="w-full bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10 rounded-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] pl-12 pr-4 outline-none text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/40 font-medium text-[calc(var(--index)*0.5)] transition-all focus:bg-white dark:focus:border-white shadow-sm" 
        />
      </div>

      <div className="mb-6 shrink-0">
        <h3 className="text-[calc(var(--index)*0.5)] font-bold text-slate-600 dark:text-white/60 mb-3 uppercase tracking-wider">Отделы</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {['Все', ...departments].map((dept, i) => {
            const count = dept === 'Все' ? list.length : list.filter(e => e.department === dept).length;
            return (
              <motion.div key={dept} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} onClick={() => setSelectedDept(dept)}
                className={`min-w-[140px] p-3 rounded-[calc(var(--index)*0.5)] border cursor-pointer transition-all shrink-0 ${
                  selectedDept === dept ? 'bg-white/80 dark:bg-white/20 border-white/80 dark:border-white/20 shadow-md' : 'bg-white/40 dark:bg-white/5 border-white/60 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 shadow-sm'
                }`}
              >
                <h4 className={`font-bold text-[calc(var(--index)*0.45)] mb-1 ${selectedDept === dept ? 'text-[#4C5A7A] dark:text-white' : 'text-slate-700 dark:text-white/70'}`}>{dept}</h4>
                <p className="text-[calc(var(--index)*0.35)] text-slate-500 dark:text-white/50 font-medium">{count} {count === 1 ? 'сотрудник' : count < 5 && count !== 0 ? 'сотрудника' : 'сотрудников'}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 w-full relative overflow-hidden" ref={swiperContainerRef}>
        {loading ? (
          <div className="flex justify-center items-center h-full"><svg className="animate-spin w-8 h-8 text-[#4C5A7A] dark:text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></div>
        ) : filteredList.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-white/50 py-10 font-medium">Сотрудники не найдены</div>
        ) : (
          <Swiper modules={[Pagination, Mousewheel]} mousewheel={true} spaceBetween={20} slidesPerView={1} pagination={{ clickable: true, renderBullet: function (index, className) { return `<span class="${className}">${index + 1}</span>`; } }} className="h-full w-full custom-team-swiper">
            {chunks.map((chunk, chunkIndex) => (
              <SwiperSlide key={chunkIndex} className="h-full">
                <div className="flex flex-col gap-3">
                  <AnimatePresence>
                    {chunk.map((emp, i) => (
                      <motion.div key={emp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2, delay: i * 0.05 }} onClick={() => onOpenView(emp)}
                        className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/80 dark:border-white/10 rounded-[calc(var(--index)*0.5)] p-[calc(var(--index)*0.6)] flex items-center justify-between shadow-sm hover:bg-white/80 dark:hover:bg-white/10 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-[calc(var(--index)*0.6)] min-w-0">
                          <div className="w-[calc(var(--index)*1.2)] h-[calc(var(--index)*1.2)] rounded-full bg-gradient-to-br from-[#767d8f]/20 to-[#4C5A7A]/20 dark:from-white/10 dark:to-white/5 border-2 border-white/60 dark:border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                            {emp.photo ? <img src={emp.photo} alt="Аватар" className="w-full h-full object-cover" /> : <User className="w-[calc(var(--index)*0.7)] h-[calc(var(--index)*0.7)] text-[#4C5A7A] dark:text-white" />}
                          </div>
                          <div className="flex flex-col min-w-0 pr-4">
                            <div className="font-bold text-[#1e293b] dark:text-white text-[calc(var(--index)*0.55)] truncate">{emp.lastName} {emp.firstName} {emp.patronymic || ''}</div>
                            <div className="text-[calc(var(--index)*0.4)] text-slate-600 dark:text-white/60 mb-1 font-medium truncate">{emp.position || emp.department || 'Сотрудник'}</div>
                            <div className="flex flex-wrap items-center gap-3 text-[calc(var(--index)*0.35)] text-slate-500 dark:text-white/50 font-medium mt-0.5">
                              <span className="flex items-center gap-1 truncate"><Mail className="w-[calc(var(--index)*0.35)] h-[calc(var(--index)*0.35)]"/> {emp.email || 'Нет email'}</span>
                              <span className="flex items-center gap-1 truncate"><Phone className="w-[calc(var(--index)*0.35)] h-[calc(var(--index)*0.35)]"/> {emp.phone || 'Нет телефона'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[calc(var(--index)*0.3)] text-slate-500 dark:text-white/50 font-bold uppercase tracking-wider mb-0.5">Зарплата</div>
                          <div className="font-bold text-[#4C5A7A] dark:text-white text-[calc(var(--index)*0.55)]">{Number(emp.salary || 0).toLocaleString('ru-RU')} ₽</div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-team-swiper { padding-bottom: 50px !important; }
        .custom-team-swiper .swiper-pagination { bottom: 0 !important; display: flex; justify-content: center; gap: 8px; align-items: center; }
        .custom-team-swiper .swiper-pagination-bullet { width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; border-radius: calc(var(--index)*0.3); background: white/40; color: #64748b; opacity: 1; font-weight: bold; font-size: 14px; transition: all 0.3s; margin: 0 !important; cursor: pointer; border: 1px solid white/50; }
        html.dark .custom-team-swiper .swiper-pagination-bullet { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.6); }
        .custom-team-swiper .swiper-pagination-bullet-active { background: #4C5A7A; color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: none; }
        html.dark .custom-team-swiper .swiper-pagination-bullet-active { background: white; color: black; border-color: white; }
        .custom-team-swiper .swiper-pagination-bullet:hover:not(.swiper-pagination-bullet-active) { background: white/60; }
      `}} />
    </>
  );
};
export default TeamList;