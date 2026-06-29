import { query } from '../database/db.js';

export async function findAll() {
  return await query('SELECT * FROM category ORDER BY name');
}

export async function findById(id) {
  const rows = await query('SELECT * FROM category WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function create(name, colour) {
  const result = await query(
    'INSERT INTO category (name, colour) VALUES (?, ?)',
    [name, colour || '#6366f1']
  );
  return { id: result.insertId, name, colour: colour || '#6366f1' };
}

export async function update(id, name, colour) {
  await query(
    'UPDATE category SET name = ?, colour = ? WHERE id = ?',
    [name, colour, id]
  );
  return await findById(id);
}

export async function remove(id) {
  await query('DELETE FROM category WHERE id = ?', [id]);
}
