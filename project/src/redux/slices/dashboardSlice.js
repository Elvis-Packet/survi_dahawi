import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: null,
  performanceTrends: null,
  departmentPerformance: null,
  recentActivities: [],
  upcomingTasks: [],
  employeeRankings: [],
  status: 'idle',
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats(state, action) { state.stats = action.payload; },
    setPerformanceTrends(state, action) { state.performanceTrends = action.payload; },
    setDepartmentPerformance(state, action) { state.departmentPerformance = action.payload; },
    setRecentActivities(state, action) { state.recentActivities = action.payload; },
    setUpcomingTasks(state, action) { state.upcomingTasks = action.payload; },
    setEmployeeRankings(state, action) { state.employeeRankings = action.payload; },
    setDashboardStatus(state, action) { state.status = action.payload; },
    setDashboardError(state, action) { state.error = action.payload; state.status = 'failed'; },
  },
});

export const {
  setStats, setPerformanceTrends, setDepartmentPerformance,
  setRecentActivities, setUpcomingTasks, setEmployeeRankings,
  setDashboardStatus, setDashboardError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
