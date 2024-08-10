import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TodosState } from '../interfaces/TodosState';
import { FilterTodoTasksViewModel } from '../interfaces/FilterTodoTasksViewModel';

const initialState: TodosState = {
  refresh: false,
  filter: {} as FilterTodoTasksViewModel,
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    triggerTableRefresh: state => {
      state.refresh = !state.refresh;
    },
    // filterTodo: (state, action: PayloadAction<FilterTodoTasksViewModel>) => {
    //     state.filter = ;
    // },
    // addTodo: (state, action: PayloadAction<Todo>) => {
    //   state.todos.push(action.payload);
    // },
    // updateTodo: (state, action: PayloadAction<Todo>) => {
    //   const index = state.todos.findIndex(todo => todo.todoTaskId === action.payload.todoTaskId);
    //   if (index !== -1) {
    //     state.todos[index] = action.payload;
    //   }
    // },
    // deleteTodo: (state, action: PayloadAction<number>) => {
    //   state.todos = state.todos.filter(todo => todo.todoTaskId !== action.payload);
    // },
    // setTodos: (state, action: PayloadAction<Todo[]>) => {
    //   state.todos = action.payload;
    // },
  },
});

export const { triggerTableRefresh} = todosSlice.actions;

export default todosSlice.reducer;