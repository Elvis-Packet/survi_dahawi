import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  selectedTask: null,
  total: 0,
  status: 'idle',
  error: null,
};

const normalizeTask = (task) => ({
  ...task,
  comments: task.comments || [],
});

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTasks(state, action) {
      state.tasks = (action.payload.items || action.payload).map(normalizeTask);
      state.total = action.payload.total || state.tasks.length;
    },
    setSelectedTask(state, action) { state.selectedTask = normalizeTask(action.payload); },
    addTask(state, action) { state.tasks.unshift(normalizeTask(action.payload)); },
    updateTaskInList(state, action) {
      const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.tasks[idx] = { ...state.tasks[idx], ...normalizeTask(action.payload) };
    },
    removeTask(state, action) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    setTaskStatus(state, action) { state.status = action.payload; },
    setTaskError(state, action) { state.error = action.payload; state.status = 'failed'; },
  },
});

export const {
  setTasks, setSelectedTask, addTask, updateTaskInList, removeTask,
  setTaskStatus, setTaskError,
} = taskSlice.actions;

export default taskSlice.reducer;
