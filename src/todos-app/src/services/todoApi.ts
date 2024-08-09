import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Todo } from '../interfaces/Todo';
import {
  PaginatedListViewModel,
  FilterTodoTasksViewModel,
} from '../interfaces/ViewModels';

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://localhost:7054/v1/' }),
  endpoints: (builder) => ({
    getTodoTasks: builder.query<PaginatedListViewModel<Todo>, FilterTodoTasksViewModel>({
      query: (filter) => ({
        url: 'TodoTask',
        params: filter,
      }),
    }),
    getTodoTask: builder.query<Todo, number>({
      query: (id) => `TodoTask/${id}`,
    }),
    createTodoTask: builder.mutation<number, Todo>({
      query: (newTask) => ({
        url: 'TodoTask',
        method: 'POST',
        body: newTask,
      }),
    }),
    updateTodoTask: builder.mutation<void, Todo>({
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