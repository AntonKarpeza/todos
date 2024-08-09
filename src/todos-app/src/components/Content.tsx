import React, { useState } from 'react';
import TodosGrid from './TodosGrid';
import AddTodoModal from './AddTodoModal';
import Filter from './Filter';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Tab, Grid, Container } from '@mui/material';

const Content: React.FC = () => {
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
      <Box sx={{ flexGrow: 1, p: 1, m: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={10}></Grid>
          <Grid item xs={1}>
            <Button variant="contained" color="primary" onClick={handleOpenAddTodoModal}>
              <AddIcon />
            </Button>
          </Grid>
          <Grid item xs={1}>
            <Filter />
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
        <TabPanel value="1"><TodosGrid sortBy="TodoTaskId" sortDirection="desc"/></TabPanel>
        <TabPanel value="2"><TodosGrid isDone={false} sortBy="TodoTaskId" sortDirection="desc"/></TabPanel>
        <TabPanel value="3"><TodosGrid isDone={false} deadlineTo={new Date()}/></TabPanel>
        <TabPanel value="4"><TodosGrid isDone={true}/></TabPanel>
      </TabContext>

      <AddTodoModal
        isOpen={isAddTodoModalOpen}
        handleClose={handleCloseAddTodoModal}
      />
    </Container>
  );
};

export default Content;