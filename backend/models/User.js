import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, trim: true },
  role: { type: String, enum: ['customer', 'admin', 'super_admin'], default: 'customer' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
