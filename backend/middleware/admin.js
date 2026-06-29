import { query } from '../database/db.js';

export async function requireAdmin(request, response, next) {
  try {
    const rows = await query(
      `SELECT r.name FROM user_role_link url
       JOIN role r ON r.id = url.role_id
       WHERE url.user_id = ?`,
      [request.userId]
    );

    const isAdmin = rows.some(row => row.name === 'admin');

    if (!isAdmin) {
      return response.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    response.status(500).json({ error: 'Authorization error' });
  }
}
