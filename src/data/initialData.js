export const INITIAL_DATA = {
  family: {
    id: 'fam-rodriguez',
    name: 'Familia Rodríguez',
    masterPin: '1234',
    pointsRule: 'continuous', // 'continuous' (cumulative) | 'daily_reset' | 'weekly_reset'
    autoLiquidation: {
      enabled: false,
      rewardType: 'money_allowance',
      conversionRate: 0.10,
      currencySymbol: '$',
      customRewardTitle: '',
      customRewardId: null
    },
    activeTutorId: 'tutor-1'
  },
  tutors: [
    { id: 'tutor-1', name: 'Papá (Juan)', role: 'Administrador', email: 'papa@familia.com', avatar: '👨' },
    { id: 'tutor-2', name: 'Mamá (Elena)', role: 'Administrador', email: 'mama@familia.com', avatar: '👩' }
  ],
  children: [
    {
      id: 'child-mateo',
      name: 'Mateo',
      avatar: '🦁',
      level: 'Nivel 3 • Explorador',
      currentPoints: 150,
      totalPointsEarned: 250,
      colorTheme: '#F59E0B',
      bgColor: '#FEF3C7',
      borderColor: '#FDE68A'
    },
    {
      id: 'child-sofia',
      name: 'Sofía',
      avatar: '🦄',
      level: 'Nivel 2 • Aprendiz',
      currentPoints: 90,
      totalPointsEarned: 100,
      colorTheme: '#EC4899',
      bgColor: '#FCE7F3',
      borderColor: '#FBCFE8'
    }
  ],
  masterTasks: [
    {
      id: 'mt-1',
      title: 'Hacer la cama',
      defaultPoints: 20,
      defaultApprovalMode: 'kid_request', // 'kid_request' | 'parent_only'
      iconSvg: '🛏️',
      category: 'Hogar',
      description: 'Estirar bien las sábanas, alinear el edredón y colocar los cojines ordenados.',
      assignedChildren: [{ childId: 'child-mateo', scheduleType: 'daily', scheduleText: 'Diaria continua', scheduleDetails: '' }]
    },
    {
      id: 'mt-2',
      title: 'Lavarse los dientes',
      defaultPoints: 10,
      defaultApprovalMode: 'parent_only',
      iconSvg: '🪥',
      category: 'Higiene',
      description: 'Cepillarse durante 2 minutos completos y enjuagar con agua.',
      assignedChildren: [
        { childId: 'child-mateo', scheduleType: 'daily', scheduleText: 'Diaria continua', scheduleDetails: '' },
        { childId: 'child-sofia', scheduleType: 'daily', scheduleText: 'Diaria continua', scheduleDetails: '' }
      ]
    },
    {
      id: 'mt-3',
      title: 'Deberes escolares',
      defaultPoints: 30,
      defaultApprovalMode: 'kid_request',
      iconSvg: '📚',
      category: 'Estudios',
      description: 'Completar las tareas de la libreta y dejar la mochila organizada para mañana.',
      assignedChildren: [{ childId: 'child-mateo', scheduleType: 'weekdays', scheduleText: 'Días de Escuela (L-V)', scheduleDetails: 'Lunes a Viernes' }]
    },
    {
      id: 'mt-4',
      title: 'Ordenar juguetes',
      defaultPoints: 20,
      defaultApprovalMode: 'kid_request',
      iconSvg: '🧸',
      category: 'Hogar',
      description: 'Guardar todos los muñecos y bloques en sus cajas respectivas del armario.',
      assignedChildren: [{ childId: 'child-mateo', scheduleType: 'daily', scheduleText: 'Diaria continua', scheduleDetails: '' }]
    },
    {
      id: 'mt-5',
      title: 'Poner la mesa',
      defaultPoints: 15,
      defaultApprovalMode: 'kid_request',
      iconSvg: '🍽️',
      category: 'Hogar',
      description: 'Colocar manteles individuales, platos, cubiertos y vasos para la cena.',
      assignedChildren: []
    },
    {
      id: 'mt-6',
      title: 'Comer porción de verdura / fruta',
      defaultPoints: 15,
      defaultApprovalMode: 'parent_only',
      iconSvg: '🥦',
      category: 'Salud',
      description: 'Terminar la porción saludable servida en el plato sin quejas.',
      assignedChildren: []
    },
    {
      id: 'mt-7',
      title: 'Pasear al perro',
      defaultPoints: 25,
      defaultApprovalMode: 'kid_request',
      iconSvg: '🐕',
      category: 'Responsabilidad',
      description: 'Paseo de 15 minutos llevando la correa con cuidado y bolsa de limpieza.',
      assignedChildren: [{ childId: 'child-sofia', scheduleType: 'daily', scheduleText: 'Diaria continua', scheduleDetails: '' }]
    },
    {
      id: 'mt-8',
      title: 'Regar las plantas',
      defaultPoints: 15,
      defaultApprovalMode: 'kid_request',
      iconSvg: '🌱',
      category: 'Hogar',
      description: 'Regar las macetas del balcón sin encharcar la tierra.',
      assignedChildren: []
    }
  ],
  masterRoutines: [
    {
      id: 'mr-1',
      title: 'Rutina Mañanera',
      icon: '🌅',
      description: 'Pasos esenciales antes de salir rumbo al colegio.',
      tasks: [
        { masterTaskId: 'mt-1', title: 'Hacer la cama', points: 20, iconSvg: '🛏️', orderIndex: 1 },
        { masterTaskId: 'mt-2', title: 'Lavarse los dientes', points: 10, iconSvg: '🪥', orderIndex: 2 }
      ],
      assignedChildren: ['child-mateo', 'child-sofia'],
      scheduleType: 'daily' // 'daily' | 'weekdays' | 'custom'
    },
    {
      id: 'mr-2',
      title: 'Rutina Tarde de Estudio & Orden',
      icon: '🎒',
      description: 'Secuencia de tarde para rendir y mantener la habitación impecable.',
      tasks: [
        { masterTaskId: 'mt-3', title: 'Deberes escolares', points: 30, iconSvg: '📚', orderIndex: 1 },
        { masterTaskId: 'mt-4', title: 'Ordenar juguetes', points: 20, iconSvg: '🧸', orderIndex: 2 },
        { masterTaskId: 'mt-5', title: 'Poner la mesa', points: 15, iconSvg: '🍽️', orderIndex: 3 }
      ],
      assignedChildren: ['child-mateo'],
      scheduleType: 'weekdays'
    }
  ],
  todayAssignments: [
    {
      id: 'asg-1',
      childId: 'child-mateo',
      masterTaskId: 'mt-1',
      date: '2026-08-25',
      title: 'Hacer la cama',
      points: 20,
      approvalMode: 'kid_request',
      iconSvg: '🛏️',
      orderIndex: 1,
      status: 'approved', // 'pending' | 'requested' | 'approved' | 'rejected'
      completedAt: '08:30 AM',
      approvedBy: 'Papá (Juan)',
      note: 'Estirar bien las sábanas y colocar almohada.'
    },
    {
      id: 'asg-2',
      childId: 'child-mateo',
      masterTaskId: 'mt-2',
      date: '2026-08-25',
      title: 'Lavarse los dientes',
      points: 10,
      approvalMode: 'parent_only',
      iconSvg: '🪥',
      orderIndex: 2,
      status: 'requested',
      completedAt: '08:45 AM',
      note: 'Cepillarse por 2 minutos.'
    },
    {
      id: 'asg-3',
      childId: 'child-mateo',
      masterTaskId: 'mt-3',
      date: '2026-08-25',
      title: 'Deberes de Matemáticas',
      points: 30,
      approvalMode: 'kid_request',
      iconSvg: '📚',
      orderIndex: 3,
      status: 'pending',
      note: 'Página 45 del libro, ejercicios 1 al 4.'
    },
    {
      id: 'asg-4',
      childId: 'child-mateo',
      masterTaskId: 'mt-4',
      date: '2026-08-25',
      title: 'Ordenar juguetes',
      points: 20,
      approvalMode: 'kid_request',
      iconSvg: '🧸',
      orderIndex: 4,
      status: 'pending',
      note: 'Caja de bloques y guardar legos.'
    },
    {
      id: 'asg-5',
      childId: 'child-sofia',
      masterTaskId: 'mt-2',
      date: '2026-08-25',
      title: 'Lavarse los dientes',
      points: 10,
      approvalMode: 'parent_only',
      iconSvg: '🪥',
      orderIndex: 1,
      status: 'approved',
      completedAt: '08:40 AM',
      approvedBy: 'Mamá (Elena)',
      note: 'Cepillo de princesa.'
    },
    {
      id: 'asg-6',
      childId: 'child-sofia',
      masterTaskId: 'mt-4',
      date: '2026-08-25',
      title: 'Guardar peluches',
      points: 15,
      approvalMode: 'kid_request',
      iconSvg: '🦄',
      orderIndex: 2,
      status: 'pending',
      note: 'Acomodar peluches en la cesta rosa.'
    },
    {
      id: 'asg-7',
      childId: 'child-sofia',
      masterTaskId: 'mt-3',
      date: '2026-08-25',
      title: 'Práctica de lectura',
      points: 20,
      approvalMode: 'kid_request',
      iconSvg: '📖',
      orderIndex: 3,
      status: 'pending',
      note: 'Leer 2 páginas del cuento de dragones.'
    }
  ],
  rewards: [
    {
      id: 'rew-1',
      title: '30 mins de Consola',
      pointsCost: 100,
      iconSvg: '🎮',
      isLocked: false,
      availableFor: 'all' // 'all' | 'child-mateo' | 'child-sofia'
    },
    {
      id: 'rew-2',
      title: 'Elegir el postre del domingo',
      pointsCost: 80,
      iconSvg: '🍦',
      isLocked: false,
      availableFor: 'all'
    },
    {
      id: 'rew-3',
      title: 'Salida al parque',
      pointsCost: 200,
      iconSvg: '🎪',
      isLocked: true,
      lockUntil: '2026-08-30',
      lockReason: 'Descanso temporal',
      lockDuration: '2 días',
      availableFor: 'all'
    },
    {
      id: 'rew-4',
      title: '30 mins de Tablet o Celular',
      pointsCost: 80,
      iconSvg: '📱',
      isLocked: true,
      lockUntil: '2026-08-28',
      lockReason: 'Descanso de pantallas por época de exámenes',
      lockDuration: '2 días',
      availableFor: 'child-mateo'
    },
    {
      id: 'rew-5',
      title: 'Tarde de cine con palomitas',
      pointsCost: 140,
      iconSvg: '🍿',
      isLocked: false,
      availableFor: 'all'
    },
    {
      id: 'rew-6',
      title: 'Comprar juguete o libro sorpresa',
      pointsCost: 250,
      iconSvg: '🎁',
      isLocked: false,
      availableFor: 'all'
    }
  ],
  pendingRedemptions: [],
  calendarHistory: {
    '2026-08-25': {
      'child-mateo': {
        status: 'full', // 'full' (green) | 'partial' (yellow) | 'missed' (red)
        netPoints: 60,
        penalties: 0,
        tasks: [
          { id: 'hist-1', title: 'Hacer la cama', points: 20, status: 'approved', completedAt: '08:20 AM', approvedBy: 'Papá' },
          { id: 'hist-2', title: 'Lavarse los dientes', points: 10, status: 'approved', completedAt: '08:35 AM', approvedBy: 'Papá' },
          { id: 'hist-3', title: 'Deberes de Ciencias', points: 30, status: 'approved', completedAt: '05:00 PM', approvedBy: 'Mamá' }
        ],
        penaltiesList: [],
        redemptions: [],
        bonuses: []
      },
      'child-sofia': {
        status: 'full',
        netPoints: 45,
        penalties: 0,
        tasks: [
          { id: 'hist-4', title: 'Lavarse los dientes', points: 10, status: 'approved', completedAt: '08:45 AM', approvedBy: 'Mamá' },
          { id: 'hist-5', title: 'Guardar peluches', points: 15, status: 'approved', completedAt: '06:00 PM', approvedBy: 'Mamá' },
          { id: 'hist-6', title: 'Práctica de dibujo', points: 20, status: 'approved', completedAt: '07:00 PM', approvedBy: 'Papá' }
        ],
        penaltiesList: [],
        redemptions: [],
        bonuses: []
      }
    },
    '2026-08-24': {
      'child-mateo': {
        status: 'partial',
        netPoints: 30,
        penalties: 0,
        tasks: [
          { id: 'hist-7', title: 'Hacer la cama', points: 20, status: 'approved', completedAt: '08:30 AM', approvedBy: 'Papá' },
          { id: 'hist-8', title: 'Lavarse los dientes', points: 10, status: 'approved', completedAt: '08:40 AM', approvedBy: 'Papá' },
          { id: 'hist-9', title: 'Ordenar habitación', points: 20, status: 'missed', completedAt: null }
        ],
        penaltiesList: [],
        redemptions: [
          { id: 'red-hist-1', rewardTitle: '30 mins de Consola', pointsCost: 100, redeemedAt: '07:30 PM', isRefunded: false }
        ],
        bonuses: []
      },
      'child-sofia': {
        status: 'full',
        netPoints: 35,
        penalties: 0,
        tasks: [
          { id: 'hist-10', title: 'Lavarse los dientes', points: 10, status: 'approved', completedAt: '08:30 AM', approvedBy: 'Mamá' },
          { id: 'hist-11', title: 'Poner la mesa', points: 15, status: 'approved', completedAt: '08:00 PM', approvedBy: 'Mamá' },
          { id: 'hist-12', title: 'Lectura de cuento', points: 10, status: 'approved', completedAt: '08:30 PM', approvedBy: 'Papá' }
        ],
        penaltiesList: [],
        redemptions: [],
        bonuses: []
      }
    },
    '2026-08-23': {
      'child-mateo': {
        status: 'missed',
        netPoints: 10,
        penalties: 10,
        tasks: [
          { id: 'hist-13', title: 'Hacer la cama', points: 20, status: 'approved', completedAt: '09:00 AM', approvedBy: 'Papá' }
        ],
        penaltiesList: [
          { id: 'pen-hist-1', points: -10, reason: 'Discusión por control remoto', isReversed: false, actor: 'Papá' }
        ],
        redemptions: [],
        bonuses: []
      },
      'child-sofia': {
        status: 'full',
        netPoints: 30,
        penalties: 0,
        tasks: [
          { id: 'hist-15', title: 'Lavarse los dientes', points: 10, status: 'approved', completedAt: '09:00 AM', approvedBy: 'Mamá' },
          { id: 'hist-16', title: 'Recoger pinturas', points: 20, status: 'approved', completedAt: '06:30 PM', approvedBy: 'Mamá' }
        ],
        penaltiesList: [],
        redemptions: [],
        bonuses: []
      }
    }
  },
  transactions: []
};
