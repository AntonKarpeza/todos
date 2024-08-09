import React, { useState } from 'react';
import { Box, Modal, Button, Typography } from '@mui/material';
import { useCreateTodoTaskMutation } from '../services/todoApi';
import { useDispatch } from 'react-redux';
import { addTodo } from '../redux/todosSlice';
import { Todo } from '../interfaces/Todo';
import TodoForm from './TodoForm';

interface AddTodoModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({ isOpen, handleClose }) => {
  const dispatch = useDispatch();

  const [todoTaskName, setTodoTaskName] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [createTodoTask, { isLoading: isCreating, error: createError }] = useCreateTodoTaskMutation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const newTodo: Todo = {
        todoTaskName,
        deadline: deadline ? deadline.toISOString() : undefined,
        isDone: false,
      };

      const createdTodoTaskId = await createTodoTask(newTodo).unwrap();
      dispatch(addTodo({ ...newTodo, todoTaskId: createdTodoTaskId }));

      handleClose();
    } catch (err) {
      console.error('Failed to save the task:', err);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={{ ...style, width: 400 }}>
        <Typography id="modal-title" variant="h6" component="h2">
          Add Todo Task
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TodoForm
            todoTaskName={todoTaskName}
            setTodoTaskName={setTodoTaskName}
            deadline={deadline}
            setDeadline={setDeadline}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button onClick={handleClose} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {isCreating ? 'Saving...' : 'Add Todo'}
            </Button>
          </Box>
          {createError && <Typography color="error">{createError.toString()}</Typography>}
        </Box>
      </Box>
    </Modal>
  );
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default AddTodoModal;