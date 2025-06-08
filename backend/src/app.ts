import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.route';
import planRoutes from './routes/plan.route';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(
  cors({
    origin: 'http://localhost:3000', // frontend URL
    credentials: true,
  })
);
// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);

// Default route
app.get('/', (_req, res) => {
  res.send('🏋️ Fitness Tracker API is running!');
});

// Optional: 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
