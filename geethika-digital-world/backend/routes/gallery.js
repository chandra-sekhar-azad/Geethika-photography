import express from 'express';
import Gallery from '../models/Gallery.js';
import AuditLog from '../models/AuditLog.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Get all gallery images (public)
router.get('/', async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const images = await Gallery.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.json({ images: images.map(i => ({ ...i, id: i._id })) });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

// Upload gallery image (admin only)
router.post('/', authenticate, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category = 'general' } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Image file is required' });

    const imageUrl = `/uploads/${req.file.filename}`;

    const image = await Gallery.create({
      title,
      description,
      image_url: imageUrl,
      category,
      uploaded_by: req.user?.id,
    });

    await AuditLog.create({
      admin_id: req.user?.id,
      admin_email: req.user?.email,
      admin_name: req.user?.name,
      action: 'create',
      entity_type: 'gallery',
      entity_id: String(image._id),
      entity_name: title,
      ip_address: req.ip,
      user_agent: req.get('user-agent'),
    }).catch(() => {});

    res.status(201).json({ message: 'Image uploaded successfully', image });
  } catch (error) {
    console.error('Upload gallery image error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Update gallery image (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const image = await Gallery.findByIdAndUpdate(
      req.params.id,
      { ...(title && { title }), ...(description !== undefined && { description }), ...(category && { category }) },
      { new: true }
    );
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json({ message: 'Image updated successfully', image });
  } catch (error) {
    console.error('Update gallery image error:', error);
    res.status(500).json({ error: 'Failed to update image' });
  }
});

// Delete gallery image (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ error: 'Image not found' });
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete gallery image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
