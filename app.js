/**
 * Subscription Tracker API – Express app entry point.
 * Mounts auth, users, subscriptions, and workflow routes under /api/v1.
 * Uses Arcjet for rate limiting/bot protection and a central error handler.
 */
import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from './config/env.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import workflowRouter from './routes/workflow.routes.js'
import connectToDatabase from './database/mongodb.js'
import errorMiddleware from './middlewares/error.middleware.js'
import arcjetMiddleware from './middlewares/arcjet.middleware.js'

const app = express();

// Parse JSON and urlencoded bodies; enable cookie parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Apply rate limiting and bot detection to all requests before any route
app.use(arcjetMiddleware);

// API v1 routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

// Central error handler – must be last so it catches errors from any route
app.use(errorMiddleware);

// Simple health/welcome endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Subscription Tracker API!');
});

// Start server then connect to MongoDB (connection failure will exit process)
app.listen(PORT, async () => {
  console.log(`Subscription Tracker API is running on http://localhost:${PORT}`);

  await connectToDatabase();
});

export default app;