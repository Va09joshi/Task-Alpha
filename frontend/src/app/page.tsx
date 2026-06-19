"use client";

import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, IconButton, Box,
  CircularProgress, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Menu, MenuItem
} from '@mui/material';
import { Add as AddIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { fetchTasks, createTask, updateTask, deleteTask, Task } from '../services/api';
import TaskModal from '../components/TaskModal';
import TaskSnackbar from '../components/TaskSnackbar';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false, message: '', severity: 'success' as 'success' | 'error'
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTaskId, setMenuTaskId] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
    } catch (error) {
      showSnackbar('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenAdd = () => { setEditingTask(null); setModalOpen(true); };
  
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, taskId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuTaskId(taskId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTaskId(null);
  };

  const handleEditFromMenu = () => {
    const task = tasks.find(t => t.id === menuTaskId);
    if (task) {
      setEditingTask(task);
      setModalOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteFromMenu = async () => {
    if (menuTaskId && confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(menuTaskId);
        showSnackbar('Task deleted successfully');
        loadTasks();
      } catch (error) {
        showSnackbar('Failed to delete task', 'error');
      }
    }
    handleMenuClose();
  };

  const handleToggleStatusFromMenu = async () => {
    const task = tasks.find(t => t.id === menuTaskId);
    if (task) {
      try {
        await updateTask(task.id, { completed: !task.completed });
        loadTasks();
      } catch (error) {
        showSnackbar('Failed to update status', 'error');
      }
    }
    handleMenuClose();
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        showSnackbar('Task updated successfully');
      } else {
        await createTask(taskData);
        showSnackbar('Task created successfully');
      }
      setModalOpen(false);
      loadTasks();
    } catch (error) {
      showSnackbar('Failed to save task', 'error');
    }
  };

  const getStatusChipProps = (completed: boolean) => {
    if (completed) {
      return {
        label: 'COMPLETED',
        sx: { backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontWeight: 600, borderRadius: '4px' }
      };
    }
    return {
      label: 'PENDING',
      sx: { backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', fontWeight: 600, borderRadius: '4px' }
    };
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Header Area */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: '#333' }}>
          Tasks Data
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ 
            backgroundColor: '#1a73e8',
            boxShadow: 'none',
            textTransform: 'none', 
            fontWeight: 500,
            '&:hover': { backgroundColor: '#1557b0', boxShadow: 'none' },
          }}
        >
          Add Task
        </Button>
      </Box>

      {/* Main Table Area */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="tasks table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
              <TableCell sx={{ color: '#888', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.5px' }}>TITLE</TableCell>
              <TableCell sx={{ color: '#888', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.5px' }}>DESCRIPTION</TableCell>
              <TableCell sx={{ color: '#888', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.5px' }}>PRIORITY</TableCell>
              <TableCell sx={{ color: '#888', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.5px' }}>STATUS</TableCell>
              <TableCell align="right" sx={{ color: '#888', fontWeight: 600, fontSize: '0.75rem', letterSpacing: '0.5px' }}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                  <CircularProgress sx={{ color: '#1a73e8' }} />
                </TableCell>
              </TableRow>
            ) : tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 8, color: '#666' }}>
                  No tasks found.
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow
                  key={task.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: '#fafafa' } }}
                >
                  <TableCell component="th" scope="row" sx={{ fontWeight: 500, color: '#333' }}>
                    {task.title}
                  </TableCell>
                  <TableCell sx={{ color: '#555', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {task.description || '-'}
                  </TableCell>
                  <TableCell sx={{ color: '#333' }}>
                    {task.priority}
                  </TableCell>
                  <TableCell>
                    <Chip size="small" {...getStatusChipProps(task.completed)} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleMenuClick(e, task.id)}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Row Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        elevation={2}
      >
        <MenuItem onClick={handleToggleStatusFromMenu} sx={{ fontSize: '0.875rem' }}>Toggle Status</MenuItem>
        <MenuItem onClick={handleEditFromMenu} sx={{ fontSize: '0.875rem' }}>Edit Task</MenuItem>
        <MenuItem onClick={handleDeleteFromMenu} sx={{ fontSize: '0.875rem', color: '#ef4444' }}>Delete Task</MenuItem>
      </Menu>

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveTask} taskToEdit={editingTask} />
      <TaskSnackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} />
    </Container>
  );
}
