import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import routes from './routes/index.js';
import { deserializeUser } from './middleware/auth.js';
import { errorHandler } from './middleware/error.js';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
  })
);
app.use(deserializeUser);

app.get('/', (_req, res) => {
  res.json({
    service: 'ai-resume-builder-api',
    status: 'ok',
    docs: '/api',
    health: '/health',
  });
});
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);
app.use(errorHandler);

export default app;
