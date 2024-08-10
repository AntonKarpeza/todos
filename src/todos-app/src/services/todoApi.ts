import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TodoTaskViewModel } from '../interfaces/TodoTaskViewModel';
import { FilterTodoTasksViewModel } from '../interfaces/FilterTodoTasksViewModel';
import { PaginatedListViewModel } from '../interfaces/PaginatedListViewModel';

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://localhost:7054/v1/' }),
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