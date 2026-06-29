import { Router } from 'express';
import * as Category from '../models/category.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';

const router = Router();

router.get('/', async (request, response) => {
  try {
    const categories = await Category.findAll();
    response.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    response.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/', requireAuth, requireAdmin, async (request, response) => {
  try {
    const { name, colour } = request.body;
    if (!name || !name.trim()) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const category = await Category.create(name.trim(), colour);
    response.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    response.status(500).json({ error: 'Failed to create category' });
  }
});

router.patch('/:id', requireAuth, requireAdmin, async (request, response) => {
  try {
    const categoryId = Number(request.params.id);
    const existing = await Category.findById(categoryId);
    if (!existing) {
      return response.status(404).json({ error: 'Category not found' });
    }

    const { name, colour } = request.body;
    if (!name || !name.trim()) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const category = await Category.update(categoryId, name.trim(), colour);
    response.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    response.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/:id', requireAuth, requireAdmin, async (request, response) => {
  try {
    const categoryId = Number(request.params.id);
    const existing = await Category.findById(categoryId);
    if (!existing) {
      return response.status(404).json({ error: 'Category not found' });
    }

    await Category.remove(categoryId);
    response.status(204).end();
  } catch (error) {
    console.error('Delete category error:', error);
    response.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;
