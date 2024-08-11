import React from 'react';
import { Checkbox } from '@mui/material';
import { useToggleIsDoneTodoTaskMutation } from '../services/todoApi';
import { useDispatch } from 'react-redux';
import { AlertSeverity } from '../redux/enums/AlertSeverity';
import { toggleIsDone } from '../redux/todosSlice';

interface ToggleTodoProps {
  todoTaskId?: number;
  isDone?: boolean;
}

const ToggleTodo: React.FC<ToggleTodoProps> = ({ todoTaskId, isDone }) => {
  const dispatch = useDispatch();
  const [toggleIsDoneTodoTask] = useToggleIsDoneTodoTaskMutation();

  const handleToggle = async () => {
    if (!todoTaskId) return;
    try {
      await toggleIsDoneTodoTask(todoTaskId).unwrap();
      dispatch(toggleIsDone({ message: 'TODO has been successfully changed', alertSeverity: AlertSeverity.Success }));
    } catch (err) {
      dispatch(toggleIsDone({ message: 'Failed to change TODO', alertSeverity: AlertSeverity.Error }));
    }
  };

  return <Checkbox checked={isDone} onChange={handleToggle} />;
};

export default ToggleTodo;