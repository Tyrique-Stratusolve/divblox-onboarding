import { query } from '../database/db.js';

function shapeTask(row) {
  return {
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    description: row.description,
    done: row.done,
    created_at: row.created_at,
    updated_at: row.updated_at,
    category: row.category_id ? {
      id: row.category_id,
      name: row.category_name,
      color: row.category_color,
    } : null,
  };
}

export async function findByUser(userId, categoryId = null) {
  let sql = `
    SELECT t.*, c.id AS category_id, c.name AS category_name, c.color AS category_color
    FROM task t
    LEFT JOIN category c ON c.id = t.category_id
    WHERE t.user_id = ?
  `;
  const params = [userId];

  if (categoryId) {
    sql += ` AND t.category_id = ?`;
    params.push(categoryId);
  }

  sql += ` ORDER BY t.created_at DESC`;
  const rows = await query(sql, params);
  return rows.map(shapeTask);
}

export async function findById(taskId, userId) {
  const rows = await query(
    `SELECT t.*, c.id AS category_id, c.name AS category_name, c.color AS category_color
     FROM task t
     LEFT JOIN category c ON c.id = t.category_id
     WHERE t.id = ? AND t.user_id = ?`,
    [taskId, userId]
  );
  return rows[0] ? shapeTask(rows[0]) : null;
}

export async function create(userId, title, description, categoryId) {
  const result = await query(
    'INSERT INTO task (user_id, title, description, category_id) VALUES (?, ?, ?, ?)',
    [userId, title, description, categoryId || null]
  );
  return await findById(result.insertId, userId);
}

export async function update(taskId, userId, fields) {
  const sets = [];
  const params = [];

  if (fields.title !== undefined) { sets.push('title = ?'); params.push(fields.title); }
  if (fields.description !== undefined) { sets.push('description = ?'); params.push(fields.description); }
  if (fields.done !== undefined) { sets.push('done = ?'); params.push(fields.done); }
  if (fields.category_id !== undefined) { sets.push('category_id = ?'); params.push(fields.category_id || null); }

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
