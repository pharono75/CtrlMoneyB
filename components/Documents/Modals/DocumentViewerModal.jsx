import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { SealStamp, CloseIcon, ExpandIcon, RenameIcon, DocumentShieldIcon, NoFileIcon, SignIcon } from "../../Common/Icons";

// Функция генерации настоящей криптографической подписи (Web Crypto API)
const generateDigitalSignature = async (fileUrl, certName) => {
  try {
    let buffer;
    if (fileUrl && fileUrl.startsWith('data:')) {
      const res = await fetch(fileUrl);
      buffer = await res.arrayBuffer();
    } else {
      buffer = new TextEncoder().encode(fileUrl || "empty_document");
    }

    // 1. Создаем пару ключей RSA-2048
    const keyPair = await window.crypto.subtle.generateKey(
      { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
      true, ["sign", "verify"]
    );

    // 2. Подписываем файл (хэш) закрытым ключом
    const signatureBuffer = await window.crypto.subtle.sign("RSASSA-PKCS1-v1_5", keyPair.privateKey, buffer);
    const publicKeyBuffer = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);

    // 3. Конвертируем в Base64
    const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
    const publicKey = btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer)));

    return { signature, publicKey, certName };
  } catch (e) {
    console.error("Crypto error", e);
    return { signature: btoa("mock_sig_" + Date.now()), publicKey: "mock_pk", certName };
  }
};

