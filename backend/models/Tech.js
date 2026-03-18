import mongoose from 'mongoose';

const techSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Tech', techSchema);
