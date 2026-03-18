import express from 'express';
import Blog from '../models/Blog.js';
import { protect } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../middleware/upload.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const query = req.query.all === 'true' ? {} : { published: true };
    const items = await Blog.find(query).sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, upload.single('coverImage'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.coverImage = (await uploadToCloudinary(req.file.buffer, 'portfolio/blogs')).secure_url;
    if (typeof data.platforms === 'string') data.platforms = JSON.parse(data.platforms);
    const item = await Blog.create(data);
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, upload.single('coverImage'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.coverImage = (await uploadToCloudinary(req.file.buffer, 'portfolio/blogs')).secure_url;
    if (typeof data.platforms === 'string') data.platforms = JSON.parse(data.platforms);
    const item = await Blog.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
