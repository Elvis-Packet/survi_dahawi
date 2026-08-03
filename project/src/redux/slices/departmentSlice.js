import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  departments: [],
  selectedDepartment: null,
  status: 'idle',
  error: null,
};

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    setDepartments(state, action) { state.departments = action.payload.items || action.payload; },
    setSelectedDepartment(state, action) { state.selectedDepartment = action.payload; },
    addDepartment(state, action) { state.departments.unshift(action.payload); },
    updateDepartmentInList(state, action) {
      const idx = state.departments.findIndex((d) => d.id === action.payload.id);
      if (idx !== -1) state.departments[idx] = { ...state.departments[idx], ...action.payload };
    },
    removeDepartment(state, action) {
      state.departments = state.departments.filter((d) => d.id !== action.payload);
    },
    setDepartmentStatus(state, action) { state.status = action.payload; },
    setDepartmentError(state, action) { state.error = action.payload; state.status = 'failed'; },
  },
});

export const {
  setDepartments, setSelectedDepartment, addDepartment, updateDepartmentInList,
  removeDepartment, setDepartmentStatus, setDepartmentError,
} = departmentSlice.actions;

export default departmentSlice.reducer;
