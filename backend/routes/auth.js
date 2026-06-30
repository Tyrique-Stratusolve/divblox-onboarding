import { Router } from 'express';
import bcrypt from 'bcrypt';
import * as User from '../models/user.js';
import * as Session from '../models/session.js';
import { requireAuth } from '../middleware/auth.js';
import { wrapRoute } from '../lib/wrap-route.js';

const router = Router();

router.post('/signup', wrapRoute(async (request, response) => {
  const { firstName, lastName, username, password } = request.body;

  if (!firstName || !lastName || !username || !password) {
    return response.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return response.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const existing = await User.findByUsername(username);
  if (existing) {
    return response.status(409).json({ error: 'Username already taken' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create(firstName, lastName, username, hashed);
  await User.assignRole(user.id, 'user');

  const session = await Session.create(user.id);
  response.setHeader('Set-Cookie', `session_id=${session.id}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${24 * 60 * 60}`);
  response.status(201).json({ message: 'Account created', user: { id: user.id, firstName: user.firstName, lastName: user.lastName, username: user.username, roles: ['user'] } });
}, 'Signup failed'));

router.post('/login', wrapRoute(async (request, response) => {
  const { username, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({ error: 'Username and password required' });
  }

  const user = await User.findByUsername(username);
  if (!user) {
    return response.status(401).json({ error: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return response.status(401).json({ error: 'Invalid credentials' });
  }

  const session = await Session.create(user.id);
  const roles = await User.getRoles(user.id);

  response.setHeader('Set-Cookie', `session_id=${session.id}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${24 * 60 * 60}`);
  response.json({ user: { id: user.id, firstName: user.FirstName, lastName: user.LastName, username: user.username, roles: roles.map(r => r.name) } });
}, 'Login failed'));

router.get('/me', requireAuth, wrapRoute(async (request, response) => {
  const user = await User.findById(request.userId);
  const roles = await User.getRoles(request.userId);
  response.json({
    id: user.id,
    firstName: user.FirstName,
    lastName: user.LastName,
    username: user.username,
    roles: roles.map(r => r.name),
  });
}, 'Failed to fetch user'));

router.post('/logout', wrapRoute(async (request, response) => {
  const sessionId = Session.extractId(request);

  if (sessionId) {
    await Session.remove(sessionId);
  }

  response.setHeader('Set-Cookie', 'session_id=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
  response.json({ message: 'Logged out' });
}, 'Logout failed'));

export default router;
