import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { de } from 'date-fns/locale';

interface TodoFormProps {
  todoTaskName: string;
  setTodoTaskName: (name: string) => void;
  deadline: Date | null;
  setDeadline: (date: Date | null) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ todoTaskName, setTodoTaskName, deadline, setDeadline }) => {
  const [nameError, setNameError] = useState<string | null>(null);
  const [deadlineError, setDeadlineError] = useState<string | null>(null);

  const validateName = (name: string) => {
    if (name.length < 10) {
      return "Task name must be at least 10 characters long.";
    }
    if (name.length > 450) {
      return "Task name must not exceed 450 characters.";
    }
    return null;
  };

  const validateDeadline = (date: Date | null) => {
    if (date && date < new Date()) {
      return "Deadline must be in the future.";
    }
    return null;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setTodoTaskName(name);
    setNameError(validateName(name));
  };

  const handleDeadlineChange = (date: Date | null) => {
    setDeadline(date);
    setDeadlineError(validateDeadline(date));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <TextField
        label="Task Name"
        value={todoTaskName}
        onChange={handleNameChange}
        fullWidth
        margin="normal"
        required
        inputProps={{ minLength: 10, maxLength: 450 }}
        error={Boolean(nameError)}
        helperText={nameError}
      />
      <DateTimePicker
        label="Deadline"
        value={deadline}
        onChange={handleDeadlineChange}
        renderInput={(params) => (
          <TextField 
            {...params} 
            fullWidth 
            margin="normal" 
            error={Boolean(deadlineError)}
            helperText={deadlineError}
          />
        )}
        minDateTime={new Date()}
      />
    </LocalizationProvider>
  );
};

export default TodoForm;