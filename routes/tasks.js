const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

let tasks = [];
let currentId = 1;

// Middleware to handle validation errors
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Retrieve all tasks
router.get('/', (req, res) => {
  res.json(tasks);
});

// Create a new task
router.post(
  '/',
  [
    body('title').isString().isLength({ min: 1 }).trim().escape(),
    body('description').isString().isLength({ min: 1 }).trim().escape(),
    body('dueDate').isISO8601().toDate()
  ],
  handleValidationErrors,
  (req, res) => {
    const task = {
      id: currentId++,
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      completed: req.body.completed || false
    };
    tasks.push(task);
    res.status(201).json(task);
  }
);

// Retrieve a single task by its ID
router.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

// Update an existing task by its ID
router.put(
  '/:id',
  [
    body('title').optional().isString().isLength({ min: 1 }).trim().escape(),
    body('description').optional().isString().isLength({ min: 1 }).trim().escape(),
    body('dueDate').optional().isISO8601().toDate()
  ],
  handleValidationErrors,
  (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.title = req.body.title !== undefined ? req.body.title : task.title;
    task.description = req.body.description !== undefined ? req.body.description : task.description;
    task.dueDate = req.body.dueDate !== undefined ? req.body.dueDate : task.dueDate;
    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;

    res.json(task);
  }
);

// Delete a task by its ID
router.delete('/:id', (req, res) => {
  const taskIndex = tasks.findIndex(t => t.id === parseInt(req.params.id));
  if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

  tasks.splice(taskIndex, 1);
  res.status(204).end();
});

module.exports = router;
