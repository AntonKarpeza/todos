import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TodosState } from './interfaces/TodosState';
import { TodoSnackbarState } from './interfaces/TodoSnackbarState';

const initialState: TodosState = {
  refreshData: false,
  todoSnackbarState: {} as TodoSnackbarState
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<TodoSnackbarState>) => {
         state.refreshData = !state.refreshData;
         state.todoSnackbarState = action.payload;
    },
    editTodo: (state, action: PayloadAction<TodoSnackbarState>) => {
      state.refreshData = !state.refreshData;
      state.todoSnackbarState = action.payload;
    },
  },
});

export const { addTodo, editTodo } = todosSlice.actions;

export default todosSlice.reducer;