import { query } from '../database/db.js';

export async function findByUser(userId, categoryId = null) {
  let sql = `SELECT * FROM task WHERE user_id = ?`;
  const params = [userId];

  if (categoryId) {
    sql += ` AND id IN (SELECT task_id FROM task_category WHERE category_id = ?)`;
    params.push(categoryId);
  }

  sql += ` ORDER BY created_at DESC`;
  return await query(sql, params);
}

export async function findById(taskId, userId) {
  const rows = await query('SELECT * FROM task WHERE id = ? AND user_id = ?', [taskId, userId]);
  return rows[0] || null;
}

export async function create(userId, title, description) {
  const result = await query(
    'INSERT INTO task (user_id, title, description) VALUES (?, ?, ?)',
    [userId, title, description]
  );
  return { id: result.insertId, user_id: userId, title, description, done: 0 };
}

export async function update(taskId, userId, fields) {
  const sets = [];
  const params = [];

  if (fields.title !== undefined) { sets.push('title = ?'); params.push(fields.title); }
  if (fields.description !== undefined) { sets.push('description = ?'); params.push(fields.description); }
  if (fields.done !== undefined) { sets.push('done = ?'); params.push(fields.done); }

  if (sets.length === 0) return null;

  params.push(taskId, userId);
  await query(
    `UPDATE task SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`,
    params
  );

  return await findById(taskId, userId);
}

export async function remove(taskId, userId) {
  await query('DELETE FROM task WHERE id = ? AND user_id = ?', [taskId, userId]);
}

export async function setCategories(taskId, categoryIds) {
  await query('DELETE FROM task_category WHERE task_id = ?', [taskId]);
  if (categoryIds && categoryIds.length > 0) {
    const values = categoryIds.map(id => [taskId, id]);
    await query(
      'INSERT INTO task_category (task_id, category_id) VALUES ?',
      [values]
    );
  }
}

export async function getCategories(taskId) {
  return await query(
    `SELECT c.* FROM task_category tc
     JOIN category c ON c.id = tc.category_id
     WHERE tc.task_id = ?`,
    [taskId]
  );
}
