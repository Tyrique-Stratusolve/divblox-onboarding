import { query } from '../database/db.js';

export async function findByUsername(username) {
  const rows = await query('SELECT * FROM user WHERE username = ?', [username]);
  return rows[0] || null;
}

export async function findById(id) {
  const rows = await query('SELECT id, FirstName, LastName, username FROM user WHERE id = ?', [id]);
  return rows[0] || null;
}

export async function create(firstName, lastName, username, password) {
  const result = await query(
    'INSERT INTO user (FirstName, LastName, username, password) VALUES (?, ?, ?, ?)',
    [firstName, lastName, username, password]
  );
  return { id: result.insertId, firstName, lastName, username };
}

export async function getRoles(userId) {
  return await query(
    `SELECT r.name FROM user_role_link url
     JOIN role r ON r.id = url.role_id
     WHERE url.user_id = ?`,
    [userId]
  );
}

export async function assignRole(userId, roleName) {
  const roleRows = await query('SELECT id FROM role WHERE name = ?', [roleName]);
  if (roleRows.length === 0) throw new Error(`Role '${roleName}' not found`);
  await query(
    'INSERT IGNORE INTO user_role_link (user_id, role_id) VALUES (?, ?)',
    [userId, roleRows[0].id]
  );
}
