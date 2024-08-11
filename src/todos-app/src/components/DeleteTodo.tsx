import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDeleteTodoTaskMutation } from '../services/todoApi';
import { useDispatch } from 'react-redux';
import { deleteTodo, errorCaught } from '../redux/todosSlice';
import { AlertSeverity } from '../redux/enums/AlertSeverity';

interface DeleteTodoProps {
  todoTaskId?: number;
}

const DeleteTodo: React.FC<DeleteTodoProps> = ({ todoTaskId }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [deleteTodoTask] = useDeleteTodoTaskMutation();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    if (!todoTaskId) return;
    try {
      await deleteTodoTask(todoTaskId).unwrap();
      dispatch(deleteTodo({ message: "TODO has been successfully deleted", alertSeverity: AlertSeverity.Success }));
      handleClose();
    } catch (err) {
      dispatch(errorCaught({ message: "Failed to delete TODO", alertSeverity: AlertSeverity.Error }));
      handleClose();
    }
  };

  return (
    <>
      <Button variant="text" color="primary" onClick={handleOpen}>
        <DeleteForeverIcon />
      </Button>
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
          <Button onClick={handleClose} autoFocus>
            No
          </Button>
          <Button onClick={handleDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteTodo;
