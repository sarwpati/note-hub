import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const requestLimiter = (req, res, next) => {
  const clientKey = req.ip || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 120;

  if (!global.__requestTracker) {
    global.__requestTracker = new Map();
  }

  const tracker = global.__requestTracker;
  const current = tracker.get(clientKey) || [];
  const recent = current.filter((timestamp) => now - timestamp < windowMs);

  if (recent.length >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again shortly.',
    });
  }

  recent.push(now);
  tracker.set(clientKey, recent);
  next();
};

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(requestLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
