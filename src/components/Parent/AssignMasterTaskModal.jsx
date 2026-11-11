import React, { useState, useEffect } from 'react';
import { Modal } from '../Common/Modal';
import { ChunkyButton } from '../Common/ChunkyButton';
import { useApp } from '../../context/AppContext';
import { Calendar, Check } from 'lucide-react';

export const AssignMasterTaskModal = ({ isOpen, onClose, targetTask = null, targetChildId, onTriggerDuplicateModal }) => {
  const { data, assignMasterTaskToChild, checkDuplicateForMasterTask } = useApp();
  const [selectedTaskId, setSelectedTaskId] = useState(targetTask?.id || data.masterTasks[0]?.id || '');
  const [selectedChildId, setSelectedChildId] = useState(targetChildId || data.children[0]?.id || 'child-mateo');
  const [scheduleType, setScheduleType] = useState('today'); // 'today' | 'daily' | 'weekly' | 'specific_date' | 'date_range'
  
  // Weekly selection
  const [selectedDays, setSelectedDays] = useState([]);
  // Date and Range selection
  const [specificDate, setSpecificDate] = useState('2026-08-30');
  const [startDate, setStartDate] = useState('2026-08-30');
  const [endDate, setEndDate] = useState('2026-09-05');

  useEffect(() => {
    if (targetTask?.id) setSelectedTaskId(targetTask.id);
    if (targetChildId) setSelectedChildId(targetChildId);
    setScheduleType('today');
    setSelectedDays([]);
  }, [targetTask, targetChildId, isOpen]);

  if (!isOpen) return null;

  const currentTask = targetTask || data.masterTasks.find(m => m.id === selectedTaskId) || data.masterTasks[0];
  const child = data.children.find(c => c.id === selectedChildId) || data.children[0];

  const daysList = [
    { key: 'Lunes', label: 'L', name: 'Lunes' },
    { key: 'Martes', label: 'M', name: 'Martes' },
    { key: 'Miércoles', label: 'X', name: 'Miércoles' },
    { key: 'Jueves', label: 'J', name: 'Jueves' },
    { key: 'Viernes', label: 'V', name: 'Viernes' },
    { key: 'Sábado', label: 'S', name: 'Sábado' },
    { key: 'Domingo', label: 'D', name: 'Domingo' }
  ];

  const toggleDay = (dayName) => {
    setSelectedDays(prev => 
      prev.includes(dayName) ? prev.filter(d => d !== dayName) : [...prev, dayName]
    );
  };

  const handleAssign = () => {
    let details = '';
    if (scheduleType === 'weekly') {
      details = selectedDays.join(' y ');
    } else if (scheduleType === 'specific_date') {
      details = specificDate;
    } else if (scheduleType === 'date_range') {
      details = `${startDate} al ${endDate}`;
    }

    const willApplyToday = scheduleType === 'today' || scheduleType === 'daily';
    const isDuplicate = checkDuplicateForMasterTask ? checkDuplicateForMasterTask(selectedChildId, currentTask.id) : false;

    if (willApplyToday && isDuplicate && onTriggerDuplicateModal) {
      onClose();
      onTriggerDuplicateModal(selectedChildId, currentTask, scheduleType, details);
      return;
    }

    assignMasterTaskToChild(selectedChildId, currentTask.id, scheduleType, details);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🚀 Asignar Tarea desde Biblioteca"
      subtitle={`Configura la asignación de ${currentTask?.title} para ${child?.name}`}
    >
      <div className="space-y-4">
        
        {/* Task info summary */}
        <div className="p-3 rounded-squircle-sm bg-sky-50 border border-sky-200 flex items-center gap-3">
          <span className="text-3xl">{currentTask?.iconSvg}</span>
          <div>
            <h4 className="font-extrabold text-sm text-[#1E3A5F]">{currentTask?.title}</h4>
            <span className="font-bold text-xs text-amber-700">⭐ +{currentTask?.defaultPoints} pts</span>
          </div>
        </div>

        {/* Child selector */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1.5 uppercase">
            Asignar a:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {data.children.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedChildId(c.id)}
                className={`p-2.5 rounded-squircle-sm border-2 font-bold text-xs flex items-center justify-center gap-2 transition ${
                  selectedChildId === c.id
                    ? 'border-[#1E3A5F] bg-[#1E3A5F] text-white'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <span>{c.avatar}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Programación Temporal (5 Modalidades [REQ-LIB-005]) */}
        <div>
          <label className="block text-xs font-extrabold text-[#1E3A5F] mb-1.5 uppercase">
            Modalidad de Programación:
          </label>
          <div className="space-y-1.5">
            {[
              { id: 'today', title: '🔘 Para el Día Actual (Hoy)', desc: 'Se inyecta de inmediato a la lista de hoy' },
              { id: 'daily', title: '⚪ Diaria Continua', desc: 'Aparece todos los días recurrentemente' },
              { id: 'weekly', title: '⚪ Semanal / Días Fijos', desc: 'Días seleccionados de cada semana' },
              { id: 'specific_date', title: '⚪ Fecha Específica', desc: 'Para un evento puntual o día futuro' },
              { id: 'date_range', title: '⚪ Rango de Fechas / Período', desc: 'Válido entre dos fechas determinadas' }
            ].map(opt => (
              <div key={opt.id} className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setScheduleType(opt.id)}
                  className={`w-full p-2.5 rounded-squircle-sm border-2 text-left transition flex items-center justify-between ${
                    scheduleType === opt.id
                      ? 'border-sky-400 bg-sky-50 text-sky-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-xs block font-bold">{opt.title}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{opt.desc}</span>
                  </div>
                  {scheduleType === opt.id && <Check size={16} className="text-sky-600" />}
                </button>

                {/* Subopciones para Semanal */}
                {scheduleType === 'weekly' && opt.id === 'weekly' && (
                  <div className="p-3 bg-white rounded-squircle-sm border border-sky-200 ml-2 space-y-2">
                    <span className="text-[11px] font-bold text-slate-600 block">Elige los días de la semana:</span>
                    <div className="flex gap-1.5">
                      {daysList.map(d => {
                        const isSelected = selectedDays.includes(d.name);
                        return (
                          <button
                            key={d.key}
                            type="button"
                            onClick={() => toggleDay(d.name)}
                            className={`w-8 h-8 rounded-full text-xs font-bold transition flex items-center justify-center border-2 ${
                              isSelected
                                ? 'bg-sky-500 border-sky-600 text-white shadow-sm'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                            title={d.name}
                          >
                            {d.label}
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-[11px] font-bold text-sky-700 block">
                      Seleccionados: {selectedDays.length ? selectedDays.join(', ') : 'Ninguno'}
                    </span>
                  </div>
                )}

                {/* Subopciones para Fecha Específica */}
                {scheduleType === 'specific_date' && opt.id === 'specific_date' && (
                  <div className="p-3 bg-white rounded-squircle-sm border border-sky-200 ml-2">
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Fecha programada:</label>
                    <input
                      type="date"
                      value={specificDate}
                      onChange={(e) => setSpecificDate(e.target.value)}
                      className="p-2 text-xs font-bold rounded border border-slate-300"
                    />
                  </div>
                )}

                {/* Subopciones para Rango de Fechas */}
                {scheduleType === 'date_range' && opt.id === 'date_range' && (
                  <div className="p-3 bg-white rounded-squircle-sm border border-sky-200 ml-2 flex items-center gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block">Desde:</span>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="p-1.5 text-xs font-bold rounded border border-slate-300"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block">Hasta:</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="p-1.5 text-xs font-bold rounded border border-slate-300"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-squircle-sm text-xs font-bold text-slate-500 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <ChunkyButton
            variant="sky"
            size="sm"
            onClick={handleAssign}
            className="text-xs font-bold"
          >
            Confirmar Asignación
          </ChunkyButton>
        </div>
      </div>
    </Modal>
  );
};
