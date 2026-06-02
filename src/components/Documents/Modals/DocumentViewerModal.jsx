import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { 
  SealStamp, 
  CloseIcon, 
  ExpandIcon, 
  RenameIcon, 
  DocumentShieldIcon, 
  NoFileIcon, 
  SignIcon 
} from "../../Common/Icons";

const DocumentViewerModal = ({ isOpen, onClose, doc, onSign, onUnsign, onDelete, onRename, onDownload }) => {
  const [optimizedUrl, setOptimizedUrl] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if (!doc) return;
    setNewTitle(doc.title || "");

    try {
      const urlToUse = doc.url || doc.fileUrl;
      if (urlToUse) {
        if (typeof urlToUse === 'string' && urlToUse.startsWith('data:')) {
          fetch(urlToUse)
            .then(res => res.blob())
            .then(blob => {
              setOptimizedUrl(URL.createObjectURL(blob));
            })
            .catch(err => {
              console.error("Ошибка чтения PDF:", err);
              setOptimizedUrl(null);
            });
        } else {
          setOptimizedUrl(urlToUse);
        }
      } else {
        setOptimizedUrl(null);
      }
    } catch (error) {
      console.error("Ошибка при обработке ссылки:", error);
    }

    return () => {
      if (optimizedUrl && optimizedUrl.startsWith('blob:')) URL.revokeObjectURL(optimizedUrl);
    };
  }, [doc]);

  if (!isOpen || !doc) return null;

  const fileUrl = doc.url || doc.fileUrl;
  const isDataUri = fileUrl && typeof fileUrl === 'string' && fileUrl.startsWith('data:');
  const displayUrl = optimizedUrl || (isDataUri ? null : fileUrl);
  const isConverting = isDataUri && !optimizedUrl;
  
  const isPdf = doc.type === 'pdf' || /\.pdf$/i.test(doc.title || '');
  const isImage = doc.type === 'image' || /\.(png|jpg|jpeg|gif|webp)$/i.test(doc.title || '');
  const isUnknown = !isPdf && !isImage && !!displayUrl;

  const handleRenameSubmit = () => {
    if (onRename && newTitle.trim()) onRename(doc.id, newTitle.trim());
    setIsRenaming(false);
  };

  const handleDeleteClick = () => {
    if (window.confirm("Удалить этот документ из архива?")) {
      if (onDelete) onDelete(doc.id);
      onClose();
    }
  };

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

          <div className="flex items-start gap-[calc(var(--index)*0.6)]">
            <div className={`w-[calc(var(--index)*2.5)] h-[calc(var(--index)*2.5)] rounded-full ${doc.signed ? 'bg-blue-100' : 'bg-[#cbd5e1]/50'} flex items-center justify-center shrink-0`}>
               <DocumentShieldIcon isSigned={doc.signed} className={`w-[calc(var(--index)*1.2)] h-[calc(var(--index)*1.2)] ${doc.signed ? 'text-blue-600' : 'text-[#1e293b]'}`} />
            </div>
            <div className="flex-1 pr-[calc(var(--index)*1)]">
              {isRenaming ? (
                <div className="flex items-center gap-2">
                  <input autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="flex-1 text-[calc(var(--index)*0.7)] font-semibold text-[#1e293b] border-b-2 border-blue-500 bg-transparent outline-none pb-1" />
                  <button onClick={handleRenameSubmit} className="text-blue-600 font-medium text-sm">Сохранить</button>
                  <button onClick={() => setIsRenaming(false)} className="text-slate-500 font-medium text-sm">Отмена</button>
                </div>
              ) : (
                <div className="group flex items-center gap-2">
                  <h2 className="text-[calc(var(--index)*0.8)] font-semibold text-[#1e293b] leading-tight">{doc.title || 'Документ без названия'}</h2>
                  <button onClick={() => setIsRenaming(true)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-500 transition-opacity" title="Переименовать">
                    <RenameIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
              <p className="text-[calc(var(--index)*0.45)] text-slate-500 font-medium mt-1">
                {doc.period} • Добавлен: {doc.date} {doc.signed && <span className="ml-2 text-blue-600 font-bold flex inline-flex items-center gap-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg> ЭЦП проверена</span>}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-[calc(var(--index)*0.3)] mt-[calc(var(--index)*0.2)]">
            <div className="flex justify-between items-center">
              <h3 className="text-[calc(var(--index)*0.5)] font-semibold text-[#1e293b]">Документ</h3>
              {displayUrl && !isConverting && (
                <button onClick={() => setIsFullscreen(true)} className="text-[calc(var(--index)*0.4)] font-medium text-[#4C5A7A] hover:text-[#3b465e] flex items-center gap-1 transition-colors">
                  <ExpandIcon className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)]" /> Развернуть
                </button>
              )}
            </div>
            
            {isConverting ? (
              <div className="flex flex-col items-center justify-center h-[calc(var(--index)*15)] bg-slate-50/80 rounded-[calc(var(--index)*0.4)] border border-slate-200 shadow-inner">
                <svg className="animate-spin w-[calc(var(--index)*2)] h-[calc(var(--index)*2)] text-[#4C5A7A] mb-[calc(var(--index)*0.5)]" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span className="text-slate-500 font-medium text-[calc(var(--index)*0.5)]">Подготовка документа...</span>
              </div>
            ) : !displayUrl && !doc.reportData ? (
              <div className="bg-slate-100/50 border border-dashed border-slate-300 rounded-[calc(var(--index)*0.5)] h-[calc(var(--index)*4)] flex flex-col items-center justify-center text-[calc(var(--index)*0.45)] text-slate-400 font-medium">
                <NoFileIcon className="w-[calc(var(--index)*1.5)] h-[calc(var(--index)*1.5)] mb-2 opacity-50" />
                Файл не прикреплен
              </div>
            ) : (
              <div className="relative bg-white/50 border border-white/60 rounded-[calc(var(--index)*0.5)] p-[calc(var(--index)*0.2)] shadow-inner overflow-hidden">
                {isImage && <img src={displayUrl} alt="Документ" className="w-full max-h-[calc(var(--index)*15)] object-contain rounded-[calc(var(--index)*0.4)]" />}
                {(isPdf || isUnknown) && displayUrl && <iframe src={`${displayUrl}#view=FitH`} className="w-full h-[calc(var(--index)*15)] rounded-[calc(var(--index)*0.4)] bg-white pointer-events-auto" title="Просмотр документа" />}
                
                {doc.signed && (
                  <div className="absolute bottom-8 right-8 pointer-events-none">
                    <div className="relative w-[calc(var(--index)*6.5)] h-[calc(var(--index)*6.5)] animate-in zoom-in-95 duration-500">
                      <SealStamp isFullscreen={false} />
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[calc(var(--index)*2.5)] text-center">
                        <p className="text-[calc(var(--index)*0.3)] text-blue-700 font-bold whitespace-nowrap">Электронная подпись</p>
                        <p className="text-[calc(var(--index)*0.25)] text-blue-600 opacity-70 whitespace-nowrap">00B2...4F9</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {doc.transactionId && (
            <div className="mt-[calc(var(--index)*0.2)]">
              <div className="bg-blue-50/50 border border-blue-100 rounded-[calc(var(--index)*0.6)] p-[calc(var(--index)*0.6)] flex justify-between items-center shadow-sm">
                <div className="flex flex-col">
                  <span className="text-[calc(var(--index)*0.45)] text-slate-500 font-medium mb-[calc(var(--index)*0.1)]">Связанная операция</span>
                  <span className="text-[calc(var(--index)*0.6)] font-semibold text-[#1e293b]">Транзакция #{doc.transactionId}</span>
                </div>
                <Link to={`/finance/transactions/${doc.transactionId}`} onClick={onClose} className="text-[calc(var(--index)*0.45)] font-medium text-blue-600 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 px-[calc(var(--index)*0.5)] py-[calc(var(--index)*0.3)] rounded-[calc(var(--index)*0.4)] transition-colors whitespace-nowrap inline-flex items-center">
                  К транзакции
                </Link>
              </div>
            </div>
          )}

          <div className="flex gap-[calc(var(--index)*0.4)] mt-[calc(var(--index)*0.4)] pt-[calc(var(--index)*0.6)] border-t border-slate-200">
            {onDownload && (doc.type === 'pdf' || doc.type === 'uploaded' || doc.url) && (
              <button onClick={() => onDownload(doc)} className="flex-1 py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] bg-green-50 border border-green-200 text-green-700 text-[calc(var(--index)*0.45)] font-semibold hover:bg-green-100 transition-colors flex justify-center items-center gap-2 shadow-sm">
                <svg className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                {doc.type === 'pdf' ? 'Скачать PDF' : 'Скачать файл'}
              </button>
            )}
            {onSign && !doc.signed && (
              <button onClick={() => onSign(doc.id)} className="flex-1 py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] bg-blue-50 border border-blue-200 text-blue-700 text-[calc(var(--index)*0.45)] font-semibold hover:bg-blue-100 transition-colors flex justify-center items-center gap-2 shadow-sm">
                <SignIcon className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-blue-600" /> Подписать ЭЦП
              </button>
            )}
            {onUnsign && doc.signed && (
              <button onClick={() => onUnsign(doc.id)} className="flex-1 py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] bg-amber-50 border border-amber-200 text-amber-700 text-[calc(var(--index)*0.45)] font-semibold hover:bg-amber-100 transition-colors flex justify-center items-center gap-2 shadow-sm">
                <CloseIcon className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-amber-600" /> Отменить подпись
              </button>
            )}
            <button onClick={handleDeleteClick} className="flex-1 py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] bg-red-50 text-red-600 text-[calc(var(--index)*0.45)] font-medium hover:bg-red-100 transition-colors">Удалить</button>
          </div>
        </div>
      </div>

      {isFullscreen && displayUrl && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 flex flex-col items-center justify-center p-4">
          <button onClick={() => setIsFullscreen(false)} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 backdrop-blur-md transition-colors flex items-center gap-2 px-4 cursor-pointer">
            <CloseIcon className="w-5 h-5" />
            <span className="font-medium">Закрыть</span>
          </button>
          <div className="relative w-full h-full max-w-6xl max-h-full py-16 flex items-center justify-center">
             {isImage && <img src={displayUrl} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" alt="Документ" />}
             {(isPdf || isUnknown) && <iframe src={`${displayUrl}#view=FitH`} className="w-full h-full rounded-lg bg-white shadow-2xl" title="Просмотр документа" />}
             
             {doc.signed && (
                <div className="absolute bottom-20 right-10 pointer-events-none">
                  <div className="relative w-48 h-48 animate-in zoom-in-95 duration-500">
                    <SealStamp isFullscreen={true} />
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </>
  );

  return createPortal(modalContent, document.body);
};

export default DocumentViewerModal;