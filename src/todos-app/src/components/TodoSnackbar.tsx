import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { TodosState } from '../redux/TodosState'; // Adjust this path and type based on your actual setup

const TodoSnackbar: React.FC = () => {
  // Access the showSnackbarMessage state from the Redux store
  const showSnackbarMessage = useSelector((state: { todos: TodosState }) => state.todos.showSnackbarMessage);

  const [openSnackBar, setOpenSnackBar] = useState(false);

  // Trigger Snackbar when showSnackbarMessage changes
  useEffect(() => {
    if (showSnackbarMessage) {
      setOpenSnackBar(true);
    }
  }, [showSnackbarMessage]);

  const handleSnackBarClose = () => {
    setOpenSnackBar(false);
  };

  return (
    <Snackbar
      open={openSnackBar}
      autoHideDuration={1500}
      onClose={handleSnackBarClose}
    >
      <Alert
        onClose={handleSnackBarClose}
        severity="success"
        variant="filled"
        sx={{ width: '100%' }}
      >
        {showSnackbarMessage}
      </Alert>
    </Snackbar>
  );
};

export default TodoSnackbar;