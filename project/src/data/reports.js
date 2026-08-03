export const MOCK_REPORTS = [
  { id: 'rpt_001', title: 'Q2 2026 Organization Performance', type: 'performance', period: 'Q2 2026', generatedBy: 'Rachel Kim', generatedAt: '2026-07-15T10:00:00.000Z', format: 'PDF', size: '2.4 MB', status: 'published' },
  { id: 'rpt_002', title: 'Payments Department — July', type: 'department', period: 'Jul 2026', generatedBy: 'Jordan Lee', generatedAt: '2026-08-01T09:00:00.000Z', format: 'PDF', size: '1.8 MB', status: 'published' },
  { id: 'rpt_003', title: 'Compliance Audit Readiness', type: 'compliance', period: 'Q2 2026', generatedBy: 'Maya Patel', generatedAt: '2026-07-20T14:00:00.000Z', format: 'XLSX', size: '820 KB', status: 'published' },
  { id: 'rpt_004', title: 'Risk Exposure Summary', type: 'risk', period: 'Jul 2026', generatedBy: 'Maya Patel', generatedAt: '2026-08-02T11:00:00.000Z', format: 'PDF', size: '1.1 MB', status: 'draft' },
  { id: 'rpt_005', title: 'Headcount & Hiring Report', type: 'hr', period: 'H1 2026', generatedBy: 'Rachel Kim', generatedAt: '2026-07-05T10:00:00.000Z', format: 'PDF', size: '3.2 MB', status: 'published' },
];

export const PERFORMANCE_TRENDS = {
  weekly: {
    labels: ['W26', 'W27', 'W28', 'W29', 'W30', 'W31', 'W32'],
    completion: [72, 78, 81, 79, 85, 88, 90],
    onTime: [65, 70, 74, 72, 80, 84, 86],
  },
  monthly: {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    completion: [68, 72, 75, 78, 82, 86, 90],
    onTime: [60, 66, 70, 73, 77, 82, 86],
  },
};

export const DEPARTMENT_PERFORMANCE = {
  labels: ['Payments', 'Compliance', 'Risk', 'Operations', 'Finance', 'Engineering'],
  values: [88, 90, 82, 85, 91, 84],
};

export const ORG_KPIS = {
  totalEmployees: 83,
  activeEmployees: 79,
  departments: 7,
  avgPerformance: 86,
  tasksCompletedThisMonth: 412,
  tasksPending: 67,
  plansApprovedRate: 78,
  openIncidents: 2,
};
