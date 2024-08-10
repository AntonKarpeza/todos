import React, { useState, useEffect } from 'react';
import { useGetTodoTasksQuery, useToggleIsDoneTodoTaskMutation, useDeleteTodoTaskMutation } from '../services/todoApi';
import { Button, Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Paper } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { FilterTodoTasksViewModel } from '../interfaces/ViewModels';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import EditTodoModal from './EditTodoModal';

interface TodosTableProps {
  isDone?: boolean;
  sortBy?: string;
  sortDirection?: string;
  deadlineTo?: Date;
}

const TodosTable: React.FC<TodosTableProps> = ({ isDone, sortBy, sortDirection, deadlineTo }) => {
  const [isEditTodoModalOpen, setIsEditTodoModalOpen] = useState(false);
  const [selectedTodoTaskId, setSelectedTodoTaskId] = useState<number | null>(null);

  const handleOpenEditTodoModal = (todoTaskId?: number) => {
    if(!todoTaskId) return;
    setSelectedTodoTaskId(todoTaskId);
    setIsEditTodoModalOpen(true);
  };

  const handleCloseEditTodoModal = () => {
    setSelectedTodoTaskId(null);
    setIsEditTodoModalOpen(false);
  };

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
    todoTaskName: undefined,
    sortBy: sortBy,
    sortDirection: sortDirection,
  };

  const { data: todos = { items: [], totalPages: 0, totalCount: 0 }, error, isLoading, refetch } = useGetTodoTasksQuery(filter);
  const [toggleIsDoneTodoTask] = useToggleIsDoneTodoTaskMutation();
  const [deleteTodoTask] = useDeleteTodoTaskMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleToggle = async (id?: number) => {
    if(!id) return;
    try {
      await toggleIsDoneTodoTask(id).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to toggle todo', err);
    }
  };

  const handleDelete = async (id?: number) => {
    if(!id) return;
    try {
      await deleteTodoTask(id).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to delete todo', err);
    }
  };

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.toString()}</div>;
  }

  return (
    <>
      <TableContainer sx={{ maxHeight: 440 }} component={Paper}>
        <Table stickyHeader aria-label="todos table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Todo</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todos.items.map((todo) => (
              <TableRow hover key={todo.todoTaskId}>
                <TableCell padding="checkbox">
                  <Checkbox checked={todo.isDone} onChange={() => handleToggle(todo.todoTaskId)} />
                </TableCell>
                <TableCell>{todo.todoTaskName}</TableCell>
                <TableCell>{todo.deadline ? format(new Date(todo.deadline), 'Pp', { locale: de }) : 'No'}</TableCell>
                <TableCell>
                  <Button variant="text" color="primary" onClick={() => handleOpenEditTodoModal(todo.todoTaskId)}>
                    <EditIcon />
                  </Button>
                  <Button variant="text" color="primary" onClick={() => handleDelete(todo.todoTaskId)}>
                    <DeleteForeverIcon />
                  </Button>
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
          refetch={refetch} // Pass the selected task ID to the modal
        />
      )}
    </>
  );
};

export default TodosTable;
