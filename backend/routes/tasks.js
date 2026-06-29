import { Router } from 'express';
import * as Task from '../models/task.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/', async (request, response) => {
  try {
    const categoryId = request.query.category_id || null;
    const tasks = await Task.findByUser(request.userId, categoryId);

    const result = await Promise.all(tasks.map(async task => {
      const categories = await Task.getCategories(task.id);
      return { ...task, categories };
    }));

    response.json(result);
  } catch (error) {
    console.error('Get tasks error:', error);
    response.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/', async (request, response) => {
  try {
    const { title, description, category_ids } = request.body;
    if (!title || !title.trim()) {
      return response.status(400).json({ error: 'Title is required' });
    }

    const task = await Task.create(request.userId, title.trim(), description?.trim() || '');
    if (category_ids && category_ids.length > 0) {
      await Task.setCategories(task.id, category_ids);
    }

    const categories = await Task.getCategories(task.id);
    response.status(201).json({ ...task, categories });
  } catch (error) {
    console.error('Create task error:', error);
    response.status(500).json({ error: 'Failed to create task' });
  }
});

router.patch('/:id', async (request, response) => {
  try {
    const taskId = Number(request.params.id);
    const existing = await Task.findById(taskId, request.userId);
    if (!existing) {
      return response.status(404).json({ error: 'Task not found' });
    }

    const { title, description, done, category_ids } = request.body;
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (done !== undefined) updates.done = done ? 1 : 0;

    const task = await Task.update(taskId, request.userId, updates);

    if (category_ids !== undefined) {
      await Task.setCategories(taskId, category_ids);
    }

    const categories = await Task.getCategories(taskId);
    response.json({ ...task, categories });
  } catch (error) {
    console.error('Update task error:', error);
    response.status(500).json({ error: 'Failed to update task' });
  }
});

router.delete('/:id', async (request, response) => {
  try {
    const taskId = Number(request.params.id);
    const existing = await Task.findById(taskId, request.userId);
    if (!existing) {
      return response.status(404).json({ error: 'Task not found' });
    }

    await Task.remove(taskId, request.userId);
    response.status(204).end();
  } catch (error) {
    console.error('Delete task error:', error);
    response.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
