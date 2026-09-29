import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_DATA } from '../data/initialData';

const AppContext = createContext();

const STORAGE_KEY = 'kidstaskapp_state_v1';

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) return JSON.parse(local);
    } catch (e) {
      console.warn('Failed reading localStorage, using initial seed data', e);
    }
    return INITIAL_DATA;
  });

  // Navigation & Role State
  const [activeRole, setActiveRole] = useState('profile_select'); // 'profile_select' | 'kid' | 'parent'
  const [activeChildId, setActiveChildId] = useState('child-mateo');
  const [activeParentTab, setActiveParentTab] = useState('parent_dash'); // 'parent_dash' | 'child_control' | 'approvals' | 'library' | 'calendar' | 'rewards' | 'settings'
  const [activeKidTab, setActiveKidTab] = useState('kid_home'); // 'kid_home' | 'kid_store' | 'kid_calendar'
  
  // Modals & Overlays
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinCallbackTarget, setPinCallbackTarget] = useState(null); // 'parent' or other action
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('2026-08-25');
  const [activeChildControlId, setActiveChildControlId] = useState('child-mateo');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving state', e);
    }
  }, [data]);

  // Helper getters
  const activeChild = data.children.find(c => c.id === activeChildId) || data.children[0];
  const controlChild = data.children.find(c => c.id === activeChildControlId) || data.children[0];
  const activeTutor = data.tutors.find(t => t.id === data.family.activeTutorId) || data.tutors[0];

  // Helper trigger Confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Switch to Kid Profile
  const selectKidProfile = (childId) => {
    setActiveChildId(childId);
    setActiveChildControlId(childId);
    setActiveRole('kid');
    setActiveKidTab('kid_home');
  };

  // Request PIN to enter Parent Mode
  const openParentGate = (targetTab = 'parent_dash') => {
    setPinCallbackTarget(targetTab);
    setIsPinModalOpen(true);
  };

  const verifyPin = (enteredPin) => {
    if (enteredPin === data.family.masterPin) {
      setIsPinModalOpen(false);
      setActiveRole('parent');
      if (pinCallbackTarget) {
        setActiveParentTab(pinCallbackTarget);
      }
      return true;
    }
    return false;
  };

  const logoutToProfileSelect = () => {
    setActiveRole('profile_select');
  };

  // ----------------------------------------------------
  // TASK ASSIGNMENTS & REORDERING
  // ----------------------------------------------------

  // Child marks "¡Ya la hice! 🚀"
  const markTaskAsRequestedByKid = (assignmentId) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setData(prev => ({
      ...prev,
      todayAssignments: prev.todayAssignments.map(asg => {
        if (asg.id === assignmentId) {
          return {
            ...asg,
            status: 'requested',
            completedAt: timeStr
          };
        }
        return asg;
      })
    }));

    triggerConfetti();
  };

  // Parent approves single task
  const approveTask = (assignmentId) => {
    let taskPoints = 0;
    let targetChildId = null;

    setData(prev => {
      const task = prev.todayAssignments.find(a => a.id === assignmentId);
      if (!task) return prev;
      taskPoints = task.points;
      targetChildId = task.childId;

      const updatedAssignments = prev.todayAssignments.map(asg => {
        if (asg.id === assignmentId) {
          return {
            ...asg,
            status: 'approved',
            approvedBy: activeTutor.name
          };
        }
        return asg;
      });

      const updatedChildren = prev.children.map(c => {
        if (c.id === targetChildId) {
          return { ...c, currentPoints: c.currentPoints + taskPoints };
        }
        return c;
      });

      return {
        ...prev,
        todayAssignments: updatedAssignments,
        children: updatedChildren
      };
    });

    triggerConfetti();
  };

  // Parent rejects single task
  const rejectTask = (assignmentId) => {
    setData(prev => ({
      ...prev,
      todayAssignments: prev.todayAssignments.map(asg => {
        if (asg.id === assignmentId) {
          return { ...asg, status: 'pending' };
        }
        return asg;
      })
    }));
  };

  // Parent direct toggle (check/uncheck on ChildDailyControlView)
  const toggleTaskDirectly = (assignmentId) => {
    setData(prev => {
      const task = prev.todayAssignments.find(a => a.id === assignmentId);
      if (!task) return prev;

      const isApproved = task.status === 'approved';
      const pointsDiff = isApproved ? -task.points : task.points;
      const newStatus = isApproved ? 'pending' : 'approved';

      const updatedAssignments = prev.todayAssignments.map(asg => {
        if (asg.id === assignmentId) {
          return {
            ...asg,
            status: newStatus,
            approvedBy: isApproved ? null : activeTutor.name,
            completedAt: isApproved ? null : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
        return asg;
      });

      const updatedChildren = prev.children.map(c => {
        if (c.id === task.childId) {
          return { ...c, currentPoints: Math.max(0, c.currentPoints + pointsDiff) };
        }
        return c;
      });

      return {
        ...prev,
        todayAssignments: updatedAssignments,
        children: updatedChildren
      };
    });
  };

  // Approve all pending tasks
  const approveAllPendingTasks = () => {
    setData(prev => {
      let pointsToAddByChild = {};

      const updatedAssignments = prev.todayAssignments.map(asg => {
        if (asg.status === 'requested') {
          pointsToAddByChild[asg.childId] = (pointsToAddByChild[asg.childId] || 0) + asg.points;
          return {
            ...asg,
            status: 'approved',
            approvedBy: activeTutor.name
          };
        }
        return asg;
      });

      const updatedChildren = prev.children.map(c => {
        const add = pointsToAddByChild[c.id] || 0;
        return { ...c, currentPoints: c.currentPoints + add };
      });

      return {
        ...prev,
        todayAssignments: updatedAssignments,
        children: updatedChildren
      };
    });

    triggerConfetti();
  };

  // Reorder task within child's day (drag or arrow buttons)
  const moveTaskOrder = (assignmentId, direction) => {
    setData(prev => {
      const childTasks = prev.todayAssignments
        .filter(a => a.childId === activeChildControlId)
        .sort((a, b) => a.orderIndex - b.orderIndex);

      const index = childTasks.findIndex(a => a.id === assignmentId);
      if (index < 0) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= childTasks.length) return prev;

      // Swap orderIndex
      const tempOrder = childTasks[index].orderIndex;
      childTasks[index].orderIndex = childTasks[targetIndex].orderIndex;
      childTasks[targetIndex].orderIndex = tempOrder;

      const updatedAssignments = prev.todayAssignments.map(asg => {
        const matched = childTasks.find(ct => ct.id === asg.id);
        return matched ? { ...asg, orderIndex: matched.orderIndex } : asg;
      });

      return {
        ...prev,
        todayAssignments: updatedAssignments
      };
    });
  };

  // Delete task from child's day
  const removeTaskFromDay = (assignmentId) => {
    setData(prev => ({
      ...prev,
      todayAssignments: prev.todayAssignments.filter(a => a.id !== assignmentId)
    }));
  };

  // Add a quick one-off task directly to child's day
  const addQuickTaskToChildDay = (childId, taskData) => {
    setData(prev => {
      const childTasks = prev.todayAssignments.filter(a => a.childId === childId);
      const nextOrder = childTasks.length + 1;

      const newTask = {
        id: `asg-${Date.now()}`,
        childId,
        title: taskData.title,
        points: Number(taskData.points) || 20,
        approvalMode: taskData.approvalMode || 'kid_request',
        iconSvg: taskData.iconSvg || '⭐',
        orderIndex: nextOrder,
        status: 'pending',
        note: taskData.note || '',
        completedAt: null
      };

      return {
        ...prev,
        todayAssignments: [...prev.todayAssignments, newTask]
      };
    });
  };

  // ----------------------------------------------------
  // ROUTINE & LIBRARY INJECTION WITH DUPLICATE DETECTION
  // ----------------------------------------------------

  const checkDuplicatesForRoutine = (childId, routineId) => {
    const routine = data.masterRoutines.find(r => r.id === routineId);
    if (!routine) return [];
    
    const existingTitles = data.todayAssignments
      .filter(a => a.childId === childId)
      .map(a => a.title.toLowerCase().trim());

    return routine.tasks.filter(t => existingTitles.includes(t.title.toLowerCase().trim()));
  };

  const injectRoutine = (childId, routineId, allowDuplicates = false) => {
    const routine = data.masterRoutines.find(r => r.id === routineId);
    if (!routine) return;

    setData(prev => {
      const existingTitles = prev.todayAssignments
        .filter(a => a.childId === childId)
        .map(a => a.title.toLowerCase().trim());

      const currentMaxOrder = prev.todayAssignments
        .filter(a => a.childId === childId)
        .reduce((max, a) => Math.max(max, a.orderIndex || 0), 0);

      let addedCount = 0;
      const newAssignments = [];

      routine.tasks.forEach((t, i) => {
        const isDuplicate = existingTitles.includes(t.title.toLowerCase().trim());
        if (isDuplicate && !allowDuplicates) {
          return; // Skip duplicate
        }

        addedCount++;
        newAssignments.push({
          id: `asg-${Date.now()}-${i}`,
          childId,
          title: t.title,
          points: t.points,
          approvalMode: 'kid_request',
          iconSvg: t.iconSvg || '🌟',
          orderIndex: currentMaxOrder + addedCount,
          status: 'pending',
          note: `De rutina: ${routine.title}`,
          completedAt: null
        });
      });

      return {
        ...prev,
        todayAssignments: [...prev.todayAssignments, ...newAssignments]
      };
    });
  };

  // Assign master task directly
  const assignMasterTaskToChild = (childId, masterTaskId, customSchedule = 'today') => {
    const masterTask = data.masterTasks.find(mt => mt.id === masterTaskId);
    if (!masterTask) return;

    addQuickTaskToChildDay(childId, {
      title: masterTask.title,
      points: masterTask.defaultPoints,
      approvalMode: masterTask.defaultApprovalMode,
      iconSvg: masterTask.iconSvg,
      note: masterTask.description
    });
  };

  // Master Tasks CRUD
  const saveMasterTask = (taskData) => {
    setData(prev => {
      if (taskData.id) {
        // Edit
        return {
          ...prev,
          masterTasks: prev.masterTasks.map(mt => mt.id === taskData.id ? { ...mt, ...taskData } : mt)
        };
      } else {
        // New
        const newTask = {
          ...taskData,
          id: `mt-${Date.now()}`,
          defaultPoints: Number(taskData.defaultPoints) || 20,
          defaultApprovalMode: taskData.defaultApprovalMode || 'kid_request',
          iconSvg: taskData.iconSvg || '🎯',
          category: taskData.category || 'Hogar'
        };
        return {
          ...prev,
          masterTasks: [...prev.masterTasks, newTask]
        };
      }
    });
  };

  const deleteMasterTask = (id) => {
    setData(prev => ({
      ...prev,
      masterTasks: prev.masterTasks.filter(mt => mt.id !== id)
    }));
  };

  // Master Routines CRUD
  const saveMasterRoutine = (routineData) => {
    setData(prev => {
      if (routineData.id) {
        return {
          ...prev,
          masterRoutines: prev.masterRoutines.map(r => r.id === routineData.id ? { ...r, ...routineData } : r)
        };
      } else {
        const newRoutine = {
          ...routineData,
          id: `mr-${Date.now()}`,
          icon: routineData.icon || '🚀',
          tasks: routineData.tasks || [],
          assignedChildren: routineData.assignedChildren || ['child-mateo', 'child-sofia'],
          scheduleType: routineData.scheduleType || 'daily'
        };
        return {
          ...prev,
          masterRoutines: [...prev.masterRoutines, newRoutine]
        };
      }
    });
  };

  const deleteMasterRoutine = (id) => {
    setData(prev => ({
      ...prev,
      masterRoutines: prev.masterRoutines.filter(r => r.id !== id)
    }));
  };

  // ----------------------------------------------------
  // REWARDS & REDEMPTIONS & LOCKOUTS
  // ----------------------------------------------------

  // Kid requests reward redemption
  const requestRewardRedemption = (rewardId) => {
    const reward = data.rewards.find(r => r.id === rewardId);
    if (!reward) return;

    if (activeChild.currentPoints < reward.pointsCost) {
      alert(`¡Te faltan ${reward.pointsCost - activeChild.currentPoints} puntos para este premio! 🚀`);
      return;
    }

    const newRedemption = {
      id: `red-${Date.now()}`,
      childId: activeChildId,
      rewardId: reward.id,
      rewardTitle: reward.title,
      pointsCost: reward.pointsCost,
      iconSvg: reward.iconSvg,
      requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };

    setData(prev => ({
      ...prev,
      pendingRedemptions: [...prev.pendingRedemptions, newRedemption]
    }));

    triggerConfetti();
  };

  // Parent authorizes reward redemption
  const authorizeRedemption = (redemptionId) => {
    setData(prev => {
      const red = prev.pendingRedemptions.find(r => r.id === redemptionId);
      if (!red) return prev;

      const updatedRedemptions = prev.pendingRedemptions.filter(r => r.id !== redemptionId);
      const updatedChildren = prev.children.map(c => {
        if (c.id === red.childId) {
          return {
            ...c,
            currentPoints: Math.max(0, c.currentPoints - red.pointsCost)
          };
        }
        return c;
      });

      return {
        ...prev,
        pendingRedemptions: updatedRedemptions,
        children: updatedChildren
      };
    });

    triggerConfetti();
  };

  const denyRedemption = (redemptionId) => {
    setData(prev => ({
      ...prev,
      pendingRedemptions: prev.pendingRedemptions.filter(r => r.id !== redemptionId)
    }));
  };

  // Save / Edit Reward
  const saveReward = (rewardData) => {
    setData(prev => {
      if (rewardData.id) {
        return {
          ...prev,
          rewards: prev.rewards.map(r => r.id === rewardData.id ? { ...r, ...rewardData } : r)
        };
      } else {
        const newReward = {
          ...rewardData,
          id: `rew-${Date.now()}`,
          pointsCost: Number(rewardData.pointsCost) || 100,
          iconSvg: rewardData.iconSvg || '🎁',
          isLocked: false,
          availableFor: rewardData.availableFor || 'all'
        };
        return {
          ...prev,
          rewards: [...prev.rewards, newReward]
        };
      }
    });
  };

  const deleteReward = (id) => {
    setData(prev => ({
      ...prev,
      rewards: prev.rewards.filter(r => r.id !== id)
    }));
  };

  // Lock / Unlock Reward
  const toggleRewardLock = (rewardId, lockConfig = {}) => {
    setData(prev => ({
      ...prev,
      rewards: prev.rewards.map(r => {
        if (r.id === rewardId) {
          const isCurrentlyLocked = r.isLocked;
          return {
            ...r,
            isLocked: !isCurrentlyLocked,
            lockUntil: !isCurrentlyLocked ? lockConfig.lockUntil || '2026-08-28' : null,
            lockReason: !isCurrentlyLocked ? lockConfig.lockReason || 'Restricción parental temporal' : null
          };
        }
        return r;
      })
    }));
  };

  // ----------------------------------------------------
  // CALENDAR AUDIT & RETROACTIVE CORRECTIONS
  // ----------------------------------------------------

  // Modify past validation (toggle between approved and revoked)
  const modifyPastTaskValidation = (dateStr, childId, taskId) => {
    setData(prev => {
      const dayData = prev.calendarHistory[dateStr]?.[childId];
      if (!dayData) return prev;

      let pointChange = 0;
      const updatedTasks = dayData.tasks.map(t => {
        if (t.id === taskId) {
          const isApproved = t.status === 'approved';
          pointChange = isApproved ? -t.points : t.points;
          return {
            ...t,
            status: isApproved ? 'missed' : 'approved',
            isRetroactivelyModified: true,
            approvedBy: isApproved ? null : activeTutor.name
          };
        }
        return t;
      });

      const updatedChild = prev.children.map(c => {
        if (c.id === childId) {
          return { ...c, currentPoints: Math.max(0, c.currentPoints + pointChange) };
        }
        return c;
      });

      return {
        ...prev,
        children: updatedChild,
        calendarHistory: {
          ...prev.calendarHistory,
          [dateStr]: {
            ...prev.calendarHistory[dateStr],
            [childId]: {
              ...dayData,
              tasks: updatedTasks,
              netPoints: dayData.netPoints + pointChange
            }
          }
        }
      };
    });
  };

  // Reversal / Refund of past redemption
  const refundPastRedemption = (dateStr, childId, redemptionId) => {
    setData(prev => {
      const dayData = prev.calendarHistory[dateStr]?.[childId];
      if (!dayData) return prev;

      let refundPoints = 0;
      const updatedRedemptions = (dayData.redemptions || []).map(r => {
        if (r.id === redemptionId) {
          refundPoints = r.pointsCost;
          return { ...r, isRefunded: true };
        }
        return r;
      });

      const updatedChild = prev.children.map(c => {
        if (c.id === childId) {
          return { ...c, currentPoints: c.currentPoints + refundPoints };
        }
        return c;
      });

      return {
        ...prev,
        children: updatedChild,
        calendarHistory: {
          ...prev.calendarHistory,
          [dateStr]: {
            ...prev.calendarHistory[dateStr],
            [childId]: {
              ...dayData,
              redemptions: updatedRedemptions
            }
          }
        }
      };
    });
  };

  // ----------------------------------------------------
  // QUICK POINTS (BONUSES & PENALTIES)
  // ----------------------------------------------------
  const applyQuickPoints = (childId, points, reason, isBonus = true) => {
    const delta = isBonus ? Math.abs(points) : -Math.abs(points);

    setData(prev => {
      const updatedChildren = prev.children.map(c => {
        if (c.id === childId) {
          return { ...c, currentPoints: Math.max(0, c.currentPoints + delta) };
        }
        return c;
      });

      return {
        ...prev,
        children: updatedChildren
      };
    });

    if (isBonus) triggerConfetti();
  };

  // ----------------------------------------------------
  // HOUSEHOLD SETTINGS (CHILDREN, TUTORS, PIN, RULES)
  // ----------------------------------------------------
  const saveChild = (childData) => {
    setData(prev => {
      if (childData.id) {
        return {
          ...prev,
          children: prev.children.map(c => c.id === childData.id ? { ...c, ...childData } : c)
        };
      } else {
        const newChild = {
          ...childData,
          id: `child-${Date.now()}`,
          currentPoints: Number(childData.currentPoints) || 50,
          level: 'Nivel 1 • Principiante',
          avatar: childData.avatar || '⭐',
          colorTheme: childData.colorTheme || '#3B82F6',
          bgColor: '#EFF6FF',
          borderColor: '#BFDBFE'
        };
        return {
          ...prev,
          children: [...prev.children, newChild]
        };
      }
    });
  };

  const deleteChild = (childId) => {
    setData(prev => ({
      ...prev,
      children: prev.children.filter(c => c.id !== childId)
    }));
  };

  const saveTutor = (tutorData) => {
    setData(prev => {
      if (tutorData.id) {
        return {
          ...prev,
          tutors: prev.tutors.map(t => t.id === tutorData.id ? { ...t, ...tutorData } : t)
        };
      } else {
        const newTutor = {
          ...tutorData,
          id: `tutor-${Date.now()}`,
          role: tutorData.role || 'Administrador',
          avatar: tutorData.avatar || '👤'
        };
        return {
          ...prev,
          tutors: [...prev.tutors, newTutor]
        };
      }
    });
  };

  const updateFamilySettings = (newSettings) => {
    setData(prev => ({
      ...prev,
      family: { ...prev.family, ...newSettings }
    }));
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(INITIAL_DATA);
    setActiveRole('profile_select');
  };

  return (
    <AppContext.Provider
      value={{
        data,
        activeRole,
        setActiveRole,
        activeChildId,
        setActiveChildId,
        activeChild,
        controlChild,
        activeChildControlId,
        setActiveChildControlId,
        activeParentTab,
        setActiveParentTab,
        activeKidTab,
        setActiveKidTab,
        activeTutor,
        isPinModalOpen,
        setIsPinModalOpen,
        selectedCalendarDate,
        setSelectedCalendarDate,
        selectKidProfile,
        openParentGate,
        verifyPin,
        logoutToProfileSelect,
        markTaskAsRequestedByKid,
        approveTask,
        rejectTask,
        toggleTaskDirectly,
        approveAllPendingTasks,
        moveTaskOrder,
        removeTaskFromDay,
        addQuickTaskToChildDay,
        checkDuplicatesForRoutine,
        injectRoutine,
        assignMasterTaskToChild,
        saveMasterTask,
        deleteMasterTask,
        saveMasterRoutine,
        deleteMasterRoutine,
        requestRewardRedemption,
        authorizeRedemption,
        denyRedemption,
        saveReward,
        deleteReward,
        toggleRewardLock,
        modifyPastTaskValidation,
        refundPastRedemption,
        applyQuickPoints,
        saveChild,
        deleteChild,
        saveTutor,
        updateFamilySettings,
        resetAllData,
        triggerConfetti
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
