import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import passport from 'passport';

import connectDB from './config/database';
import configureCloudinary from './config/cloudinary';
import configurePassport from './config/passport';

import authRoutes from './routes/authRoutes';
import uploadRoutes from './routes/uploadRoutes';
import deploymentRoutes from './routes/deploymentRoutes';

interface CustomHttpError extends Error {
  status?: number;
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true, // Required if using cookies or credentialed requests
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

void connectDB();
configureCloudinary();
configurePassport();
app.use(passport.initialize());

app.use('/auth', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/project', deploymentRoutes);

app.get('/health', (_req: Request, res: Response) => {
  res.send('okokok');
});

// Error handling middleware
app.use((err: CustomHttpError, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

const server = app.listen(PORT, () => {
  console.log(`\n API Server running on port ${PORT}`);
  console.log(` GitHub OAuth: ${process.env.GITHUB_CALLBACK_URL}`);
});

export default server;
