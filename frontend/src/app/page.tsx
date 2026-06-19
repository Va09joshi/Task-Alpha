"use client";

import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Button, IconButton, Box, 
  CircularProgress, LinearProgress, Paper
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
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
  const handleOpenEdit = (task: Task) => { setEditingTask(task); setModalOpen(true); };

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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        showSnackbar('Task deleted successfully');
        loadTasks();
      } catch (error) {
        showSnackbar('Failed to delete task', 'error');
      }
    }
  };

  const handleToggleStatus = async (task: Task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
      loadTasks();
    } catch (error) {
      showSnackbar('Failed to update status', 'error');
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercentage = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header Area */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, color: '#1a73e8' }}>
            My Tasks
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 1 }}>
            Manage your daily goals simply.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          size="large"
          sx={{ 
            borderRadius: '2rem', px: 4, py: 1.5,
            backgroundColor: '#1a73e8',
            boxShadow: '0 4px 10px rgba(26, 115, 232, 0.3)',
            textTransform: 'none', fontWeight: 'bold', fontSize: '1rem',
            '&:hover': { backgroundColor: '#1557b0', transform: 'scale(1.02)' },
            transition: 'all 0.3s'
          }}
        >
          New Task
        </Button>
      </Box>

      {/* Progress Bar Area */}
      <Box sx={{ mb: 5, background: '#ffffff', p: 3, borderRadius: '1rem', border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1a73e8' }}>Overall Progress</Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1a73e8' }}>{progressPercentage}%</Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progressPercentage} 
          sx={{ 
            height: 10, borderRadius: 5, backgroundColor: '#f1f3f4',
            '& .MuiLinearProgress-bar': { backgroundColor: '#1a73e8', borderRadius: 5 }
          }} 
        />
      </Box>

      {/* Main List Area */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 8, background: '#ffffff', borderRadius: '1rem', border: '1px solid #e0e0e0' }}>
            <CircularProgress sx={{ color: '#1a73e8' }} />
          </Box>
        ) : tasks.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 8, background: '#ffffff', borderRadius: '1rem', border: '1px solid #e0e0e0' }}>
            <Typography variant="h5" sx={{ color: 'rgba(0,0,0,0.6)', mb: 2 }}>You have no tasks pending.</Typography>
            <Typography variant="body1" sx={{ color: 'rgba(0,0,0,0.4)' }}>Click 'New Task' to get started!</Typography>
          </Box>
        ) : (
          tasks.map((task) => (
            <Paper 
              key={task.id} 
              elevation={0} 
              sx={{ 
                p: 2.5, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                borderRadius: '1rem',
                border: '1px solid #e0e0e0',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                <IconButton onClick={() => handleToggleStatus(task)} sx={{ color: task.completed ? '#10b981' : 'rgba(0,0,0,0.2)' }}>
                  {task.completed ? <CheckCircle /> : <RadioButtonUnchecked />}
                </IconButton>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: task.completed ? 400 : 600, color: task.completed ? '#64748b' : '#0f172a', textDecoration: task.completed ? 'line-through' : 'none' }}>
                    {task.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)', maxWidth: { xs: 200, sm: 400, md: 600 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {task.description || 'No description'}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
                <Box>
                  <IconButton onClick={() => handleOpenEdit(task)} sx={{ color: '#1a73e8', '&:hover': { background: 'rgba(26, 115, 232, 0.1)' } }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(task.id)} sx={{ color: '#ef4444', '&:hover': { background: 'rgba(239, 68, 68, 0.1)' } }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          ))
        )}
      </Box>

      <TaskModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSaveTask} taskToEdit={editingTask} />
      <TaskSnackbar open={snackbar.open} message={snackbar.message} severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} />
    </Container>
  );
}
