import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import projectRoutes from './routes/projects.js';
import experienceRoutes from './routes/experience.js';
import achievementRoutes from './routes/achievements.js';
import blogRoutes from './routes/blogs.js';
import platformRoutes from './routes/platforms.js';
import techRoutes from './routes/tech.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/tech', techRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected!');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`✅ Server running on http://localhost:${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error('❌ DB error:', err.message));
