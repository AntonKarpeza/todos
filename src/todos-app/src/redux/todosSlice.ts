import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TodosState } from './TodosState';

const initialState: TodosState = {
  refreshData: false,
  showSnackbarMessage: ""
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
         state.refreshData = !state.refreshData;
         state.showSnackbarMessage = action.payload;
    },
  },
});

export const { addTodo } = todosSlice.actions;

export default todosSlice.reducer;