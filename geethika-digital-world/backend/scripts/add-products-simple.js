import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Sample products data
const productsData = [
  { name: 'Personalized Photo Frame', category: 'Photo Frames', price: 499, description: 'Beautiful personalized photo frame with custom text', image: 'photo-frame-1.jpg' },
  { name: 'Couple Name Mug Set', category: 'Couple Gifts', price: 599, description: 'Customized couple mugs with names', image: 'couple-mug.jpg' },
  { name: 'Custom T-Shirt', category: 'T-Shirts', price: 399, description: 'Personalized t-shirt with your design', image: 'tshirt-1.jpg' },
  { name: 'Indoor Plant with Pot', category: 'Plants', price: 299, description: 'Beautiful indoor plant in decorative pot', image: 'plant-1.jpg' },
  { name: 'Wooden Photo Frame', category: 'Photo Frames', price: 449, description: 'Elegant wooden photo frame', image: 'photo-frame-2.jpg' },
  { name: 'Printed Invitation Cards', category: 'Printing Works', price: 199, description: 'Custom printed invitation cards', image: 'invitation-cards.jpg' },
  { name: 'Wall Decor Set', category: 'Interior Gifts & Decor Items', price: 899, description: 'Beautiful wall decoration set', image: 'wall-decor.jpg' },
  { name: 'Love Cushion Set', category: 'Couple Gifts', price: 699, description: 'Romantic cushion set for couples', image: 'cushion-set.jpg' },
  { name: 'Chocolate Bouquet', category: 'Chocolate Bouquets', price: 799, description: 'Delicious chocolate bouquet arrangement', image: 'chocolate-bouquet.jpg' },
  { name: 'Rose Flower Bouquet', category: 'Flower Bouquets', price: 599, description: 'Fresh rose flower bouquet', image: 'flower-bouquet.jpg' },
  { name: 'Birthday Cake', category: 'Cakes', price: 899, description: 'Delicious custom birthday cake', image: 'birthday-cake.jpg' },
  { name: 'Succulent Plant', category: 'Plants', price: 249, description: 'Low maintenance succulent plant', image: 'succulent.jpg' },
  { name: 'Return Gift Hamper', category: 'Return Gifts', price: 399, description: 'Beautiful return gift hamper', image: 'return-gift.jpg' },
  { name: 'Personalized Keychain', category: 'Personalised Gifts', price: 149, description: 'Custom engraved keychain', image: 'keychain.jpg' },
  { name: 'Photo Collage Frame', category: 'Photo Frames', price: 699, description: 'Multi-photo collage frame', image: 'collage-frame.jpg' },
  { name: 'Couple T-Shirt Set', category: 'T-Shirts', price: 799, description: 'Matching couple t-shirts', image: 'couple-tshirt.jpg' },
  { name: 'Event Decoration Package', category: 'Event Decor', price: 2999, description: 'Complete event decoration package', image: 'event-decor.jpg' },
  { name: 'Personalized Notebook', category: 'Personalised Gifts', price: 299, description: 'Custom printed notebook', image: 'notebook.jpg' }
];

async function copyImagesAndCreateProducts() {
  try {
    console.log('🚀 Starting product creation...\n');

    // Get images from products-images folder
    const sourceDir = path.join(__dirname, '../../products-images');
    const targetDir = path.join(__dirname, '../uploads/products');
    
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
      console.log('📁 Created uploads/products directory\n');
    }

    const imageFiles = fs.readdirSync(sourceDir)
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
      const sourceImage = imageFiles[i];
      const targetImage = product.image;

      try {
        console.log(`\n📦 Processing: ${product.name}`);

        // Get category ID
        const categoryId = categories[product.category];
        if (!categoryId) {
          console.log(`   ⚠️  Category "${product.category}" not found, skipping...`);
          errorCount++;
          continue;
        }

        // Copy image file
        const sourcePath = path.join(sourceDir, sourceImage);
        const targetPath = path.join(targetDir, targetImage);
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`   📸 Image copied: ${targetImage}`);

        // Create slug
        const slug = product.name.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        // Image URL for database
        const imageUrl = `/uploads/products/${targetImage}`;

        // Insert product into database
        const result = await pool.query(`
          INSERT INTO products (
            name, slug, description, category_id, price, 
            image_url, stock_quantity, 
            valentine_special, customizable, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING id, name
        `, [
          product.name,
          slug,
          product.description,
          categoryId,
          product.price,
          imageUrl,
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
    console.log(`✅ Successfully created: ${successCount} products`);
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

    console.log('📋 Products in Database:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    allProducts.rows.forEach((prod, index) => {
      console.log(`${index + 1}. ${prod.name} - ₹${prod.price} (${prod.category})`);
      console.log(`   Image: ${prod.image_url}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✨ Products are now visible on the website!');
    console.log('   - Shop page: http://localhost:5174/shop');
    console.log('   - Admin panel: http://localhost:5174/admin/products\n');

    await pool.end();
  } catch (error) {
    console.error('❌ Fatal error:', error);
    await pool.end();
    process.exit(1);
  }
}

copyImagesAndCreateProducts();
