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
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { xss } from 'express-xss-sanitizer';
import mongoSanitize from 'express-mongo-sanitize';

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,               // limit each IP to 100 requests per window
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

// Parse JSON and urlencoded bodies; enable cookie parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(helmet());
app.use('/api/', apiLimiter);
// Apply rate limiting and bot detection to all requests before any route
app.use(arcjetMiddleware);

// API v1 routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

// Temporary routes for testing
app.get('/api/v1/test-rate-limit', (req, res) => {
  res.json({ ok: true });
});

app.post('/api/v1/xss-test', (req, res) => {
  res.json({
    body: req.body,
    query: req.query,
  });
});

// Central error handler – must be last so it catches errors from any route
app.use(errorMiddleware);

// Simple health/welcome endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Subscription Tracker API!');
});

// Start server then connect to MongoDB (connection failure will exit process)
app.listen(PORT || 3000, async () => {
  console.log(`Subscription Tracker API is running on http://localhost:${PORT || 3000}`);

  await connectToDatabase();
});

export default app;

//TODO: add helmet, rate limiters, XSS protection, sanitization (done)
//TODO: fix refresh token (done)