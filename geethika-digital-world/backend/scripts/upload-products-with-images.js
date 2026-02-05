import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { uploadToCloudinary } from '../config/cloudinary.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Sample products data - you can customize these
const productsData = [
  { name: 'Personalized Photo Frame', category: 'Photo Frames', price: 499, description: 'Beautiful personalized photo frame with custom text' },
  { name: 'Couple Name Mug Set', category: 'Couple Gifts', price: 599, description: 'Customized couple mugs with names' },
  { name: 'Custom T-Shirt', category: 'T-Shirts', price: 399, description: 'Personalized t-shirt with your design' },
  { name: 'Indoor Plant with Pot', category: 'Plants', price: 299, description: 'Beautiful indoor plant in decorative pot' },
  { name: 'Wooden Photo Frame', category: 'Photo Frames', price: 449, description: 'Elegant wooden photo frame' },
  { name: 'Printed Invitation Cards', category: 'Printing Works', price: 199, description: 'Custom printed invitation cards' },
  { name: 'Wall Decor Set', category: 'Interior Gifts & Decor Items', price: 899, description: 'Beautiful wall decoration set' },
  { name: 'Love Cushion Set', category: 'Couple Gifts', price: 699, description: 'Romantic cushion set for couples' },
  { name: 'Chocolate Bouquet', category: 'Chocolate Bouquets', price: 799, description: 'Delicious chocolate bouquet arrangement' },
  { name: 'Rose Flower Bouquet', category: 'Flower Bouquets', price: 599, description: 'Fresh rose flower bouquet' },
  { name: 'Birthday Cake', category: 'Cakes', price: 899, description: 'Delicious custom birthday cake' },
  { name: 'Succulent Plant', category: 'Plants', price: 249, description: 'Low maintenance succulent plant' },
  { name: 'Return Gift Hamper', category: 'Return Gifts', price: 399, description: 'Beautiful return gift hamper' },
  { name: 'Personalized Keychain', category: 'Personalised Gifts', price: 149, description: 'Custom engraved keychain' },
  { name: 'Photo Collage Frame', category: 'Photo Frames', price: 699, description: 'Multi-photo collage frame' },
  { name: 'Couple T-Shirt Set', category: 'T-Shirts', price: 799, description: 'Matching couple t-shirts' },
  { name: 'Event Decoration Package', category: 'Event Decor', price: 2999, description: 'Complete event decoration package' },
  { name: 'Personalized Notebook', category: 'Personalised Gifts', price: 299, description: 'Custom printed notebook' }
];

async function uploadProductsWithImages() {
  try {
    console.log('🚀 Starting product upload with images...\n');

    // Get images from products-images folder
    const imagesDir = path.join(__dirname, '../../products-images');
    const imageFiles = fs.readdirSync(imagesDir)
      .filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i))
      .sort();

    console.log(`📸 Found ${imageFiles.length} images\n`);

    // Get categories from database
    const categoriesResult = await pool.query('SELECT id, name FROM categories');
    const categories = {};
    categoriesResult.rows.forEach(cat => {
      categories[cat.name] = cat.id;
    });

    console.log(`📋 Found ${Object.keys(categories).length} categories\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < Math.min(productsData.length, imageFiles.length); i++) {
      const product = productsData[i];
      const imageFile = imageFiles[i];
      const imagePath = path.join(imagesDir, imageFile);

      try {
        console.log(`\n📦 Processing: ${product.name}`);
        console.log(`   Image: ${imageFile}`);

        // Get category ID
        const categoryId = categories[product.category];
        if (!categoryId) {
          console.log(`   ⚠️  Category "${product.category}" not found, skipping...`);
          errorCount++;
          continue;
        }

        // Upload image to Cloudinary
        console.log(`   ⬆️  Uploading image to Cloudinary...`);
        const fileBuffer = fs.readFileSync(imagePath);
        const fileObj = {
          buffer: fileBuffer,
          originalname: imageFile,
          mimetype: 'image/jpeg'
        };
        
        const uploadResult = await uploadToCloudinary(fileObj, 'products');
        console.log(`   ✅ Image uploaded: ${uploadResult.url}`);

        // Create slug
        const slug = product.name.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        // Insert product into database
        const result = await pool.query(`
          INSERT INTO products (
            name, slug, description, category_id, price, 
            image_url, image_public_id, stock_quantity, 
            valentine_special, customizable, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING id, name
        `, [
          product.name,
          slug,
          product.description,
          categoryId,
          product.price,
          uploadResult.url,
          uploadResult.publicId,
          50, // stock quantity
          false, // valentine special
          true, // customizable
          true // is active
        ]);

        console.log(`   ✅ Product created: ID ${result.rows[0].id}`);
        successCount++;

      } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        errorCount++;
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Successfully uploaded: ${successCount} products`);
    console.log(`❌ Failed: ${errorCount} products`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Show all products
    const allProducts = await pool.query(`
      SELECT p.id, p.name, c.name as category, p.price, p.image_url
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
      LIMIT 20
    `);

    console.log('📋 Recent Products in Database:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    allProducts.rows.forEach((prod, index) => {
      console.log(`${index + 1}. ${prod.name} - ₹${prod.price} (${prod.category})`);
      console.log(`   Image: ${prod.image_url ? '✅' : '❌'}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await pool.end();
  } catch (error) {
    console.error('❌ Fatal error:', error);
    await pool.end();
    process.exit(1);
  }
}

uploadProductsWithImages();
