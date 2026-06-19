const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const TASKS_FILE = path.join(__dirname, '../../tasks.json');

const readTasks = () => {
    try {
        const data = fs.readFileSync(TASKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return [];
        }
        throw new Error('Failed to read tasks file');
    }
};

const writeTasks = (tasks) => {
    try {
        fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
    } catch (err) {
        throw new Error('Failed to write tasks file');
    }
};

exports.getAllTasks = () => {
    return readTasks();
};

exports.getTaskById = (id) => {
    const tasks = readTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
    }
    return task;
};

exports.createTask = (taskData) => {
    const tasks = readTasks();
    const newTask = {
        id: uuidv4(),
        title: taskData.title,
        description: taskData.description || '',
        completed: taskData.completed || false,
        priority: taskData.priority || 'Medium'
    };
    tasks.push(newTask);
    writeTasks(tasks);
    return newTask;
};

exports.updateTask = (id, taskData) => {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
    }

    const updatedTask = {
        ...tasks[taskIndex],
        ...taskData
    };

    tasks[taskIndex] = updatedTask;
    writeTasks(tasks);
    return updatedTask;
};

exports.deleteTask = (id) => {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex(t => t.id === id);
    
    if (taskIndex === -1) {
        const error = new Error('Task not found');
        error.statusCode = 404;
        throw error;
    }

    tasks.splice(taskIndex, 1);
    writeTasks(tasks);
};
