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
        <Toolbar disableGutters sx={{ minHeight: '60px', display: 'flex', justifyContent: 'center' }}>
          <AssignmentTurnedInIcon sx={{ color: '#1a73e8', mr: 1, fontSize: 28 }} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 700,
              color: '#1a73e8',
            }}
          >
            Tasks
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
