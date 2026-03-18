import mongoose from 'mongoose';

const platformSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, default: '' },
  color: { type: String, default: '#6366f1' },
  showHeatmap: { type: Boolean, default: false },
  showStats: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Platform', platformSchema);
