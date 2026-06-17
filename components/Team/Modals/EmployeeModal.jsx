import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Phone, Banknote, Calendar, ShieldCheck, Camera, Plus, Trash2 } from 'lucide-react';
import { useFinance } from '../../../context/FinanceContext';
import CustomDateInput from '../../Common/CustomDateInput';

const generateMRZ = (surname, name, series, number) => {
  const safeStr = (str, len) => (str || '').padEnd(len, '<').substring(0, len).toUpperCase();
  const line1 = `PNRUS${safeStr(surname, 15)}<<${safeStr(name, 15)}<<<<<<<<<<<<<<`.substring(0, 44);
  const line2 = `${safeStr(series, 4)}${safeStr(number, 6)}5RUS8001015M2501014<<<<<<<<<<<<<<06`.substring(0, 44);
  return { line1, line2 };
};

const EmployeeModal = ({ isOpen, mode, employee, departments, onClose, onSubmit, onDelete, onAddDepartment }) => {
  const { exchangeRates } = useFinance();
  const [currency, setCurrency] = useState('RUB');
  const [localMode, setLocalMode] = useState(mode);
  const isView = localMode === 'view';
  
  const [formData, setFormData] = useState({
    phone: '', hireDate: '', salary: '', photo: '', position: '', department: '',
    firstName: '', lastName: '', patronymic: '', sex: 'МУЖ.', birthDate: '', birthPlace: '',
    passportSeries: '', passportNumber: '', passportIssuedBy: '', email: '',
    passportIssueDate: '', passportDivisionCode: '', passportRegistrationAddress: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) setCurrency(JSON.parse(saved).currency || 'RUB');
  }, []);

  useEffect(() => {
    if (isOpen) {
      setLocalMode(mode);
      if (employee) {
        let displaySalary = Number(employee.salary || 0);
        if (currency !== 'RUB' && exchangeRates && exchangeRates[currency]) displaySalary = displaySalary * exchangeRates[currency];
        setFormData({
          phone: employee.phone || '', hireDate: employee.hireDate || '', email: employee.email || '',
          salary: displaySalary ? Math.round(displaySalary).toString() : '',
          photo: employee.photo || '', position: employee.position || '', department: employee.department || '',
          firstName: employee.firstName || '', lastName: employee.lastName || '', patronymic: employee.patronymic || '', 
          sex: employee.sex || 'МУЖ.', birthDate: employee.birthDate || '', birthPlace: employee.birthPlace || '', 
          passportSeries: employee.passportSeries || '', passportNumber: employee.passportNumber || '', passportIssuedBy: employee.passportIssuedBy || '', 
          passportIssueDate: employee.passportIssueDate || '', passportDivisionCode: employee.passportDivisionCode || '', passportRegistrationAddress: employee.passportRegistrationAddress || ''
        });
      } else {
        setFormData({
          phone: '', hireDate: '', salary: '', photo: '', position: '', department: (departments && departments[0]) ? departments[0] : '', email: '',
          firstName: '', lastName: '', patronymic: '', sex: 'МУЖ.', birthDate: '', birthPlace: '',
          passportSeries: '', passportNumber: '', passportIssuedBy: '', 
          passportIssueDate: '', passportDivisionCode: '', passportRegistrationAddress: ''
        });
      }
    }
  }, [isOpen, employee, mode, departments, currency, exchangeRates]);

  const handleChange = (e) => {
    if (isView) return;
    let { name, value } = e.target;
    
    if (['firstName', 'lastName', 'patronymic'].includes(name)) {
      value = value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '';
    }

    if (name === 'passportSeries') value = value.replace(/\D/g, '').substring(0, 4);
    if (name === 'passportNumber') value = value.replace(/\D/g, '').substring(0, 6);
    if (name === 'passportDivisionCode') {
        value = value.replace(/\D/g, '').substring(0, 6);
        if (value.length > 3) value = `${value.slice(0, 3)}-${value.slice(3)}`;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    if (isView) return;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, photo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  // ВАЛИДАЦИЯ EMAIL
  const validate = () => {
    if (!formData.firstName || !formData.lastName) { alert("Имя и Фамилия обязательны для заполнения!"); return false; }
    if (!formData.salary || Number(formData.salary) < 0) { alert("Укажите корректную фиксированную зарплату!"); return false; }
    
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        alert("Пожалуйста, введите корректный Email-адрес!");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      let salaryToSave = Number(formData.salary);
      if (currency !== 'RUB' && exchangeRates && exchangeRates[currency]) salaryToSave = salaryToSave / exchangeRates[currency];
      onSubmit({ ...formData, salary: salaryToSave }, employee?.id);
    }
  };

  const handleAddDeptPrompt = () => {
    const newDept = prompt("Введите название нового отдела:");
    if (newDept && newDept.trim()) {
      onAddDepartment(newDept.trim());
      setFormData(prev => ({ ...prev, department: newDept.trim() }));
    }
  };

  const mrz = generateMRZ(formData.lastName, formData.firstName, formData.passportSeries, formData.passportNumber);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-black/60 backdrop-blur-md p-4 transition-colors" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/80 dark:border-white/10 rounded-[calc(var(--index)*0.8)] p-[calc(var(--index)*1)] w-full max-w-6xl max-h-[95vh] overflow-y-auto shadow-2xl relative custom-scrollbar transition-colors" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-[calc(var(--index)*0.8)] right-[calc(var(--index)*0.8)] text-slate-400 dark:text-white/50 hover:text-slate-700 dark:hover:text-white transition-colors bg-white/50 dark:bg-white/10 p-2 rounded-full hover:bg-white dark:hover:bg-white/20 z-20"><X className="w-[calc(var(--index)*1)] h-[calc(var(--index)*1)]" /></button>

            <div className="flex justify-between items-center mb-[calc(var(--index)*1)]">
              <h3 className="text-[calc(var(--index)*0.8)] font-bold text-[#1e293b] dark:text-white flex items-center gap-3">
                <div className="w-[calc(var(--index)*1.5)] h-[calc(var(--index)*1.5)] bg-[#4C5A7A]/10 dark:bg-white/10 rounded-full flex items-center justify-center text-[#4C5A7A] dark:text-white shadow-inner">
                  <ShieldCheck className="w-[calc(var(--index)*0.8)] h-[calc(var(--index)*0.8)]" />
                </div>
                {isView ? 'Профиль сотрудника' : employee ? 'Редактирование сотрудника' : 'Оформление нового сотрудника'}
              </h3>
              
              {isView && (
                <div className="flex gap-2 mr-12">
                  <button onClick={() => setLocalMode('edit')} className="px-4 py-2 bg-[#4C5A7A]/10 dark:bg-white/10 text-[#4C5A7A] dark:text-white rounded-[calc(var(--index)*0.4)] font-bold text-sm hover:bg-[#4C5A7A]/20 dark:hover:bg-white/20 transition-colors">Редактировать</button>
                  <button onClick={() => onDelete(employee.id)} className="p-2 bg-red-50/60 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-[calc(var(--index)*0.4)] hover:bg-red-100/60 dark:hover:bg-red-500/30 transition-colors" title="Уволить"><Trash2 className="w-5 h-5"/></button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-[calc(var(--index)*1)]">
              
              <div className="flex-1 flex flex-col gap-4 items-center justify-start bg-white/40 dark:bg-white/5 p-6 rounded-[calc(var(--index)*0.6)] border border-white/60 dark:border-white/10 shadow-inner overflow-hidden relative transition-colors">
                
                <div className="relative bg-[#fffaf8] dark:bg-[#121212]/80 border border-[#e8d5d5] dark:border-white/10 w-full max-w-[520px] rounded-lg shadow-sm p-6 pr-14 font-serif text-slate-800 dark:text-white overflow-hidden transition-colors">
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(circle at center, #d32f2f 0%, transparent 60%)', backgroundSize: '100% 100%' }}>
                     <div className="text-[120px] font-bold text-[#d32f2f] -rotate-12 select-none">РФ</div>
                  </div>

                  <div className="absolute right-2 top-0 bottom-0 flex items-center justify-center pointer-events-none">
                    <div className="rotate-90 flex gap-3 text-[#c62828] dark:text-white font-mono text-xl tracking-[0.2em] font-bold opacity-30">
                      <span>{formData.passportSeries || '0000'}</span>
                      <span>{formData.passportNumber || '000000'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center border-b border-[#e8d5d5] dark:border-white/10 pb-2 mb-3 relative z-10">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Coat_of_Arms_of_the_Russian_Federation.svg" alt="Герб" className="h-10 opacity-40 mb-1 grayscale dark:invert" />
                    <div className="text-[10px] font-bold text-[#b71c1c] dark:text-white/60 tracking-[0.1em] uppercase">Российская Федерация</div>
                  </div>

                  <div className={`flex gap-4 mb-4 relative z-10 p-2 rounded border transition-colors ${isView ? 'bg-transparent border-transparent' : 'bg-red-50/40 dark:bg-white/5 border-red-100/50 dark:border-white/10'}`}>
                    <div className="flex-1 flex flex-col items-center group/input">
                      <input disabled={isView} name="passportSeries" value={formData.passportSeries} onChange={handleChange} placeholder="0000" className="w-full text-center bg-transparent border-b border-dashed border-slate-400 dark:border-white/30 outline-none font-bold text-[16px] tracking-[0.2em] text-slate-800 dark:text-white focus:border-red-400 dark:focus:border-white focus:bg-white/50 dark:focus:bg-transparent transition-colors disabled:border-transparent" />
                      <span className="text-[9px] text-[#b71c1c]/70 dark:text-white/50 mt-0.5 uppercase tracking-wider">Серия</span>
                    </div>
                    <div className="flex-[2] flex flex-col items-center group/input">
                      <input disabled={isView} name="passportNumber" value={formData.passportNumber} onChange={handleChange} placeholder="000000" className="w-full text-center bg-transparent border-b border-dashed border-slate-400 dark:border-white/30 outline-none font-bold text-[16px] tracking-[0.2em] text-red-700 dark:text-white focus:border-red-400 dark:focus:border-white focus:bg-white/50 dark:focus:bg-transparent transition-colors disabled:border-transparent" />
                      <span className="text-[9px] text-[#b71c1c]/70 dark:text-white/50 mt-0.5 uppercase tracking-wider">Номер паспорта</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center mb-2 relative z-10 group/input">
                    <textarea disabled={isView} name="passportIssuedBy" value={formData.passportIssuedBy} onChange={handleChange} rows="2" className="w-full text-center bg-transparent border-b border-dashed border-slate-400 dark:border-white/30 outline-none uppercase font-bold text-[12px] leading-tight text-slate-700 dark:text-white resize-none focus:border-red-400 dark:focus:border-white focus:bg-white/50 dark:focus:bg-transparent transition-colors disabled:border-transparent" placeholder="ГУ МВД РОССИИ ПО ГОРОДУ МОСКВЕ..." />
                    <span className="text-[9px] text-[#b71c1c]/70 dark:text-white/50 mt-0.5">Паспорт выдан</span>
                  </div>

                  <div className="flex gap-4 mb-4 relative z-10">
                    <div className="flex-1 flex flex-col items-center group/input">
                      <CustomDateInput disabled={isView} name="passportIssueDate" value={formData.passportIssueDate} onChange={handleChange} className="w-full text-center bg-transparent border-b border-dashed border-slate-400 dark:border-white/30 outline-none uppercase font-bold text-[12px] text-slate-700 dark:text-white focus:border-red-400 dark:focus:border-white focus:bg-white/50 dark:focus:bg-transparent transition-colors disabled:border-transparent" />
                      <span className="text-[9px] text-[#b71c1c]/70 dark:text-white/50 mt-0.5">Дата выдачи</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center group/input">
                      <input disabled={isView} type="text" name="passportDivisionCode" value={formData.passportDivisionCode} onChange={handleChange} placeholder="000-000" className="w-full text-center bg-transparent border-b border-dashed border-slate-400 dark:border-white/30 outline-none uppercase font-bold text-[12px] text-slate-700 dark:text-white focus:border-red-400 dark:focus:border-white focus:bg-white/50 dark:focus:bg-transparent transition-colors disabled:border-transparent" />
                      <span className="text-[9px] text-[#b71c1c]/70 dark:text-white/50 mt-0.5">Код подразделения</span>
                    </div>
                  </div>

                  <div className="flex gap-4 relative z-10 mb-6">
                    <div className="w-[100px] flex flex-col items-center gap-1">
                      <div 
                        className={`w-full aspect-[3/4] border-2 border-dashed bg-red-50/50 dark:bg-white/5 rounded flex items-center justify-center text-red-900/40 dark:text-white/30 shadow-inner relative overflow-hidden group/photo ${isView ? 'border-transparent' : 'border-red-300 dark:border-white/20 hover:bg-red-100/50 dark:hover:bg-white/10 cursor-pointer'}`}
                        onClick={() => !isView && document.getElementById('passportPhotoInput').click()}
                      >
                        {formData.photo ? (
                          <>
                            <img src={formData.photo} alt="Фото" className="w-full h-full object-cover" />
                            {!isView && <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white"><Camera className="w-6 h-6" /></div>}
                          </>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Camera className="w-5 h-5 mb-1" />
                            <span className="text-[8px] text-center px-1 font-sans">Фото</span>
                          </div>
                        )}
                        <input id="passportPhotoInput" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isView} />
                      </div>
                      <div className="w-full mt-2 border-b border-slate-800 dark:border-white/30"></div>
                      <span className="text-[8px] text-[#b71c1c]/70 dark:text-white/50">Личная подпись</span>
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex flex-col group/input">
                        <input disabled={isView} name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="ИВАНОВ" className="w-full bg-transparent border-b border-dashed border-slate-400 dark:border-white/30 outline-none uppercase font-bold text-[14px] text-slate-800 dark:text-white focus:border-red-400 dark:focus:border-white focus:bg-white/50 dark:focus:bg-transparent transition-colors disabled:border-transparent" />
                        <span className="text-[9px] text-[#b71c1c]/70 dark:text-white/50 mt-0.5 text-center">Фамилия</span>
                      </div>
                      <div className="flex flex-col group/input">
                        <input disabled={isView} name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="ИВАН" className="w-full bg-transparent border-b border-dashed border-slate-400 dark:border-white/30 outline-none uppercase font-bold text-[14px] text-slate-800 dark:text-white focus:border-red-400 dark:focus:border-white focus:bg-white/50 dark:focus:bg-transparent transition-colors disabled:border-transparent" />
                        <span className="text-[9px] text-[#b71c1c]/70 dark:text-white/50 mt-0.5 text-center">Имя</span>
                      </div>
                      <div className="flex flex-col group/input">
                        <input disabled={isView} name="patronymic" value={formData.patronymic} onChange={handleChange} placeholder="ИВАНОВИЧ" className="w-full bg-transparent border-b border-dashed border-slate-400 dark:border-white/30 outline-none uppercase font-bold text-[14px] text-slate-800 dark:text-white focus:border-red-400 dark:focus:border-white focus:bg-white/50 dark:focus:bg-transparent transition-colors disabled:border-transparent" />
                        <span className="text-[9px] text-[#b71c1c]/70 dark:text-white/50 mt-0.5 text-center">Отчество</span>
                      </div>

                      <div className="flex gap-2">
                        <div className="w-1/3 flex flex-col group/input">
                          <input disabled={isView} name="sex" value={formData.sex} onChange={handleChange} placeholder="МУЖ." className="w-full bg-transparent border-b border-dashed border-slate-400 dark:border-white/30 outline-none uppercase font-bold text-[12px] text-center text-slate-800 dark:text-white focus:border-red-400 dark:focus:border-white focus:bg-white/50 dark:focus:bg-transparent transition-colors disabled:border-transparent" />
                          <span className="text-[9px] text-[#b71c1c]/70 dark:text-white/50 mt-0.5 text-center">Пол</span>
                        </div>
                        <div className="flex-1 flex flex-col group/input">
                          <CustomDateInput disabled={isView} name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full bg-transparent border-b border-dashed border-slate-400 dark:border-white/30 outline-none uppercase font-bold text-[12px] text-center text-slate-800 dark:text-white focus:border-red-400 dark:focus:border-white focus:bg-white/50 dark:focus:bg-transparent transition-colors disabled:border-transparent" />
                          <span className="text-[9px] text-[#b71c1c]/70 dark:text-white/50 mt-0.5 text-center">Дата рождения</span>
                        </div>
                      </div>

                      <div className="flex flex-col group/input mt-1">
                        <input disabled={isView} name="birthPlace" value={formData.birthPlace} onChange={handleChange} placeholder="Г. МОСКВА" className="w-full bg-transparent border-b border-dashed border-slate-400 dark:border-white/30 outline-none uppercase font-bold text-[12px] text-center text-slate-800 dark:text-white focus:border-red-400 dark:focus:border-white focus:bg-white/50 dark:focus:bg-transparent transition-colors disabled:border-transparent" />
                        <span className="text-[9px] text-[#b71c1c]/70 dark:text-white/50 mt-0.5 text-center">Место рождения</span>
                      </div>
                    </div>
                  </div>

                  <div className="font-mono text-[13px] tracking-[0.15em] text-slate-800 dark:text-white/50 leading-tight mt-2 opacity-80 relative z-10 selection:bg-red-200">
                    <div>{mrz.line1}</div>
                    <div>{mrz.line2}</div>
                  </div>
                </div>

                <div className="w-full max-w-[520px]">
                  <label className="text-[11px] text-slate-500 dark:text-white/60 font-bold uppercase block mb-1 ml-1">Адрес регистрации (Прописка)</label>
                  <input disabled={isView} type="text" name="passportRegistrationAddress" value={formData.passportRegistrationAddress} onChange={handleChange} placeholder="Индекс, Город, Улица, Дом, Квартира" className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[#4C5A7A] dark:focus:border-white focus:ring-2 focus:ring-[#4C5A7A]/20 dark:focus:ring-white/20 text-sm dark:text-white font-medium transition-all shadow-sm disabled:bg-slate-50 disabled:dark:bg-black/20 disabled:dark:opacity-50 disabled:border-transparent" />
                </div>
              </div>

              <div className="w-full xl:w-[400px] flex flex-col gap-[calc(var(--index)*0.6)]">
                
                <div className="bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10 rounded-[calc(var(--index)*0.6)] p-[calc(var(--index)*0.8)] shadow-sm flex flex-col gap-4 relative overflow-hidden transition-colors">
                  <div className="flex items-center gap-2 mb-2 border-b border-slate-200 dark:border-white/10 pb-2">
                    <Briefcase className="w-4 h-4 text-[#4C5A7A] dark:text-white" />
                    <h4 className="text-[calc(var(--index)*0.5)] font-bold text-[#4C5A7A] dark:text-white">Организация</h4>
                  </div>
                  
                  <div>
                    <label className="text-[calc(var(--index)*0.4)] text-slate-500 dark:text-white/60 font-bold uppercase block mb-1">Отдел *</label>
                    <div className="flex gap-2">
                      <select disabled={isView} required name="department" value={formData.department} onChange={handleChange} className="flex-1 bg-white/80 dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 outline-none focus:border-[#4C5A7A] dark:focus:border-white focus:ring-2 focus:ring-[#4C5A7A]/20 dark:focus:ring-white/20 text-[calc(var(--index)*0.5)] dark:text-white font-medium transition-all disabled:bg-slate-50 disabled:dark:bg-black/20 disabled:opacity-80">
                        <option value="" disabled>Выберите отдел</option>
                        {(departments || []).map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      {!isView && (
                        <button type="button" onClick={handleAddDeptPrompt} className="bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white rounded-lg px-3 flex items-center justify-center transition-colors" title="Добавить отдел">
                          <Plus className="w-[calc(var(--index)*0.6)] h-[calc(var(--index)*0.6)]" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-[calc(var(--index)*0.4)] text-slate-500 dark:text-white/60 font-bold uppercase block mb-1">Должность *</label>
                    <input disabled={isView} required type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Менеджер" className="w-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 outline-none focus:border-[#4C5A7A] dark:focus:border-white focus:ring-2 focus:ring-[#4C5A7A]/20 dark:focus:ring-white/20 text-[calc(var(--index)*0.5)] dark:text-white font-medium transition-all disabled:bg-slate-50 disabled:dark:bg-black/20 disabled:dark:opacity-50 disabled:border-transparent" />
                  </div>

                  <div>
                    <label className="text-[calc(var(--index)*0.4)] text-slate-500 dark:text-white/60 font-bold uppercase block mb-1">
                      Фиксированная зарплата ({currency === 'RUB' ? '₽' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₸'}) *
                    </label>
                    <div className="relative">
                      <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-[calc(var(--index)*0.5)] h-[calc(var(--index)*0.5)] text-slate-400 dark:text-white/50" />
                      <input disabled={isView} required type="number" min="0" step="100" name="salary" value={formData.salary} onChange={handleChange} placeholder="100000" className="w-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg pl-10 pr-3 py-2.5 outline-none focus:border-[#4C5A7A] dark:focus:border-white focus:ring-2 focus:ring-[#4C5A7A]/20 dark:focus:ring-white/20 text-[calc(var(--index)*0.5)] dark:text-white font-medium transition-all disabled:bg-slate-50 disabled:dark:bg-black/20 disabled:dark:opacity-50 disabled:border-transparent" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[calc(var(--index)*0.4)] text-slate-500 dark:text-white/60 font-bold uppercase block mb-1">Дата найма *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-[calc(var(--index)*0.5)] h-[calc(var(--index)*0.5)] text-slate-400 dark:text-white/50" />
                      <CustomDateInput disabled={isView} name="hireDate" value={formData.hireDate} onChange={handleChange} className="w-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg pl-10 pr-3 py-2.5 outline-none focus:border-[#4C5A7A] dark:focus:border-white focus:ring-2 focus:ring-[#4C5A7A]/20 dark:focus:ring-white/20 text-[calc(var(--index)*0.5)] dark:text-white font-medium transition-all disabled:bg-slate-50 disabled:dark:bg-black/20 disabled:dark:opacity-50 disabled:border-transparent" />
                    </div>
                  </div>
                </div>

                <div className="bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10 rounded-[calc(var(--index)*0.6)] p-[calc(var(--index)*0.8)] shadow-sm flex flex-col gap-4 relative overflow-hidden transition-colors">
                  <div className="flex items-center gap-2 mb-2 border-b border-slate-200 dark:border-white/10 pb-2">
                    <Phone className="w-[calc(var(--index)*0.5)] h-[calc(var(--index)*0.5)] text-[#4C5A7A] dark:text-white" />
                    <h4 className="text-[calc(var(--index)*0.5)] font-bold text-[#4C5A7A] dark:text-white">Контакты</h4>
                  </div>
                  
                  <div>
                    <label className="text-[calc(var(--index)*0.4)] text-slate-500 dark:text-white/60 font-bold uppercase block mb-1">Мобильный телефон</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-[calc(var(--index)*0.5)] h-[calc(var(--index)*0.5)] text-slate-400 dark:text-white/50" />
                      <input disabled={isView} type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+7 (999) 000-00-00 (или буквами)" className="w-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg pl-10 pr-3 py-2.5 outline-none focus:border-[#4C5A7A] dark:focus:border-white focus:ring-2 focus:ring-[#4C5A7A]/20 dark:focus:ring-white/20 text-[calc(var(--index)*0.5)] dark:text-white font-medium transition-all disabled:bg-slate-50 disabled:dark:bg-black/20 disabled:dark:opacity-50 disabled:border-transparent" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[calc(var(--index)*0.4)] text-slate-500 dark:text-white/60 font-bold uppercase block mb-1">Email</label>
                    <input disabled={isView} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@mail.com" className="w-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-2.5 outline-none focus:border-[#4C5A7A] dark:focus:border-white focus:ring-2 focus:ring-[#4C5A7A]/20 dark:focus:ring-white/20 text-[calc(var(--index)*0.5)] dark:text-white font-medium transition-all disabled:bg-slate-50 disabled:dark:bg-black/20 disabled:dark:opacity-50 disabled:border-transparent" />
                  </div>
                </div>

                {!isView && (
                  <motion.button 
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                    className="w-full mt-auto py-[calc(var(--index)*0.6)] rounded-[calc(var(--index)*0.5)] font-bold text-white dark:text-black text-[calc(var(--index)*0.6)] transition-all flex justify-center items-center gap-3 shadow-lg bg-gradient-to-r from-[#4C5A7A] to-[#3b465e] dark:from-white dark:to-gray-200 hover:shadow-xl"
                  >
                    {employee ? 'Сохранить изменения' : 'Внести сотрудника в базу'}
                  </motion.button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
export default EmployeeModal;