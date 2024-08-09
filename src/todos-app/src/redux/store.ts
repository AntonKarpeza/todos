import { configureStore } from '@reduxjs/toolkit';
import { todoApi } from '../services/todoApi';
import todosReducer from './todosSlice';
import todoAddEditSliceReducer from './todoAddEditSlice';

export const store = configureStore({
  reducer: {
    [todoApi.reducerPath]: todoApi.reducer,
    todos: todosReducer,
    todoAddEditSlice: todoAddEditSliceReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(todoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;