import crypto from 'crypto';
import { query } from '../database/db.js';
import { findById } from './user.js';

const SESSION_DURATION_HOURS = 24;

export function extractId(request) {
  return request.headers.cookie?.split(';')
    .find(c => c.trim().startsWith('session_id='))
    ?.split('=')[1]
    ?.trim() || null;
}

export function generateId() {
  return crypto.randomBytes(48).toString('hex');
}

export async function create(userId) {
  const id = generateId();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000);

  await query(
    'INSERT INTO session (id, user_id, expires_at) VALUES (?, ?, ?)',
    [id, userId, expiresAt]
  );

  return { id, userId, expiresAt };
}

export async function findSession(sessionId) {
  const rows = await query('SELECT * FROM session WHERE id = ?', [sessionId]);
  return rows[0] || null;
}

export async function remove(sessionId) {
  await query('DELETE FROM session WHERE id = ?', [sessionId]);
}

export async function removeAllForUser(userId) {
  await query('DELETE FROM session WHERE user_id = ?', [userId]);
}
