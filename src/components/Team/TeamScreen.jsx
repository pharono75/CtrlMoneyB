import React, { useState, useEffect } from 'react';
import EmployeeModal from './Modals/EmployeeModal';
import TeamStats from './TeamStats';
import TeamList from './TeamList';

const TeamScreen = () => {
  const [list, setList] = useState([]);
  const [departments, setDepartments] = useState(['Руководство', 'Финансы', 'Продажи', 'Маркетинг', 'HR']);
  const [loading, setLoading] = useState(true);
  
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'create', employee: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('Все');

  useEffect(() => {
    const savedEmployees = localStorage.getItem('ctrlmoney_employees');
    const savedDepts = localStorage.getItem('ctrlmoney_departments');
    if (savedDepts) setDepartments(JSON.parse(savedDepts));
    
    if (savedEmployees) {
      setList(JSON.parse(savedEmployees));
    } else {
      setList([
        { id: '1', firstName: 'Иван', lastName: 'Иванов', patronymic: 'Иванович', position: 'Генеральный директор', department: 'Руководство', email: 'ivanov@company.ru', phone: '+7 (999) 123-45-67', salary: 150000 },
      ]);
    }
    setLoading(false);
  }, []);

  const handleOpenAdd = () => setModalState({ isOpen: true, mode: 'create', employee: null });
  const handleOpenView = (emp) => setModalState({ isOpen: true, mode: 'view', employee: emp });

  const handleSaveEmployee = (formData, id) => {
    let updatedList = [...list];
    if (id) {
      updatedList = updatedList.map(emp => emp.id === id ? { ...emp, ...formData } : emp);
    } else {
      updatedList.push({ id: Date.now().toString(), ...formData });
    }
    setList(updatedList);
    localStorage.setItem('ctrlmoney_employees', JSON.stringify(updatedList));
    setModalState({ isOpen: false, mode: 'create', employee: null });
  };

  const handleDelete = (id) => {
    const updatedList = list.filter(emp => emp.id !== id);
    setList(updatedList);
    localStorage.setItem('ctrlmoney_employees', JSON.stringify(updatedList));
    setModalState({ isOpen: false, mode: 'create', employee: null });
  };

  return (
    <div className="flex-1 grid grid-cols-12 gap-6 h-full overflow-hidden">
      
      {/* ЛЕВАЯ ПАНЕЛЬ (Статистика) - совпадает с Dashboard */}
      <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        <TeamStats list={list} departments={departments} onOpenAdd={handleOpenAdd} />
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ (Список) */}
      <div className="col-span-12 lg:col-span-8 xl:col-span-9 bg-white/60 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/80 p-[calc(var(--index)*1)] shadow-sm flex flex-col overflow-hidden">
        <TeamList 
          list={list} 
          loading={loading}
          departments={departments}
          searchQuery={searchQuery}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          onOpenView={handleOpenView}
        />
      </div>

      <EmployeeModal 
        isOpen={modalState.isOpen} 
        mode={modalState.mode}
        employee={modalState.employee}
        departments={departments}
        onClose={() => setModalState({ isOpen: false, mode: 'create', employee: null })} 
        onSubmit={handleSaveEmployee} 
        onDelete={handleDelete}
        onAddDepartment={(newD) => setDepartments([...departments, newD])}
      />
    </div>
  );
};

export default TeamScreen;