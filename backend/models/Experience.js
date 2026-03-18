import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  companyIcon: { type: String, default: '' },
  role: { type: String, required: true },
  duration: { type: String, default: '' },
  description: { type: String, default: '' },
  link: { type: String, default: '' },
  techStack: [{ name: String, icon: String }],
  points: [{ type: String }],
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Experience', experienceSchema);
