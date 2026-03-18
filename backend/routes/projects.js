import express from 'express';
import Project from '../models/Project.js';
import Category from '../models/Category.js';
import { protect } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../middleware/upload.js';

const router = express.Router();

// GET all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET all categories (public)
router.get('/categories', async (req, res) => {
  try {
    const cats = await Category.find().sort({ order: 1, name: 1 });
    res.json(cats);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST category (admin)
router.post('/categories', protect, async (req, res) => {
  try {
    const cat = await Category.create(req.body);
    res.status(201).json(cat);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE category (admin)
router.delete('/categories/:id', protect, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST project (admin)
router.post('/', protect, upload.array('photos', 5), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.length)
      data.photos = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer, 'portfolio/projects').then(r => r.secure_url)));
    if (typeof data.techStack === 'string') data.techStack = JSON.parse(data.techStack);
    if (typeof data.features === 'string') data.features = JSON.parse(data.features);
    if (typeof data.extraLinks === 'string') data.extraLinks = JSON.parse(data.extraLinks);
    // auto-create category if new
    if (data.topic) await Category.findOneAndUpdate({ name: data.topic }, { name: data.topic }, { upsert: true });
    const project = await Project.create(data);
    res.status(201).json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT project (admin)
router.put('/:id', protect, upload.array('photos', 5), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.length)
      data.photos = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer, 'portfolio/projects').then(r => r.secure_url)));
    if (typeof data.techStack === 'string') data.techStack = JSON.parse(data.techStack);
    if (typeof data.features === 'string') data.features = JSON.parse(data.features);
    if (typeof data.extraLinks === 'string') data.extraLinks = JSON.parse(data.extraLinks);
    if (data.topic) await Category.findOneAndUpdate({ name: data.topic }, { name: data.topic }, { upsert: true });
    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE project (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
