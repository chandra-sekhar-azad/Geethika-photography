import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const categorySchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  icon: String,
  image_url: { type: String, default: null },
  image_public_id: { type: String, default: null },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

const categories = [
  { name: 'Personalised Gifts',    slug: 'personalised-gifts',  icon: '🎁' },
  { name: 'Couple Gifts',          slug: 'couple-gifts',         icon: '💑' },
  { name: 'T-Shirts',              slug: 't-shirts',             icon: '👕' },
  { name: 'Plants',                slug: 'plants',               icon: '🌱' },
  { name: 'Photo Frames',          slug: 'photo-frames',         icon: '🖼️' },
  { name: 'Printing Works',        slug: 'printing-works',       icon: '🖨️' },
  { name: 'Interior Gifts & Decor',slug: 'interior-decor',       icon: '🏠' },
  { name: 'Cakes',                 slug: 'cakes',                icon: '🎂' },
  { name: 'Flower Bouquets',       slug: 'flower-bouquets',      icon: '💐' },
  { name: 'Chocolate Bouquets',    slug: 'chocolate-bouquets',   icon: '🍫' },
  { name: 'Event Needs',           slug: 'event-needs',          icon: '🎉' },
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'geethika_digital_world' });
    console.log('✅ MongoDB connected!\n');
    console.log('🔄 Seeding categories...\n');

    let added = 0;
    let skipped = 0;

    for (const cat of categories) {
      try {
        const existing = await Category.findOne({ slug: cat.slug });
        if (existing) {
          console.log(`⏭️  Already exists: ${cat.icon} ${cat.name}`);
          skipped++;
        } else {
          await Category.create(cat);
          console.log(`✅ Created: ${cat.icon} ${cat.name}`);
          added++;
        }
      } catch (err) {
        console.error(`❌ Error for ${cat.name}:`, err.message);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Added:   ${added} categories`);
    console.log(`⏭️  Skipped: ${skipped} categories (already exist)`);
    console.log(`📦 Total:   ${categories.length} categories`);
    console.log('='.repeat(50));
    console.log('\n🎉 Categories seeded successfully!');
    console.log('📍 You can now add products at: http://localhost:5173/admin/products\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Fatal error:', err.message);
    process.exit(1);
  }
}

seedCategories();
