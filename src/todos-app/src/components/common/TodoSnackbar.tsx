import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { TodosState } from '../../redux/interfaces/TodosState';

const TodoSnackbar: React.FC = () => {
  const todoSnackbarState = useSelector((state: { todos: TodosState }) => state.todos.todoSnackbarState);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  useEffect(() => {
    if (todoSnackbarState && todoSnackbarState.message) {
      setOpenSnackBar(true);
    }
  }, [todoSnackbarState]);

  const handleSnackBarClose = () => {
    setOpenSnackBar(false);
  };

  return (
    <Snackbar
      open={openSnackBar}
      autoHideDuration={2000}
      onClose={handleSnackBarClose}
    >
      <Alert
        onClose={handleSnackBarClose}
        severity={todoSnackbarState.alertSeverity}
        sx={{ width: '100%' }}
      >
        {todoSnackbarState.message}
      </Alert>
    </Snackbar>
  );
};

export default TodoSnackbar;