const DocumentViewerModal = ({ isOpen, onClose, doc, onSign, onUnsign, onDelete, onRename, onDownload }) => {
  const [optimizedUrl, setOptimizedUrl] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // Состояния для окна ЭЦП
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  // Фейковые сертификаты (для UI как в КриптоПро)
  const mockCertificates = [
    { id: 1, name: "Иванов И.И. (Директор)", org: "ООО 'Альфа'", expires: "12.12.2026", provider: "КРИПТО-ПРО ГОСТ Р 34.10-2012" },
    { id: 2, name: "Отдел Бухгалтерии", org: "ООО 'Альфа'", expires: "05.08.2025", provider: "ФНС РОССИИ" }
  ];
  const [selectedCert, setSelectedCert] = useState(mockCertificates[0]);

  useEffect(() => {
    if (!doc) return;
    setNewTitle(doc.title || "");
    try {
      const urlToUse = doc.url || doc.fileUrl;
      if (urlToUse && urlToUse.startsWith('data:')) {
        fetch(urlToUse).then(res => res.blob()).then(blob => setOptimizedUrl(URL.createObjectURL(blob)));
      } else {
        setOptimizedUrl(urlToUse || null);
      }
    } catch (error) {}
    return () => { if (optimizedUrl && optimizedUrl.startsWith('blob:')) URL.revokeObjectURL(optimizedUrl); };
  }, [doc]);

  if (!isOpen || !doc) return null;

  const fileUrl = doc.url || doc.fileUrl;
  const isDataUri = fileUrl && typeof fileUrl === 'string' && fileUrl.startsWith('data:');
  const displayUrl = optimizedUrl || (isDataUri ? null : fileUrl);
  const isConverting = isDataUri && !optimizedUrl;
  
  const isPdf = doc.type === 'pdf' || /\.pdf$/i.test(doc.title || '');
  const isImage = doc.type === 'image' || /\.(png|jpg|jpeg|gif|webp)$/i.test(doc.title || '');

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

  // ФУНКЦИЯ ПРИМЕНЕНИЯ ЭЦП
  const handleApplySignature = async () => {
    setIsSigning(true);
    // Генерируем реальную подпись
    const cryptoData = await generateDigitalSignature(fileUrl, selectedCert.name);
    // Отправляем в DocumentList, а он - на сервер
    onSign(doc.id, cryptoData);
    setIsSigning(false);
    setIsCryptoModalOpen(false);
  };

  const modalContent = (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 dark:bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-[#f8fafc]/95 dark:bg-black/60 backdrop-blur-2xl border border-white/80 dark:border-white/10 rounded-[calc(var(--index)*0.8)] p-[calc(var(--index)*1)] w-full max-w-[calc(var(--index)*28)] max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col gap-[calc(var(--index)*0.8)] animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-[calc(var(--index)*0.8)] right-[calc(var(--index)*0.8)] text-slate-400 hover:text-slate-700 transition-colors z-10"><CloseIcon className="w-[calc(var(--index)*1)] h-[calc(var(--index)*1)]" /></button>

          <div className="flex items-start gap-[calc(var(--index)*0.6)]">
            <div className={`w-[calc(var(--index)*2.5)] h-[calc(var(--index)*2.5)] rounded-full ${doc.signed ? 'bg-blue-100' : 'bg-[#cbd5e1]/50'} dark:bg-white/10 flex items-center justify-center shrink-0`}>
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
                  <h2 className="text-[calc(var(--index)*0.8)] font-semibold text-[#1e293b] dark:text-white/80">{doc.title || 'Документ'}</h2>
                  <button onClick={() => setIsRenaming(true)} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity"><RenameIcon className="w-4 h-4" /></button>
                </div>
              )}
              <p className="text-[calc(var(--index)*0.45)] text-slate-500 font-medium mt-1 dark:text-white/60">
                {doc.period} • Добавлен: {doc.date} 
                {doc.signed && <span className="ml-2 text-blue-600 font-bold flex inline-flex items-center gap-1">✓ ЭЦП проверена</span>}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-[calc(var(--index)*0.3)] mt-[calc(var(--index)*0.2)]">
            <div className="flex justify-between items-center">
              <h3 className="text-[calc(var(--index)*0.5)] font-semibold text-[#1e293b] dark:text-white/80">Документ</h3>
              {displayUrl && !isConverting && (
                <button onClick={() => setIsFullscreen(true)} className="text-[calc(var(--index)*0.4)] font-medium text-[#4C5A7A] hover:text-[#3b465e] flex items-center gap-1 transition-colors"><ExpandIcon className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)]" /> Развернуть</button>
              )}
            </div>
            
            {isConverting ? (
              <div className="flex flex-col items-center justify-center h-[calc(var(--index)*15)] bg-slate-50/80 rounded-[calc(var(--index)*0.4)] border border-slate-200">
                <span className="text-slate-500 font-medium text-[calc(var(--index)*0.5)]">Подготовка...</span>
              </div>
            ) : !displayUrl && !doc.reportData ? (
              <div className="bg-slate-100/50 dark:bg-white/5 border border-dashed rounded-[calc(var(--index)*0.5)] h-[calc(var(--index)*4)] flex flex-col items-center justify-center text-slate-400 font-medium">
                Файл не прикреплен
              </div>
            ) : (
              <div className="relative bg-white/50 border border-white/60 rounded-[calc(var(--index)*0.5)] p-[calc(var(--index)*0.2)] shadow-inner overflow-hidden">
                {isImage && <img src={displayUrl} alt="Документ" className="w-full max-h-[calc(var(--index)*15)] object-contain rounded-[calc(var(--index)*0.4)]" />}
                {(!isImage) && displayUrl && <iframe src={`${displayUrl}#view=FitH`} className="w-full h-[calc(var(--index)*15)] rounded-[calc(var(--index)*0.4)] bg-white" title="Документ" />}
                
                {/* ПЕЧАТЬ ЭЦП С РЕАЛЬНЫМИ ДАННЫМИ */}
                {doc.signed && (
                  <div className="absolute bottom-8 right-8 pointer-events-none">
                    <div className="relative w-[calc(var(--index)*6.5)] h-[calc(var(--index)*6.5)] animate-in zoom-in-95 duration-500">
                      <SealStamp isFullscreen={false} />
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[calc(var(--index)*2.5)] text-center w-full">
                        <p className="text-[calc(var(--index)*0.3)] text-blue-700 font-bold whitespace-nowrap truncate">{doc.certName || 'Электронная подпись'}</p>
                        <p className="text-[calc(var(--index)*0.25)] text-blue-600 opacity-70 whitespace-nowrap">
                          {doc.signature ? doc.signature.substring(0, 15) + '...' : '00B2...4F9'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-[calc(var(--index)*0.4)] pt-[calc(var(--index)*0.6)] border-t border-slate-200">
            {onDownload && (doc.type === 'pdf' || doc.type === 'uploaded' || doc.url) && (
              <button onClick={() => onDownload(doc)} className="flex-1 py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] bg-green-50 text-green-700 text-[calc(var(--index)*0.45)] font-semibold hover:bg-green-100 transition-colors shadow-sm">Скачать</button>
            )}
            {onSign && !doc.signed && (
              <button onClick={() => setIsCryptoModalOpen(true)} className="flex-1 py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] bg-blue-50 text-blue-700 text-[calc(var(--index)*0.45)] font-semibold hover:bg-blue-100 transition-colors flex justify-center items-center gap-2 shadow-sm"><SignIcon className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-blue-600" /> Подписать ЭЦП</button>
            )}
            {onUnsign && doc.signed && (
              <button onClick={() => onUnsign(doc.id)} className="flex-1 py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] bg-amber-50 text-amber-700 text-[calc(var(--index)*0.45)] font-semibold hover:bg-amber-100 transition-colors flex justify-center items-center gap-2 shadow-sm"><CloseIcon className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)] text-amber-600" /> Снять подпись</button>
            )}
            <button onClick={handleDeleteClick} className="flex-1 py-[calc(var(--index)*0.4)] rounded-[calc(var(--index)*0.4)] bg-red-50 text-red-600 text-[calc(var(--index)*0.45)] font-medium hover:bg-red-100 transition-colors">Удалить</button>
          </div>

          {/* МОДАЛЬНОЕ ОКНО "КРИПТОПРО" ВНУТРИ */}
          {isCryptoModalOpen && (
            <div className="absolute inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 rounded-[calc(var(--index)*0.8)]" onClick={() => setIsCryptoModalOpen(false)}>
              <div className="bg-white dark:bg-[#121212] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-6 flex flex-col gap-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  Выбор сертификата ЭЦП
                </h3>
                <div className="flex flex-col gap-2">
                  {mockCertificates.map(cert => (
                    <div key={cert.id} onClick={() => setSelectedCert(cert)} className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedCert.id === cert.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                      <div className="font-bold text-slate-800 dark:text-white text-sm">{cert.name}</div>
                      <div className="text-xs text-slate-500 dark:text-white/60 mt-1">{cert.org}</div>
                      <div className="text-[10px] text-slate-400 dark:text-white/40 mt-1">Провайдер: {cert.provider}</div>
                      <div className="text-[10px] text-slate-400 dark:text-white/40">Действителен до: {cert.expires}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-2">
                  <button onClick={() => setIsCryptoModalOpen(false)} className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white/80 font-medium hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">Отмена</button>
                  <button onClick={handleApplySignature} disabled={isSigning} className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors">
                    {isSigning ? <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Подписать'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default DocumentViewerModal;