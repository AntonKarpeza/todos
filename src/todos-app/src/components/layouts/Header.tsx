import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import ListIcon from '@mui/icons-material/List';

const Header: React.FC = () => (
  <AppBar position="static">
    <Toolbar>
      <ListIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      <Typography variant="h6">TODOs</Typography>
    </Toolbar>
  </AppBar>
);

export default Header;