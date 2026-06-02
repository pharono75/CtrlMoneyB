import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const UploadModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Договор');
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Очищаем форму при закрытии
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => { setTitle(''); setCategory('Договор'); setFile(null); }, 300);
    }
  }, [isOpen]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      if (!title) setTitle(e.dataTransfer.files[0].name.replace(/\.[^/.]+$/, ""));
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      if (!title) setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !title.trim()) return alert("Заполните все поля");

    const reader = new FileReader();
    reader.onloadend = () => {
      onSubmit(title.trim(), category, reader.result, file.name);
    };
    reader.readAsDataURL(file);
  };

  // AnimatePresence следит за isOpen и проигрывает анимации выхода (exit)
  return typeof document !== 'undefined' ? createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" 
          onClick={onClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#f8fafc]/95 backdrop-blur-2xl border border-white/80 rounded-[calc(var(--index)*0.8)] p-[calc(var(--index)*1)] w-full max-w-[calc(var(--index)*22)] shadow-2xl relative flex flex-col gap-[calc(var(--index)*0.8)]"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-[calc(var(--index)*0.8)] right-[calc(var(--index)*0.8)] text-slate-400 hover:text-slate-700 transition-colors">
              <svg className="w-[calc(var(--index)*1)] h-[calc(var(--index)*1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h3 className="text-[calc(var(--index)*0.7)] font-bold text-[#1e293b]">Загрузка документа</h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[calc(var(--index)*0.6)] mt-2">
              <div 
                className={`relative border-2 border-dashed rounded-[calc(var(--index)*0.6)] p-[calc(var(--index)*1)] flex flex-col items-center justify-center transition-colors cursor-pointer
                  ${isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 bg-slate-50/50 hover:bg-slate-100/50'}
                  ${file ? 'border-emerald-400 bg-emerald-50/50' : ''}
                `}
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp" />
                {file ? (
                  <>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-[calc(var(--index)*2)] h-[calc(var(--index)*2)] bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-[calc(var(--index)*1)] h-[calc(var(--index)*1)] text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </motion.div>
                    <p className="text-[calc(var(--index)*0.5)] font-semibold text-[#1e293b] text-center truncate w-full px-4">{file.name}</p>
                  </>
                ) : (
                  <>
                    <div className="w-[calc(var(--index)*2)] h-[calc(var(--index)*2)] bg-blue-50 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-[calc(var(--index)*1)] h-[calc(var(--index)*1)] text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    <p className="text-[calc(var(--index)*0.5)] font-medium text-[#1e293b]">Нажмите или перетащите файл сюда</p>
                  </>
                )}
              </div>

              <div>
                <label className="text-[calc(var(--index)*0.45)] text-slate-500 font-medium block mb-2">Название документа</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-white border border-slate-200 rounded-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] outline-none focus:border-[#4C5A7A] text-[calc(var(--index)*0.5)]" />
              </div>

              <div>
                <label className="text-[calc(var(--index)*0.45)] text-slate-500 font-medium block mb-2">Тип документа</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-white border border-slate-200 rounded-[calc(var(--index)*0.4)] px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.4)] outline-none focus:border-[#4C5A7A] text-[calc(var(--index)*0.5)]">
                  {['Договор', 'Акт', 'Счет', 'Накладная', 'Чек', 'Справка', 'Другое'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <motion.button whileHover={file ? { scale: 1.02 } : {}} whileTap={file ? { scale: 0.98 } : {}} type="submit" disabled={!file} className={`w-full mt-2 py-[calc(var(--index)*0.45)] rounded-[calc(var(--index)*0.4)] font-bold text-[calc(var(--index)*0.5)] transition-all ${!file ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-[#4C5A7A] hover:bg-[#3b465e] text-white shadow-md'}`}>
                Сохранить документ
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  ) : null;
};

export default UploadModal;