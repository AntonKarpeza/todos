import React, { useState, useEffect } from 'react';
import {
  useGetTodoTasksQuery,
  useToggleIsDoneTodoTaskMutation,
  useDeleteTodoTaskMutation,
} from '../services/todoApi';
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
  TextField,
  LinearProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { FilterTodoTasksViewModel } from '../interfaces/FilterTodoTasksViewModel';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import EditTodoModal from './EditTodoModal';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { TodosState } from '../redux/interfaces/TodosState'; // Adjust this path and type based on your actual setup
import { useSelector } from 'react-redux';





interface TodosTableProps {
  isDone?: boolean;
  sortBy?: string;
  sortDirection?: string;
  deadlineTo?: Date;
}

const TodosTable: React.FC<TodosTableProps> = ({ isDone, sortBy, sortDirection, deadlineTo }) => {

  const refreshData = useSelector((state: { todos: TodosState }) => state.todos.refreshData);


  const [isEditTodoModalOpen, setIsEditTodoModalOpen] = useState(false);
  const [selectedTodoTaskId, setSelectedTodoTaskId] = useState<number | null>(null);
  const [selectedToRemoveTodoTaskId, setSelectedToRemoveTodoTaskId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleOpenEditTodoModal = (todoTaskId?: number) => {
    if (!todoTaskId) return;
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

  const [searchText, setSearchText] = useState<string>('');
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
      setIsTyping(false); // Stop typing after debounce
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const filter: FilterTodoTasksViewModel = {
    pageNumber: paginationModel.page + 1,
    pageSize: paginationModel.pageSize,
    isDone: isDone,
    deadlineFrom: undefined,
    deadlineTo: deadlineTo ? deadlineTo.toISOString() : undefined,
    todoTaskName: debouncedSearchText,
    sortBy: sortBy ? sortBy : 'TodoTaskId',
    sortDirection: sortDirection,
  };

  const { data: todos = { items: [], totalPages: 0, totalCount: 0 }, error, isLoading, refetch } =
    useGetTodoTasksQuery(filter);
  const [toggleIsDoneTodoTask] = useToggleIsDoneTodoTaskMutation();
  const [deleteTodoTask] = useDeleteTodoTaskMutation();

  useEffect(() => {
    refetch();
  }, [refetch, refreshData]);

  const handleToggle = async (id?: number) => {
    if (!id) return;
    try {
      await toggleIsDoneTodoTask(id).unwrap();
      setOpenSnackBar(true);
      refetch();
    } catch (err) {
      console.error('Failed to toggle todo', err);
    }
  };

  const handleDeleteConfirm = async (id?: number) => {
    if (!id) return;
    setSelectedToRemoveTodoTaskId(id);
    setOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedToRemoveTodoTaskId) return;
    try {
      await deleteTodoTask(selectedToRemoveTodoTaskId).unwrap();
      refetch();
      setOpen(false);
      setOpenSnackBar(true);
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

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setIsTyping(true); // Start typing
  };



  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };


  //snack bar
  const [openSnackBar, setOpenSnackBar] = React.useState(false);


  const handleSnackBarClick = () => {
    setOpenSnackBar(true);
  };

  const handleSnackBarClose = () => {
    setOpenSnackBar(false);
  };
  //____________________________



  return (
    <>
      <TextField
        label="Search TODO"
        value={searchText}
        onChange={handleSearchInputChange}
        variant="outlined"
        fullWidth
        margin="normal"
      />
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
                  <Checkbox checked={todo.isDone} onChange={() => handleToggle(todo.todoTaskId)} />
                </TableCell>
                <TableCell>{todo.todoTaskName}</TableCell>
                <TableCell>
                  {todo.deadline ? format(new Date(todo.deadline), 'Pp', { locale: de }) : 'No'}
                </TableCell>
                <TableCell>
                  <Button variant="text" color="primary" onClick={() => handleOpenEditTodoModal(todo.todoTaskId)}>
                    <EditIcon />
                  </Button>
                  <Button variant="text" color="primary" onClick={() => handleDeleteConfirm(todo.todoTaskId)}>
                    <DeleteForeverIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {(isTyping) && <LinearProgress variant="determinate"/>}

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


      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this TODO?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            No
          </Button>
          <Button onClick={handleDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      

      <div>
        <Button onClick={handleSnackBarClick}>Open Snackbar</Button>
        <Snackbar open={openSnackBar} autoHideDuration={1000} onClose={handleSnackBarClose}>
          <Alert
            onClose={handleSnackBarClose}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            This is a success Alert inside a Snackbar!
          </Alert>
        </Snackbar>
      </div>





    </>
  );
};

export default TodosTable;
