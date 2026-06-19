"use client";

import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

export default function Navbar() {
  return (
    <AppBar position="sticky" sx={{ 
      background: 'rgba(255, 255, 255, 0.8)', 
      backdropFilter: 'blur(16px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
    }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: '70px' }}>
          <AssignmentTurnedInIcon sx={{ color: '#4f46e5', mr: 2, fontSize: 32 }} />
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              mr: 2,
              fontWeight: 800,
              letterSpacing: '-0.5px',
              color: '#1a73e8',
            }}
          >
            TaskFlow Pro
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </Container>
    </AppBar>
  );
}
