import React, { useState } from 'react';
import { Box, Modal, Button, Typography } from '@mui/material';
import { useCreateTodoTaskMutation } from '../services/todoApi';
import { useDispatch } from 'react-redux';
import { addTodo, errorCaught } from '../redux/todosSlice';
import { TodoTaskViewModel } from '../interfaces/TodoTaskViewModel';
import TodoForm from './TodoForm';
import { AlertSeverity } from '../redux/enums/AlertSeverity';

interface AddTodoModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({ isOpen, handleClose }) => {
  const dispatch = useDispatch();
  const [todoTaskName, setTodoTaskName] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [createTodoTask, { isLoading: isCreating }] = useCreateTodoTaskMutation();
  const [isFormValid, setIsFormValid] = useState(false); 

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isFormValid) return;

    try {
      const newTodo: TodoTaskViewModel = {
        todoTaskName,
        deadline: deadline ? new Date(deadline.getTime() - (deadline.getTimezoneOffset() * 60000)).toISOString() : undefined,
      };

      await createTodoTask(newTodo).unwrap();

      dispatch(addTodo({message: "TODO has been successfully added", alertSeverity: AlertSeverity.Success}));
      cleanTodoForm();
      handleClose();
    } catch (err) {
      dispatch(errorCaught({message: "Failed to save TODO", alertSeverity: AlertSeverity.Error}));
    }
  };

  const cleanTodoForm = () => {
    setTodoTaskName('');
    setDeadline(null);
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box className="modal-todo-box">
        <Typography id="modal-title" variant="h6" component="h2">
          Add TODO
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
              {isCreating ? 'Saving...' : 'Add Todo'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddTodoModal;