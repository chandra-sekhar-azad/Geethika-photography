import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  icon: { type: String, default: null },
  image_url: { type: String, default: null },
  image_public_id: { type: String, default: null },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
