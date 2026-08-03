import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reports: [],
  performanceTrends: null,
  departmentPerformance: null,
  orgKpis: null,
  status: 'idle',
  error: null,
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setReports(state, action) { state.reports = action.payload.items || action.payload; },
    setReportTrends(state, action) { state.performanceTrends = action.payload; },
    setReportDeptPerformance(state, action) { state.departmentPerformance = action.payload; },
    setOrgKpis(state, action) { state.orgKpis = action.payload; },
    addReport(state, action) { state.reports.unshift(action.payload); },
    setReportStatus(state, action) { state.status = action.payload; },
    setReportError(state, action) { state.error = action.payload; state.status = 'failed'; },
  },
});

export const {
  setReports, setReportTrends, setReportDeptPerformance, setOrgKpis, addReport,
  setReportStatus, setReportError,
} = reportSlice.actions;

export default reportSlice.reducer;
