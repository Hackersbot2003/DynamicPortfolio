import express from 'express';
import Experience from '../models/Experience.js';
import { protect } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../middleware/upload.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, upload.single('companyIcon'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.companyIcon = (await uploadToCloudinary(req.file.buffer, 'portfolio/icons')).secure_url;
    if (typeof data.techStack === 'string') data.techStack = JSON.parse(data.techStack);
    if (typeof data.points === 'string') data.points = JSON.parse(data.points);
    const item = await Experience.create(data);
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', protect, upload.single('companyIcon'), async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.companyIcon = (await uploadToCloudinary(req.file.buffer, 'portfolio/icons')).secure_url;
    if (typeof data.techStack === 'string') data.techStack = JSON.parse(data.techStack);
    if (typeof data.points === 'string') data.points = JSON.parse(data.points);
    const item = await Experience.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
