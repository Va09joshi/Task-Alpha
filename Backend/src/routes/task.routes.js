const express = require('express');
const Joi = require('joi');
const taskController = require('../controllers/task.controller');
const validate = require('../middleware/validate');

const router = express.Router();

const taskSchema = Joi.object({
    title: Joi.string().required().messages({
        'string.empty': 'Title is required'
    }),
    description: Joi.string().allow('').optional(),
    completed: Joi.boolean().optional(),
    priority: Joi.string().valid('Low', 'Medium', 'High').optional()
});

const updateTaskSchema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().allow('').optional(),
    completed: Joi.boolean().optional(),
    priority: Joi.string().valid('Low', 'Medium', 'High').optional()
});

router.route('/')
    .get(taskController.getAllTasks)
    .post(validate(taskSchema), taskController.createTask);

router.route('/:id')
    .get(taskController.getTaskById)
    .put(validate(updateTaskSchema), taskController.updateTask)
    .delete(taskController.deleteTask);

module.exports = router;
