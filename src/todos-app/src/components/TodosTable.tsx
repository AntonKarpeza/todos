import React, { useState, useEffect } from 'react';
import {
  useGetTodoTasksQuery
} from '../services/todoApi';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  LinearProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { FilterTodoTasksViewModel } from '../interfaces/FilterTodoTasksViewModel';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import EditTodoModal from './EditTodoModal';
import { TodosState } from '../redux/interfaces/TodosState';
import { useSelector } from 'react-redux';
import ToggleTodo from './ToggleTodo'; 
import DeleteTodo from './DeleteTodo';
import SearchTodos from './SearchTodos';

interface TodosTableProps {
  isDone?: boolean;
  sortBy?: string;
  sortDirection?: string;
  deadlineTo?: Date;
}

const TodosTable: React.FC<TodosTableProps> = ({ isDone, sortBy, sortDirection, deadlineTo }) => {
  const refreshData = useSelector((state: { todos: TodosState }) => state.todos.refreshData);
  const [searchText, setSearchText] = useState<string>('');
  const [isEditTodoModalOpen, setIsEditTodoModalOpen] = useState(false);
  const [selectedTodoTaskId, setSelectedTodoTaskId] = useState<number | null>(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const filter: FilterTodoTasksViewModel = {
    pageNumber: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    isDone: isDone,
    deadlineFrom: undefined,
    deadlineTo: deadlineTo ? deadlineTo.toISOString() : undefined,
    todoTaskName: searchText,
    sortBy: sortBy ? sortBy : 'TodoTaskId',
    sortDirection: sortDirection,
  };

  const { data: todos = { items: [], totalPages: 0, totalCount: 0 }, isLoading, refetch } = useGetTodoTasksQuery(filter);

  useEffect(() => {
    refetch();
  }, [refetch, refreshData]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaginationModel((prev) => ({
      ...prev,
      pageSize: parseInt(event.target.value, 10),
      page: 0,
    }));
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleOpenEditTodoModal = (todoTaskId?: number) => {
    if (!todoTaskId) return;
    setSelectedTodoTaskId(todoTaskId);
    setIsEditTodoModalOpen(true);
  };

  const handleCloseEditTodoModal = () => {
    setSelectedTodoTaskId(null);
    setIsEditTodoModalOpen(false);
  };

  return (
    <>
      <SearchTodos onSearch={handleSearch} />
      {isLoading && <LinearProgress />}
      <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
        <Table stickyHeader aria-label="todos table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Todo</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todos.items.map((todo) => (
              <TableRow hover key={todo.todoTaskId}>
                <TableCell padding="checkbox">
                  <ToggleTodo
                      todoTaskId={todo.todoTaskId}
                      isDone={todo.isDone}
                    />
                </TableCell>
                <TableCell>{todo.todoTaskName}</TableCell>
                <TableCell>
                  {todo.deadline ? format(new Date(todo.deadline), 'Pp', { locale: de }) : 'No'}
                </TableCell>
                <TableCell>
                  <Button variant="text" color="primary" onClick={() => handleOpenEditTodoModal(todo.todoTaskId)}>
                    <EditIcon />
                  </Button>
                  <DeleteTodo todoTaskId={todo.todoTaskId}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={todos.totalCount}
        rowsPerPage={paginationModel.pageSize}
        page={paginationModel.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {selectedTodoTaskId !== null && (
        <EditTodoModal
          isOpen={isEditTodoModalOpen}
          handleClose={handleCloseEditTodoModal}
          todoTaskId={selectedTodoTaskId}
        />
      )}
    </>
  );
};

export default TodosTable;