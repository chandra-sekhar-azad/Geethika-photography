import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Different images for each product
const imageMapping = [
  { id: 1, image: '/uploads/products/photo-frame-1.jpg' },
  { id: 2, image: '/uploads/products/couple-mug.jpg' },
  { id: 3, image: '/uploads/products/tshirt-1.jpg' },
  { id: 4, image: '/uploads/products/plant-1.jpg' },
  { id: 5, image: '/uploads/products/photo-frame-2.jpg' },
  { id: 6, image: '/uploads/products/invitation-cards.jpg' },
  { id: 7, image: '/uploads/products/wall-decor.jpg' },
  { id: 8, image: '/uploads/products/cushion-set.jpg' },
  { id: 9, image: '/uploads/products/chocolate-bouquet.jpg' },
  { id: 10, image: '/uploads/products/flower-bouquet.jpg' },
  { id: 11, image: '/uploads/products/birthday-cake.jpg' },
  { id: 12, image: '/uploads/products/succulent.jpg' },
  { id: 13, image: '/uploads/products/return-gift.jpg' },
  { id: 14, image: '/uploads/products/keychain.jpg' },
  { id: 15, image: '/uploads/products/collage-frame.jpg' },
  { id: 16, image: '/uploads/products/couple-tshirt.jpg' },
  { id: 17, image: '/uploads/products/event-decor.jpg' },
  { id: 18, image: '/uploads/products/notebook.jpg' }
];

async function fixProductImages() {
  try {
    console.log('🔧 Fixing product images...\n');

    // First, show current products
    const currentProducts = await pool.query(`
      SELECT id, name, image_url 
      FROM products 
      ORDER BY id 
      LIMIT 20
    `);

    console.log('📋 Current Products:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    currentProducts.rows.forEach(prod => {
      console.log(`${prod.id}. ${prod.name}`);
      console.log(`   Current: ${prod.image_url}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    let updateCount = 0;

    // Update each product with unique image
    for (const mapping of imageMapping) {
      try {
        const result = await pool.query(
          'UPDATE products SET image_url = $1 WHERE id = $2 RETURNING id, name, image_url',
          [mapping.image, mapping.id]
        );

        if (result.rows.length > 0) {
          console.log(`✅ Updated: ${result.rows[0].name}`);
          console.log(`   New image: ${result.rows[0].image_url}`);
          updateCount++;
        }
      } catch (error) {
        console.log(`⚠️  Product ID ${mapping.id} not found, skipping...`);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Updated ${updateCount} products with unique images`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Show updated products
    const updatedProducts = await pool.query(`
      SELECT id, name, image_url 
      FROM products 
      ORDER BY id 
      LIMIT 20
    `);

    console.log('📋 Updated Products:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    updatedProducts.rows.forEach(prod => {
      console.log(`${prod.id}. ${prod.name}`);
      console.log(`   Image: ${prod.image_url}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✨ All products now have unique images!');
    console.log('   Refresh your website to see the changes.\n');

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error);
    await pool.end();
    process.exit(1);
  }
}

fixProductImages();
