import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TodoAddEditState {
  isOpen: boolean;
  todoTaskId?: number;
}

const initialState: TodoAddEditState = {
  isOpen: false,
  todoTaskId: undefined,
};

const todoAddEditSlice = createSlice({
  name: 'todoAddEditSlice',
  initialState,
  reducers: {
    openAddEditModal: (
      state,
      action: PayloadAction<{ todoTaskId?: number; }>
    ) => {
      state.isOpen = true;
      state.todoTaskId = action.payload.todoTaskId;
    },
    closeAddEditModal: (state) => {
      state.isOpen = false;
      state.todoTaskId = undefined;
    },
  },
});

export const { openAddEditModal, closeAddEditModal } = todoAddEditSlice.actions;

export default todoAddEditSlice.reducer;