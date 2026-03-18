import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  topic: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  platforms: [{
    name: String,
    url: String,
    icon: String,
  }],
  publishedAt: { type: String, default: '' },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
