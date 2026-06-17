import React, { useState, useEffect } from 'react';
import EmployeeModal from './Modals/EmployeeModal';
import TeamStats from './TeamStats';
import TeamList from './TeamList';
// ДОБАВИЛИ ИМПОРТ updateTeamMember
import { fetchTeam, createTeamMember, updateTeamMember, deleteTeamMember } from '../../api/teamApi';

const TeamScreen = () => {
  const [list, setList] = useState([]);
  const [departments, setDepartments] = useState(['Руководство', 'Финансы', 'Продажи', 'Маркетинг', 'HR']);
  const [loading, setLoading] = useState(true);
  
  const [modalState, setModalState] = useState({ isOpen: false, mode: 'create', employee: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('Все');

  useEffect(() => {
    const savedDepts = localStorage.getItem('ctrlmoney_departments');
    if (savedDepts) setDepartments(JSON.parse(savedDepts));
    
    const loadTeamData = async () => {
      try {
        const data = await fetchTeam();
        setList(data);
      } catch (error) {
        console.error('Ошибка при загрузке команды:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, []);

  const handleOpenAdd = () => setModalState({ isOpen: true, mode: 'create', employee: null });
  const handleOpenView = (emp) => setModalState({ isOpen: true, mode: 'view', employee: emp });

  const handleSaveEmployee = async (formData, id) => {
    try {
      if (id) {
        // ТЕПЕРЬ ОТПРАВЛЯЕМ ИЗМЕНЕНИЯ НА СЕРВЕР
        await updateTeamMember(id, formData);
        setList(list.map(emp => emp.id === id ? { ...emp, ...formData } : emp));
      } else {
        const newEmployee = await createTeamMember(formData);
        setList(prev => [...prev, newEmployee]);
      }
      setModalState({ isOpen: false, mode: 'create', employee: null });
    } catch (error) {
      console.error('Ошибка при сохранении сотрудника:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTeamMember(id);
      setList(list.filter(emp => emp.id !== id));
      setModalState({ isOpen: false, mode: 'create', employee: null });
    } catch (error) {
      console.error('Ошибка при удалении сотрудника:', error);
    }
  };

  const handleAddDepartment = (newD) => {
    const updatedDepts = [...departments, newD];
    setDepartments(updatedDepts);
    localStorage.setItem('ctrlmoney_departments', JSON.stringify(updatedDepts));
  };

  return (
    <div className="flex-1 grid grid-cols-12 gap-6 h-full overflow-hidden">
      <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        <TeamStats list={list} departments={departments} onOpenAdd={handleOpenAdd} />
      </div>

      <div className="col-span-12 lg:col-span-8 xl:col-span-9 bg-white/60 dark:bg-black/60 backdrop-blur-xl rounded-[calc(var(--index)*0.8)] border border-white/80 dark:border-white/10 p-[calc(var(--index)*1)] shadow-sm flex flex-col overflow-hidden">
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
        onAddDepartment={handleAddDepartment}
      />
    </div>
  );
};

export default TeamScreen;