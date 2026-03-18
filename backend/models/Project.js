import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String }],
  photos: [{ type: String }],
  techStack: [{ name: String, icon: String }],
  deployedLink: { type: String, default: '' },
  githubLink: { type: String, default: '' },
  extraLinks: [{ label: String, url: String }],
  topic: { type: String, default: 'Other' },
  status: { type: String, enum: ['completed', 'in-progress', 'archived'], default: 'completed' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
