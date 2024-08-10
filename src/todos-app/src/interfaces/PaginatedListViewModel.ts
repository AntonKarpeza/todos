export interface PaginatedListViewModel<T> {
    items: T[];
    pageIndex: number;
    totalPages: number;
    totalCount: number;
  }