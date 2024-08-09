export interface PaginatedListViewModel<T> {
    items: T[];
    pageIndex: number;
    totalPages: number;
  }
  
  export interface FilterTodoTasksViewModel {
    pageNumber: number;
    pageSize: number;
    isDone?: boolean;
    deadlineFrom?: string;
    deadlineTo?: string;
    todoTaskName?: string;
    sortBy?: string;
    sortDirection?: string;
  }