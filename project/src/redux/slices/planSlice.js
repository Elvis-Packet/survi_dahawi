import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  plans: [],
  selectedPlan: null,
  total: 0,
  status: 'idle',
  error: null,
};

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    setPlans(state, action) {
      state.plans = action.payload.items || action.payload;
      state.total = action.payload.total || state.plans.length;
    },
    setSelectedPlan(state, action) { state.selectedPlan = action.payload; },
    addPlan(state, action) { state.plans.unshift(action.payload); },
    updatePlanInList(state, action) {
      const idx = state.plans.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.plans[idx] = { ...state.plans[idx], ...action.payload };
    },
    removePlan(state, action) {
      state.plans = state.plans.filter((p) => p.id !== action.payload);
    },
    setPlanStatus(state, action) { state.status = action.payload; },
    setPlanError(state, action) { state.error = action.payload; state.status = 'failed'; },
  },
});

export const {
  setPlans, setSelectedPlan, addPlan, updatePlanInList, removePlan,
  setPlanStatus, setPlanError,
} = planSlice.actions;

export default planSlice.reducer;
