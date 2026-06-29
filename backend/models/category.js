import { query } from '../database/db.js';

export async function findAll() {
  return await query('SELECT * FROM category ORDER BY name');
}

export async function findById(id) {
  const rows = await query('SELECT * FROM category WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function create(name, color) {
  const result = await query(
    'INSERT INTO category (name, color) VALUES (?, ?)',
    [name, color || '#6366f1']
  );
  return { id: result.insertId, name, color: color || '#6366f1' };
}

export async function update(id, name, color) {
  await query(
    'UPDATE category SET name = ?, color = ? WHERE id = ?',
    [name, color, id]
  );
  return await findById(id);
}

export async function remove(id) {
  await query('DELETE FROM category WHERE id = ?', [id]);
}
