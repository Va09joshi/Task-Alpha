"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
} from '@mui/material';
import { Task } from '../services/api';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  taskToEdit?: Task | null;
}

export default function TaskModal({ open, onClose, onSave, taskToEdit }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setPriority(taskToEdit.priority);
      setCompleted(taskToEdit.completed);
    } else {
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setCompleted(false);
    }
  }, [taskToEdit, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, priority, completed });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{taskToEdit ? 'Edit Task' : 'Add New Task'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Task Title"
              variant="outlined"
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                label="Priority"
                onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                  color="primary"
                />
              }
              label="Mark as completed"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: 'rgba(0,0,0,0.6)' }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ 
            backgroundColor: '#1a73e8',
            boxShadow: '0 4px 10px rgba(26, 115, 232, 0.3)',
            '&:hover': { backgroundColor: '#1557b0' }
          }}>
            Save Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
