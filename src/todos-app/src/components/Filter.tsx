import React, { useState } from 'react';
import { TextField, Box, Button, Modal, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useAppDispatch } from '../redux/hooks';
//import { filterTodos } from '../redux/todosSlice';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import de from 'date-fns/locale/de';

const Filter: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const dispatch = useAppDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFilter = () => {
    //dispatch(filterTodos({ name, fromDate, toDate }));
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        <FilterAltIcon/>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Filter Todos
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
            <Box sx={{ mt: 2 }}>
              <TextField label="Task Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth margin="normal" />
              <DateTimePicker
                label="Deadline From"
                value={fromDate}
                onChange={setFromDate}
                views={['year', 'month', 'day', 'hours', 'minutes']}
                renderInput={(props) => <TextField {...props} fullWidth margin="normal" />}
              />
              <DateTimePicker
                label="Deadline To"
                value={toDate}
                onChange={setToDate}
                views={['year', 'month', 'day', 'hours', 'minutes']}
                renderInput={(props) => <TextField {...props} fullWidth margin="normal" />}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button onClick={handleClose} variant="outlined" color="secondary">
                  Cancel
                </Button>
                <Button onClick={handleFilter} variant="contained" color="primary">
                  Apply Filter
                </Button>
              </Box>
            </Box>
          </LocalizationProvider>
        </Box>
      </Modal>
    </div>
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

export default Filter;