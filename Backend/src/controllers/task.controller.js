const taskService = require('../services/task.service');

exports.getAllTasks = (req, res, next) => {
    try {
        const tasks = taskService.getAllTasks();
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

exports.getTaskById = (req, res, next) => {
    try {
        const task = taskService.getTaskById(req.params.id);
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

exports.createTask = (req, res, next) => {
    try {
        const newTask = taskService.createTask(req.body);
        res.status(201).json(newTask);
    } catch (error) {
        next(error);
    }
};

exports.updateTask = (req, res, next) => {
    try {
        const updatedTask = taskService.updateTask(req.params.id, req.body);
        res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

exports.deleteTask = (req, res, next) => {
    try {
        taskService.deleteTask(req.params.id);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};
