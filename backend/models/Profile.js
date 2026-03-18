import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: { type: String, default: 'Your Name' },
  title: { type: String, default: 'Full Stack Developer' },
  bio: { type: String, default: 'Hey, I am a Software Developer.' },
  location: { type: String, default: 'India' },
  email: { type: String, default: '' },
  avatar: { type: String, default: '' },
  resume: { type: String, default: '' },
  institution: { type: String, default: '' },
  institutionIcon: { type: String, default: '' },
  socials: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    leetcode: { type: String, default: '' },
    twitter: { type: String, default: '' },
    discord: { type: String, default: '' },
    codeforces: { type: String, default: '' },
    hackerrank: { type: String, default: '' },
    hackerearth: { type: String, default: '' },
  },
  skills: [{
    category: String,
    items: [{ name: String, icon: String }],
  }],
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
