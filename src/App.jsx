import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { ProfileSelector } from './components/Profile/ProfileSelector';
import { PinGateModal } from './components/Security/PinGateModal';

// Kid Components
import { KidDashboard } from './components/Kid/KidDashboard';
import { KidRewardStore } from './components/Kid/KidRewardStore';
import { KidCalendarAchievements } from './components/Kid/KidCalendarAchievements';

// Parent Components
import { ParentDashboard } from './components/Parent/ParentDashboard';
import { ChildDailyControlView } from './components/Parent/ChildDailyControlView';
import { ApprovalsHub } from './components/Parent/ApprovalsHub';
import { MasterLibrary } from './components/Parent/MasterLibrary';
import { ParentCalendarAudit } from './components/Calendar/ParentCalendarAudit';
import { RewardManager } from './components/Parent/RewardManager';
import { HouseholdSettings } from './components/Parent/HouseholdSettings';

// Modals
import { QuickPointsModal } from './components/Parent/QuickPointsModal';
import { RewardLockModal } from './components/Parent/RewardLockModal';
import { DuplicateDetectionModal } from './components/Parent/DuplicateDetectionModal';
import { TaskMasterModal } from './components/Parent/TaskMasterModal';
import { RoutineMasterModal } from './components/Parent/RoutineMasterModal';
import { QuickTaskModal } from './components/Parent/QuickTaskModal';
import { InjectRoutineModal } from './components/Parent/InjectRoutineModal';
import { AssignMasterTaskModal } from './components/Parent/AssignMasterTaskModal';
import { AddChildModal } from './components/Parent/AddChildModal';
import { AddTutorModal } from './components/Parent/AddTutorModal';
import { RewardEditorModal } from './components/Parent/RewardEditorModal';

// Icons
import {
  CheckSquare,
  Gift,
  Calendar,
  Home,
  Users,
  Clock,
  BookOpen,
  Settings,
  Sparkles,
  Lock,
  ArrowLeft
} from 'lucide-react';

