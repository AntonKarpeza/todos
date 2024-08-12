import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TodoTaskViewModel } from '../interfaces/TodoTaskViewModel';
import { FilterTodoTasksViewModel } from '../interfaces/FilterTodoTasksViewModel';
import { PaginatedListViewModel } from '../interfaces/PaginatedListViewModel';
import process from 'process';

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_TODO_API_V1_BASE_URL }),
  endpoints: (builder) => ({
    getTodoTasks: builder.query<PaginatedListViewModel<TodoTaskViewModel>, FilterTodoTasksViewModel>({
      query: (filter) => ({
        url: 'TodoTask',
        params: filter,
      }),
    }),
    getTodoTask: builder.query<TodoTaskViewModel, number>({
      query: (id) => `TodoTask/${id}`,
    }),
    createTodoTask: builder.mutation<number, TodoTaskViewModel>({
      query: (newTask) => ({
        url: 'TodoTask',
        method: 'POST',
        body: newTask,
      }),
    }),
    updateTodoTask: builder.mutation<void, TodoTaskViewModel>({
      query: (updatedTask) => ({
        url: 'TodoTask',
        method: 'PUT',
        body: updatedTask,
      }),
    }),
    toggleIsDoneTodoTask: builder.mutation<void, number>({
      query: (todoTaskId) => ({
        url: `TodoTask/${todoTaskId}/status`,
        method: 'PATCH',
      }),
    }),
    deleteTodoTask: builder.mutation<void, number>({
      query: (todoTaskId) => ({
        url: `TodoTask/${todoTaskId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetTodoTasksQuery,
  useGetTodoTaskQuery,
  useCreateTodoTaskMutation,
  useUpdateTodoTaskMutation,
  useToggleIsDoneTodoTaskMutation,
  useDeleteTodoTaskMutation,
} = todoApi;