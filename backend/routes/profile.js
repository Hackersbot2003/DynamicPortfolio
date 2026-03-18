import express from 'express';
import Profile from '../models/Profile.js';
import { protect } from '../middleware/auth.js';
import { upload, uploadToCloudinary } from '../middleware/upload.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({});
    res.json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/', protect, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();
    Object.assign(profile, req.body);
    await profile.save();
    res.json(profile);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/avatar', protect, upload.single('image'), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.buffer, 'portfolio/avatars');
    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();
    profile.avatar = result.secure_url;
    await profile.save();
    res.json({ avatar: result.secure_url });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
