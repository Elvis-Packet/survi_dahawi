import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  auditLogs: [],
  loginHistory: [],
  total: 0,
  status: 'idle',
  error: null,
};

const auditSlice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    setAuditLogs(state, action) {
      state.auditLogs = action.payload.items || action.payload;
      state.total = action.payload.total || state.auditLogs.length;
    },
    setLoginHistory(state, action) {
      state.loginHistory = action.payload.items || action.payload;
    },
    setAuditStatus(state, action) { state.status = action.payload; },
    setAuditError(state, action) { state.error = action.payload; state.status = 'failed'; },
  },
});

export const {
  setAuditLogs, setLoginHistory, setAuditStatus, setAuditError,
} = auditSlice.actions;

export default auditSlice.reducer;
