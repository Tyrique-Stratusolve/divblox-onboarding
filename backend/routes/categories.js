import { Router } from 'express';
import * as Category from '../models/category.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/admin.js';
import { wrapRoute } from '../lib/wrap-route.js';

const router = Router();

router.get('/', wrapRoute(async (request, response) => {
  const categories = await Category.findAll();
  response.json(categories);
}, 'Failed to fetch categories'));

router.post('/', requireAuth, requireAdmin, wrapRoute(async (request, response) => {
  const { name, color } = request.body;
  if (!name || !name.trim()) {
    return response.status(400).json({ error: 'Name is required' });
  }

  const category = await Category.create(name.trim(), color);
  response.status(201).json({ message: 'Category created', category });
}, 'Failed to create category'));

router.patch('/:id', requireAuth, requireAdmin, wrapRoute(async (request, response) => {
  const categoryId = Number(request.params.id);
  const existing = await Category.findById(categoryId);
  if (!existing) {
    return response.status(404).json({ error: 'Category not found' });
  }

  const { name, color } = request.body;
  if (!name || !name.trim()) {
    return response.status(400).json({ error: 'Name is required' });
  }

  const category = await Category.update(categoryId, name.trim(), color);
  response.json({ message: 'Category updated', category });
}, 'Failed to update category'));

router.delete('/:id', requireAuth, requireAdmin, wrapRoute(async (request, response) => {
  const categoryId = Number(request.params.id);
  const existing = await Category.findById(categoryId);
  if (!existing) {
    return response.status(404).json({ error: 'Category not found' });
  }

  await Category.remove(categoryId);
  response.json({ message: 'Category deleted' });
}, 'Failed to delete category'));

export default router;
