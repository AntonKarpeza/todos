import React, { useState } from 'react';
import AddTodoModal from './AddTodoModal';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Tab, Grid, Container, Tooltip } from '@mui/material';
import TodosTable from './TodosTable';
import TodoSnackbar from './common/TodoSnackbar';

const TodosContent: React.FC = () => {
  const [value, setValue] = React.useState('1');
  const [isAddTodoModalOpen, setIsAddTodoModalOpen] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleOpenAddTodoModal = () => {
    setIsAddTodoModalOpen(true);
  };

  const handleCloseAddTodoModal = () => {
    setIsAddTodoModalOpen(false);
  };

  return (
    <Container>
      <Box sx={{ flexGrow: 2, p: 1, m: 2 }}>
        <Grid container>
          <Grid item xs={11}>
          </Grid>
          <Grid item xs={1}>
            <Tooltip title="Add TODO" placement="right">
              <Button variant="contained" color="success" size="small" onClick={handleOpenAddTodoModal}>
                <AddIcon />
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>

      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} centered>
            <Tab label="All" value="1" />
            <Tab label="Active" value="2" />
            <Tab label="Expired" value="3" />
            <Tab label="Complited" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <TodosTable/>
        </TabPanel>
        <TabPanel value="2">
          <TodosTable isDone={false}/>
        </TabPanel>
        <TabPanel value="3">
          <TodosTable isDone={false} deadlineTo={new Date()}/>
        </TabPanel>
        <TabPanel value="4">
          <TodosTable isDone={true}/>
        </TabPanel>
      </TabContext>

      <AddTodoModal
        isOpen={isAddTodoModalOpen}
        handleClose={handleCloseAddTodoModal}
      />
      <TodoSnackbar/>
    </Container>
  );
};

export default TodosContent;