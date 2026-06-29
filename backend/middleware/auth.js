import { extractId, findSession } from '../models/session.js';

export async function requireAuth(request, response, next) {
  try {
    const sessionId = extractId(request);

    if (!sessionId) {
      return response.status(401).json({ error: 'Authentication required' });
    }

    const session = await findSession(sessionId);

    if (!session) {
      return response.status(401).json({ error: 'Invalid or expired session' });
    }

    if (new Date(session.expires_at) < new Date()) {
      return response.status(401).json({ error: 'Session expired' });
    }

    request.userId = session.user_id;
    request.sessionId = sessionId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    response.status(500).json({ error: 'Authentication error' });
  }
}
