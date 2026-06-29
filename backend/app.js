import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import categoryRoutes from './routes/categories.js';

const app = express();
const PORT = 3000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);

app.use((request, response) => {
  response.status(404).json({ error: 'Route not found' });
});

app.use((error, request, response, next) => {
  console.error('Unhandled error:', error);
  response.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
