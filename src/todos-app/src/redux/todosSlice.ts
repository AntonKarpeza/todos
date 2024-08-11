import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TodosState } from './interfaces/TodosState';
import { TodoSnackbarState } from './interfaces/TodoSnackbarState';
import { AlertSeverity } from './enums/AlertSeverity';

const initialState: TodosState = {
  refreshData: false,
  todoSnackbarState: {} as TodoSnackbarState
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<TodoSnackbarState>) => {
      state.todoSnackbarState = action.payload;
      if(state.todoSnackbarState.alertSeverity === AlertSeverity.Success){
        state.refreshData = !state.refreshData;
      }
    },
    editTodo: (state, action: PayloadAction<TodoSnackbarState>) => {
      state.todoSnackbarState = action.payload;
      if(state.todoSnackbarState.alertSeverity === AlertSeverity.Success){
        state.refreshData = !state.refreshData;
      }
    },
    toggleIsDone: (state, action: PayloadAction<TodoSnackbarState>) => {
      state.todoSnackbarState = action.payload;
      if(state.todoSnackbarState.alertSeverity === AlertSeverity.Success){
        state.refreshData = !state.refreshData;
      }
    },
  },
});

export const { addTodo, editTodo, toggleIsDone } = todosSlice.actions;

export default todosSlice.reducer;