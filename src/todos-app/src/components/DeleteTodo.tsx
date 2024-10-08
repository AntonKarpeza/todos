import React, { useState } from "react";
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Tooltip,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useDeleteTodoTaskMutation } from "../services/todoApi";
import { useDispatch } from "react-redux";
import { deleteTodo, errorCaught } from "../redux/todosSlice";
import { AlertSeverity } from "../redux/enums/AlertSeverity";

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
      dispatch(
        deleteTodo({
          message: "TODO has been successfully deleted",
          alertSeverity: AlertSeverity.Success,
        }),
      );
      handleClose();
    } catch (err) {
      dispatch(
        errorCaught({
          message: "Failed to delete TODO",
          alertSeverity: AlertSeverity.Error,
        }),
      );
      handleClose();
    }
  };

  return (
    <>
      <Tooltip title="Delete TODO" placement="right">
        <IconButton aria-label="delete" color="secondary" onClick={handleOpen}>
          <DeleteForeverIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this TODO?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>No</Button>
          <Button onClick={handleDelete} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteTodo;
