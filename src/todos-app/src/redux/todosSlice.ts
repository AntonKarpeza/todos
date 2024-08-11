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
      state.todoSnackbarState = action.payload;
      state.refreshData = !state.refreshData;
    },
    editTodo: (state, action: PayloadAction<TodoSnackbarState>) => {
      state.todoSnackbarState = action.payload;
      state.refreshData = !state.refreshData;
    },
    deleteTodo: (state, action: PayloadAction<TodoSnackbarState>) => {
      state.todoSnackbarState = action.payload;
      state.refreshData = !state.refreshData;
    },
    toggleIsDone: (state, action: PayloadAction<TodoSnackbarState>) => {
      state.todoSnackbarState = action.payload;
      state.refreshData = !state.refreshData;
    },
    errorCaught: (state, action: PayloadAction<TodoSnackbarState>) =>{
      state.todoSnackbarState = action.payload;
    }
  },
});

export const { addTodo, editTodo, deleteTodo, toggleIsDone, errorCaught } = todosSlice.actions;

export default todosSlice.reducer;