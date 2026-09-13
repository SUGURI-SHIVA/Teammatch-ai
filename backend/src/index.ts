import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import projectRoutes from './routes/project';
import matchRoutes from './routes/match';
import invitationRoutes from './routes/invitation';
import joinRequestRoutes from './routes/joinRequest';
import notificationRoutes from './routes/notification';
import discoveryRoutes from './routes/discovery';

dotenv.config();

export const prisma = new PrismaClient();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/recommendations', discoveryRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/join-requests', joinRequestRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'TeamMatch AI Backend is running' });
});

const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TeamMatch AI running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
