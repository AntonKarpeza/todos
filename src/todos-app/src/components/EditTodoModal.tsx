import React, { useEffect, useState } from 'react';
import { Box, Modal, Typography, Button } from '@mui/material';
import { useUpdateTodoTaskMutation, useGetTodoTaskQuery } from '../services/todoApi';
import TodoForm from './TodoForm';
import { TodoTaskViewModel } from '../interfaces/TodoTaskViewModel';
import { AlertSeverity } from '../redux/enums/AlertSeverity';
import { useDispatch } from 'react-redux';
import { editTodo, errorCaught } from '../redux/todosSlice';

interface EditTodoModalProps {
  isOpen: boolean;
  handleClose: () => void;
  todoTaskId: number;
}

const EditTodoModal: React.FC<EditTodoModalProps> = ({ isOpen, handleClose, todoTaskId }) => {
  const dispatch = useDispatch();
  const [todoTaskName, setTodoTaskName] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const { data: task, refetch  } = useGetTodoTaskQuery(todoTaskId);
  const [isFormValid, setIsFormValid] = useState(false);
  const [updateTodoTask, { isLoading: isUpdating }] = useUpdateTodoTaskMutation();

  useEffect(() => {
    if (isOpen && task) {
      refetch();
      setTodoTaskName(task.todoTaskName);
      setDeadline(task.deadline ? new Date(task.deadline) : null);
    }
  }, [isOpen, task, refetch]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isFormValid) return;

    try {
      const updatedTodo: TodoTaskViewModel = {
        todoTaskId,
        todoTaskName,
        deadline: deadline ? new Date(deadline.getTime() - (deadline.getTimezoneOffset() * 60000)).toISOString() : undefined
      };

      await updateTodoTask(updatedTodo).unwrap();

      dispatch(editTodo({message: "TODO has been successfully updated", alertSeverity: AlertSeverity.Success}));
      handleClose();
    } catch (err) {
      dispatch(errorCaught({message: "Failed to save TODO", alertSeverity: AlertSeverity.Error}));
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box className="modal-todo-box">
        <Typography id="modal-title" variant="h6" component="h2">
          Edit TODO
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TodoForm
            todoTaskName={todoTaskName}
            setTodoTaskName={setTodoTaskName}
            deadline={deadline}
            setDeadline={setDeadline}
            setIsFormValid={setIsFormValid}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={!isFormValid}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditTodoModal;