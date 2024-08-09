import React, { useEffect, useState } from 'react';
import { Box, Modal, Typography, Button } from '@mui/material';
import { useUpdateTodoTaskMutation, useGetTodoTaskQuery } from '../services/todoApi';
import { useDispatch } from 'react-redux';
import { updateTodo } from '../redux/todosSlice';
import TodoForm from './TodoForm';
import { Todo } from '../interfaces/Todo';

interface EditTodoModalProps {
  isOpen: boolean;
  handleClose: () => void;
  todoTaskId: number;
  refetch: () => void;
}

const EditTodoModal: React.FC<EditTodoModalProps> = ({ isOpen, handleClose, todoTaskId, refetch }) => {
  const dispatch = useDispatch();

  const [todoTaskName, setTodoTaskName] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const { data: task } = useGetTodoTaskQuery(todoTaskId);
  const [updateTodoTask, { isLoading: isUpdating, error: updateError }] = useUpdateTodoTaskMutation();

  useEffect(() => {
    if (task) {
      setTodoTaskName(task.todoTaskName);
      setDeadline(task.deadline ? new Date(task.deadline) : null);
    }
  }, [task]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const updatedTodo: Todo = {
        todoTaskId,
        todoTaskName,
        deadline: deadline ? deadline.toISOString() : undefined,
        isDone: task?.isDone || false,
      };

      await updateTodoTask(updatedTodo).unwrap();
      dispatch(updateTodo(updatedTodo));
      handleClose();
      refetch(); // Refetch the tasks after updating
    } catch (err) {
      console.error('Failed to update the task:', err);
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
          Edit Todo Task
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
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
          {updateError && <Typography color="error">{updateError.toString()}</Typography>}
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

export default EditTodoModal;