export const App = () => {
  const {
    activeRole,
    activeKidTab,
    setActiveKidTab,
    activeParentTab,
    setActiveParentTab,
    activeChild,
    controlChild,
    data,
    logoutToProfileSelect,
    injectRoutine,
    assignMasterTaskToChild,
    addQuickTaskToChildDay
  } = useApp();

  // Global Modals State
  const [isQuickPointsOpen, setIsQuickPointsOpen] = useState(false);
  const [quickPointsIsBonus, setQuickPointsIsBonus] = useState(true);
  const [isRewardLockOpen, setIsRewardLockOpen] = useState(false);
  const [lockTargetReward, setLockTargetReward] = useState(null);

  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [duplicateContext, setDuplicateContext] = useState({ childId: null, routineId: null, duplicates: [] });

  const [isTaskMasterOpen, setIsTaskMasterOpen] = useState(false);
  const [isRoutineMasterOpen, setIsRoutineMasterOpen] = useState(false);
  const [isQuickTaskOpen, setIsQuickTaskOpen] = useState(false);
  const [quickTaskChildId, setQuickTaskChildId] = useState(null);

  const [isInjectRoutineOpen, setIsInjectRoutineOpen] = useState(false);
  const [injectRoutineChildId, setInjectRoutineChildId] = useState(null);
  const [injectRoutineId, setInjectRoutineId] = useState(null);

  const [isAssignMasterOpen, setIsAssignMasterOpen] = useState(false);
  const [assignMasterTask, setAssignMasterTask] = useState(null);
  const [assignMasterChildId, setAssignMasterChildId] = useState(null);

  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [isAddTutorOpen, setIsAddTutorOpen] = useState(false);
  const [isRewardEditorOpen, setIsRewardEditorOpen] = useState(false);

  // Pending counts for badges
  const pendingApprovalsCount = data.todayAssignments.filter(a => a.status === 'requested').length +
    (data.pendingRedemptions || []).length;

  // Render Screen 14 (Welcome / Profile Select)
  if (activeRole === 'profile_select') {
    return (
      <>
        <ProfileSelector />
        <PinGateModal />
      </>
    );
  }

  // ----------------------------------------------------
  // RENDER MODO NIÑOS (Screens 11, 12, 13)
  // ----------------------------------------------------
  if (activeRole === 'kid') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
        
        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6">
          {activeKidTab === 'kid_home' && <KidDashboard />}
          {activeKidTab === 'kid_store' && <KidRewardStore />}
          {activeKidTab === 'kid_calendar' && <KidCalendarAchievements />}
        </main>

        {/* Floating Bottom Bar (Kid Navigation) */}
        <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-white/95 backdrop-blur-md rounded-squircle-lg border-3 border-amber-200 shadow-2xl p-1.5 flex justify-around items-center z-40">
          <button
            onClick={() => setActiveKidTab('kid_home')}
            className={`flex-1 py-2 px-3 rounded-squircle-sm font-extrabold text-xs flex flex-col items-center gap-1 transition ${
              activeKidTab === 'kid_home'
                ? 'bg-amber-400 text-amber-950 shadow-sm scale-105'
                : 'text-slate-500 hover:text-amber-700'
            }`}
          >
            <CheckSquare size={20} />
            <span>Mis Tareas</span>
          </button>

          <button
            onClick={() => setActiveKidTab('kid_store')}
            className={`flex-1 py-2 px-3 rounded-squircle-sm font-extrabold text-xs flex flex-col items-center gap-1 transition ${
              activeKidTab === 'kid_store'
                ? 'bg-amber-400 text-amber-950 shadow-sm scale-105'
                : 'text-slate-500 hover:text-amber-700'
            }`}
          >
            <Gift size={20} />
            <span>Premios 🎁</span>
          </button>

          <button
            onClick={() => setActiveKidTab('kid_calendar')}
            className={`flex-1 py-2 px-3 rounded-squircle-sm font-extrabold text-xs flex flex-col items-center gap-1 transition ${
              activeKidTab === 'kid_calendar'
                ? 'bg-amber-400 text-amber-950 shadow-sm scale-105'
                : 'text-slate-500 hover:text-amber-700'
            }`}
          >
            <Calendar size={20} />
            <span>Logros ⭐</span>
          </button>
        </nav>

        <PinGateModal />
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER MODO PADRES (Screens 01, 02, 03, 04, 05, 06, 09)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between">
      
      {/* Top Bar for Parents */}
      <header className="bg-[#1E3A5F] text-white px-4 py-3 shadow-md sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={logoutToProfileSelect}
              className="p-1.5 rounded-squircle-sm bg-white/10 hover:bg-white/20 text-white transition"
              title="Volver a Selección de Perfil"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <span className="text-[10px] font-bold text-[#88D1F1] tracking-wider uppercase block">
                KidsTaskApp 🛡️ Modo Padres
              </span>
              <span className="font-extrabold text-sm text-white">
                {data.family.name}
              </span>
            </div>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveParentTab('parent_dash')}
              className={`px-3 py-1 text-xs font-bold rounded-squircle-sm transition ${
                activeParentTab === 'parent_dash' ? 'bg-[#88D1F1] text-[#1E3A5F]' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              360°
            </button>
            <button
              onClick={() => setActiveParentTab('child_control')}
              className={`px-3 py-1 text-xs font-bold rounded-squircle-sm transition ${
                activeParentTab === 'child_control' ? 'bg-[#88D1F1] text-[#1E3A5F]' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              Día a Día
            </button>
            <button
              onClick={() => setActiveParentTab('approvals')}
              className={`relative px-3 py-1 text-xs font-bold rounded-squircle-sm transition ${
                activeParentTab === 'approvals' ? 'bg-[#88D1F1] text-[#1E3A5F]' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              Aprobaciones
              {pendingApprovalsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-amber-950 text-[10px] font-extrabold flex items-center justify-center animate-bounce">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-3xl w-full mx-auto">
        {activeParentTab === 'parent_dash' && (
          <ParentDashboard
            onOpenQuickPoints={(isBonus) => {
              setQuickPointsIsBonus(isBonus);
              setIsQuickPointsOpen(true);
            }}
            onOpenRewardLock={() => {
              setLockTargetReward(data.rewards[0]);
              setIsRewardLockOpen(true);
            }}
          />
        )}

        {activeParentTab === 'child_control' && (
          <ChildDailyControlView
            onOpenQuickTask={(childId) => {
              setQuickTaskChildId(childId);
              setIsQuickTaskOpen(true);
            }}
            onOpenInjectRoutine={(childId) => {
              setInjectRoutineChildId(childId);
              setInjectRoutineId(null);
              setIsInjectRoutineOpen(true);
            }}
            onOpenAssignMaster={(childId) => {
              setAssignMasterChildId(childId);
              setAssignMasterTask(data.masterTasks[0]);
              setIsAssignMasterOpen(true);
            }}
          />
        )}

        {activeParentTab === 'approvals' && <ApprovalsHub />}

        {activeParentTab === 'library' && (
          <MasterLibrary
            onOpenCreateTask={() => setIsTaskMasterOpen(true)}
            onOpenCreateRoutine={() => setIsRoutineMasterOpen(true)}
            onAssignTaskToChild={(task) => {
              setAssignMasterTask(task);
              setAssignMasterChildId(controlChild.id);
              setIsAssignMasterOpen(true);
            }}
            onInjectRoutineToChild={(routine) => {
              setInjectRoutineChildId(controlChild.id);
              setInjectRoutineId(routine.id);
              setIsInjectRoutineOpen(true);
            }}
          />
        )}

        {activeParentTab === 'calendar' && <ParentCalendarAudit />}

        {activeParentTab === 'rewards' && (
          <RewardManager
            onOpenCreateReward={() => setIsRewardEditorOpen(true)}
            onOpenLockModal={(reward) => {
              setLockTargetReward(reward);
              setIsRewardLockOpen(true);
            }}
          />
        )}

        {activeParentTab === 'settings' && (
          <HouseholdSettings
            onOpenAddChild={() => setIsAddChildOpen(true)}
            onOpenAddTutor={() => setIsAddTutorOpen(true)}
          />
        )}
      </main>

      {/* Fixed Bottom Bar (Parent Navigation) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 shadow-lg px-2 py-1.5 z-40">
        <div className="max-w-2xl mx-auto flex justify-between items-center text-[10px] font-extrabold text-slate-500">
          
          <button
            onClick={() => setActiveParentTab('parent_dash')}
            className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 rounded transition ${
              activeParentTab === 'parent_dash' ? 'text-[#1E3A5F] font-black' : 'hover:text-slate-800'
            }`}
          >
            <Home size={18} className={activeParentTab === 'parent_dash' ? 'text-[#4A90E2]' : ''} />
            <span>Inicio 360°</span>
          </button>

          <button
            onClick={() => setActiveParentTab('child_control')}
            className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 rounded transition ${
              activeParentTab === 'child_control' ? 'text-[#1E3A5F] font-black' : 'hover:text-slate-800'
            }`}
          >
            <Users size={18} className={activeParentTab === 'child_control' ? 'text-[#4A90E2]' : ''} />
            <span>Día a Día</span>
          </button>

          <button
            onClick={() => setActiveParentTab('approvals')}
            className={`flex-1 py-1.5 relative flex flex-col items-center gap-0.5 rounded transition ${
              activeParentTab === 'approvals' ? 'text-[#1E3A5F] font-black' : 'hover:text-slate-800'
            }`}
          >
            <Clock size={18} className={activeParentTab === 'approvals' ? 'text-[#4A90E2]' : ''} />
            <span>Aprobaciones</span>
            {pendingApprovalsCount > 0 && (
              <span className="absolute top-0 right-4 w-4 h-4 rounded-full bg-amber-400 text-amber-950 text-[9px] font-extrabold flex items-center justify-center">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveParentTab('library')}
            className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 rounded transition ${
              activeParentTab === 'library' ? 'text-[#1E3A5F] font-black' : 'hover:text-slate-800'
            }`}
          >
            <BookOpen size={18} className={activeParentTab === 'library' ? 'text-[#4A90E2]' : ''} />
            <span>Biblioteca</span>
          </button>

          <button
            onClick={() => setActiveParentTab('calendar')}
            className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 rounded transition ${
              activeParentTab === 'calendar' ? 'text-[#1E3A5F] font-black' : 'hover:text-slate-800'
            }`}
          >
            <Calendar size={18} className={activeParentTab === 'calendar' ? 'text-[#4A90E2]' : ''} />
            <span>Calendario</span>
          </button>

          <button
            onClick={() => setActiveParentTab('rewards')}
            className={`flex-1 py-1.5 flex flex-col items-center gap-0.5 rounded transition ${
              activeParentTab === 'rewards' ? 'text-[#1E3A5F] font-black' : 'hover:text-slate-800'
            }`}
          >
            <Gift size={18} className={activeParentTab === 'rewards' ? 'text-[#4A90E2]' : ''} />
            <span>Premios</span>
          </button>

        </div>
      </nav>

      {/* ALL OVERLAY MODALS */}
      <PinGateModal />

      <QuickPointsModal
        isOpen={isQuickPointsOpen}
        onClose={() => setIsQuickPointsOpen(false)}
        initialIsBonus={quickPointsIsBonus}
      />

      <RewardLockModal
        isOpen={isRewardLockOpen}
        onClose={() => setIsRewardLockOpen(false)}
        targetReward={lockTargetReward}
      />

      <DuplicateDetectionModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        duplicates={duplicateContext.duplicates}
        onConfirmOmit={() => {
          if (duplicateContext.isSingleTask) {
            // Do not inject to today, but keep assignment rule if not today-only
            if (duplicateContext.scheduleType && duplicateContext.scheduleType !== 'today') {
              assignMasterTaskToChild(duplicateContext.childId, duplicateContext.taskId, duplicateContext.scheduleType, duplicateContext.scheduleDetails);
            }
          } else {
            injectRoutine(duplicateContext.childId, duplicateContext.routineId, false);
          }
          setIsDuplicateModalOpen(false);
        }}
        onConfirmAllowAll={() => {
          if (duplicateContext.isSingleTask) {
            const masterTask = data.masterTasks.find(mt => mt.id === duplicateContext.taskId);
            if (masterTask) {
              addQuickTaskToChildDay(duplicateContext.childId, {
                title: masterTask.title,
                points: masterTask.defaultPoints,
                approvalMode: masterTask.defaultApprovalMode,
                iconSvg: masterTask.iconSvg,
                note: masterTask.description,
                masterTaskId: masterTask.id
              });
            }
          } else {
            injectRoutine(duplicateContext.childId, duplicateContext.routineId, true);
          }
          setIsDuplicateModalOpen(false);
        }}
      />

      <TaskMasterModal
        isOpen={isTaskMasterOpen}
        onClose={() => setIsTaskMasterOpen(false)}
      />

      <RoutineMasterModal
        isOpen={isRoutineMasterOpen}
        onClose={() => setIsRoutineMasterOpen(false)}
      />

      <QuickTaskModal
        isOpen={isQuickTaskOpen}
        onClose={() => setIsQuickTaskOpen(false)}
        childId={quickTaskChildId || controlChild.id}
      />

      <InjectRoutineModal
        isOpen={isInjectRoutineOpen}
        onClose={() => setIsInjectRoutineOpen(false)}
        targetChildId={injectRoutineChildId || controlChild.id}
        initialRoutineId={injectRoutineId}
        onTriggerDuplicateModal={(childId, routineId, dups) => {
          setDuplicateContext({ childId, routineId, duplicates: dups });
          setIsDuplicateModalOpen(true);
        }}
      />

      <AssignMasterTaskModal
        isOpen={isAssignMasterOpen}
        onClose={() => setIsAssignMasterOpen(false)}
        targetTask={assignMasterTask}
        targetChildId={assignMasterChildId || controlChild.id}
        onTriggerDuplicateModal={(childId, task, scheduleType, details) => {
          setDuplicateContext({
            childId,
            taskId: task.id,
            isSingleTask: true,
            scheduleType,
            scheduleDetails: details,
            duplicates: [{ title: task.title, points: task.defaultPoints }]
          });
          setIsDuplicateModalOpen(true);
        }}
      />

      <AddChildModal
        isOpen={isAddChildOpen}
        onClose={() => setIsAddChildOpen(false)}
      />

      <AddTutorModal
        isOpen={isAddTutorOpen}
        onClose={() => setIsAddTutorOpen(false)}
      />

      <RewardEditorModal
        isOpen={isRewardEditorOpen}
        onClose={() => setIsRewardEditorOpen(false)}
      />

    </div>
  );
};
