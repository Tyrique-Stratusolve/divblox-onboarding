import { Router } from 'express';
import * as Task from '../models/task.js';
import { requireAuth } from '../middleware/auth.js';
import { wrapRoute } from '../lib/wrap-route.js';

const router = Router();

router.use(requireAuth);

router.get('/', wrapRoute(async (request, response) => {
  const categoryId = request.query.category_id
    ? Number(request.query.category_id)
    : null;
  const tasks = await Task.findByUser(request.userId, categoryId);
  response.json(tasks);
}, 'Failed to fetch tasks'));

router.post('/', wrapRoute(async (request, response) => {
  const { title, description, category_id } = request.body;
  if (!title || !title.trim()) {
    return response.status(400).json({ error: 'Title is required' });
  }

  const task = await Task.create(
    request.userId,
    title.trim(),
    description?.trim() || '',
    category_id || null
  );

  response.status(201).json({ message: 'Task created', task });
}, 'Failed to create task'));

router.patch('/:id', wrapRoute(async (request, response) => {
  const taskId = Number(request.params.id);
  const existing = await Task.findById(taskId, request.userId);
  if (!existing) {
    return response.status(404).json({ error: 'Task not found' });
  }

  const { title, description, done, category_id } = request.body;
  const updates = {};
  if (title !== undefined) updates.title = title.trim();
  if (description !== undefined) updates.description = description.trim();
  if (done !== undefined) updates.done = done ? 1 : 0;
  if (category_id !== undefined) updates.category_id = category_id;

  const task = await Task.update(taskId, request.userId, updates);
  response.json({ message: 'Task updated', task });
}, 'Failed to update task'));

router.delete('/:id', wrapRoute(async (request, response) => {
  const taskId = Number(request.params.id);
  const existing = await Task.findById(taskId, request.userId);
  if (!existing) {
    return response.status(404).json({ error: 'Task not found' });
  }

  await Task.remove(taskId, request.userId);
  response.json({ message: 'Task deleted' });
}, 'Failed to delete task'));

export default router;
