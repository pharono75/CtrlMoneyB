import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { getCategoryIcon } from "../../constants/categories";
import { useFinance } from "../../context/FinanceContext";
import { CloseIcon, ExpandIcon } from "../Common/Icons";

const TransactionDetail = ({ isOpen, onClose, transaction, onEdit }) => {
  const [optimizedUrl, setOptimizedUrl] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { deleteTransaction } = useFinance();

  useEffect(() => {
    if (transaction?.fileUrl) {
      if (transaction.fileUrl.startsWith('data:')) {
        fetch(transaction.fileUrl)
          .then(res => res.blob())
          .then(blob => {
            setOptimizedUrl(URL.createObjectURL(blob));
          });
      } else {
        setOptimizedUrl(transaction.fileUrl);
      }
    } else {
      setOptimizedUrl(null); // Сброс состояния, чтобы устранить дублирование файлов
    }
    return () => {
      if (optimizedUrl) URL.revokeObjectURL(optimizedUrl);
    };
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const isImage = transaction.fileName && /\.(png|jpg|jpeg)$/i.test(transaction.fileName);
  const isPdf = transaction.fileName && /\.pdf$/i.test(transaction.fileName);

  const handleDelete = () => {
    if (window.confirm("Вы уверены, что хотите удалить эту транзакцию?")) {
      deleteTransaction(transaction.id);
      onClose();
    }
  };

  const handleEditClick = () => {
    onEdit(transaction);
    onClose();
  };

  const displayUrl = optimizedUrl || transaction.fileUrl;

  const modalContent = (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={onClose}>
        <div 
          className="bg-[#f8fafc]/95 backdrop-blur-2xl border border-white/80 rounded-[calc(var(--index)*0.8)] p-[calc(var(--index)*1)] w-full max-w-[calc(var(--index)*28)] max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col gap-[calc(var(--index)*0.8)] animate-in fade-in zoom-in duration-200" 
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-[calc(var(--index)*0.8)] right-[calc(var(--index)*0.8)] text-slate-400 hover:text-slate-700 transition-colors cursor-pointer z-10">
            <CloseIcon className="w-[calc(var(--index)*1)] h-[calc(var(--index)*1)]" />
          </button>

          <div className="flex items-center gap-[calc(var(--index)*0.6)]">
            <div className="w-[calc(var(--index)*2.5)] h-[calc(var(--index)*2.5)] rounded-full bg-[#cbd5e1]/50 flex items-center justify-center shrink-0">
              {getCategoryIcon(transaction.category, transaction.counterparty, "w-[calc(var(--index)*1.2)] h-[calc(var(--index)*1.2)] text-[#1e293b]")}
            </div>
            <div>
              <h2 className="text-[calc(var(--index)*0.8)] font-semibold text-[#1e293b] leading-tight pr-[calc(var(--index)*1)]">
                {transaction.counterparty || 'Транзакция без названия'}
              </h2>
              <p className="text-[calc(var(--index)*0.45)] text-slate-500 font-medium">
                {transaction.category} • {new Date(transaction.date).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>

          <div className="bg-white/50 border border-white/60 rounded-[calc(var(--index)*0.6)] p-[calc(var(--index)*0.6)] flex justify-between items-center shadow-sm">
            <span className="text-[calc(var(--index)*0.5)] text-slate-500 font-medium">Сумма операции</span>
            <span className="text-[calc(var(--index)*0.8)] font-semibold text-[#1e293b]">
              {transaction.type === 'income' ? '+' : '-'}{Number(transaction.amount).toLocaleString('ru-RU')}₽
            </span>
          </div>

          <div className="flex flex-col gap-[calc(var(--index)*0.3)] mt-[calc(var(--index)*0.2)]">
            
            <div className="flex justify-between items-center">
              <h3 className="text-[calc(var(--index)*0.5)] font-semibold text-[#1e293b]">Документ</h3>
              {(isPdf || isImage) && displayUrl && (
                <button 
                  onClick={() => setIsFullscreen(true)}
                  className="text-[calc(var(--index)*0.4)] font-medium text-[#4C5A7A] hover:text-[#3b465e] flex items-center gap-1 transition-colors"
                >
                  <ExpandIcon className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)]" />
                  Развернуть
                </button>
              )}
            </div>
            
            {!displayUrl ? (
              <div className="bg-slate-100/50 border border-dashed border-slate-300 rounded-[calc(var(--index)*0.5)] h-[calc(var(--index)*4)] flex flex-col items-center justify-center text-[calc(var(--index)*0.45)] text-slate-400 font-medium">
                Чек или акт не прикреплен
              </div>
            ) : (
              <div className="bg-white/50 border border-white/60 rounded-[calc(var(--index)*0.5)] p-[calc(var(--index)*0.2)] shadow-inner">
                {isImage && <img src={displayUrl} alt="Документ" className="w-full max-h-[calc(var(--index)*15)] object-contain rounded-[calc(var(--index)*0.4)]" />}
                {isPdf && <iframe src={`${displayUrl}#view=FitH`} className="w-full h-[calc(var(--index)*15)] rounded-[calc(var(--index)*0.4)] bg-white" title="PDF документ" />}
              </div>
            )}
          </div>

          <div className="flex gap-[calc(var(--index)*0.4)] mt-[calc(var(--index)*0.4)] pt-[calc(var(--index)*0.6)] border-t border-slate-200">
            <button 
              onClick={handleDelete}
              className="flex-1 py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] bg-red-50 text-red-600 text-[calc(var(--index)*0.45)] font-medium hover:bg-red-100 transition-colors"
            >
              Удалить
            </button>
            <button 
              onClick={handleEditClick}
              className="flex-1 py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] bg-[#4C5A7A]/10 text-[#4C5A7A] text-[calc(var(--index)*0.45)] font-medium hover:bg-[#4C5A7A]/20 transition-colors"
            >
              Редактировать
            </button>
          </div>

        </div>
      </div>

      {isFullscreen && displayUrl && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 flex flex-col items-center justify-center p-4">
          <button 
            onClick={() => setIsFullscreen(false)} 
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 backdrop-blur-md transition-colors flex items-center gap-2 px-4"
          >
            <CloseIcon className="w-5 h-5" />
            <span className="font-medium">Закрыть полноэкранный режим</span>
          </button>
          
          <div className="w-full h-full max-w-6xl max-h-full py-16 flex items-center justify-center">
             {isImage && <img src={displayUrl} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" alt="Документ" />}
             {isPdf && <iframe src={`${displayUrl}#view=FitH`} className="w-full h-full rounded-lg bg-white shadow-2xl" title="PDF документ" />}
          </div>
        </div>
      )}
    </>
  );

  return createPortal(modalContent, document.body);
};

export default TransactionDetail;