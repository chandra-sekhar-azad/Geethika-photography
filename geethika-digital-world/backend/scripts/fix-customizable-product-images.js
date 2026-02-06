import pool from '../config/database.js';

async function fixProductImages() {
  try {
    console.log('Fixing customizable product image URLs...');

    // Update all products with /customised-images/ to /uploads/customised-images/
    const result = await pool.query(`
      UPDATE products 
      SET image_url = REPLACE(image_url, '/customised-images/', '/uploads/customised-images/')
      WHERE image_url LIKE '/customised-images/%'
      RETURNING id, name, image_url
    `);

    console.log(`✅ Updated ${result.rowCount} products:`);
    result.rows.forEach(row => {
      console.log(`   - ${row.name}: ${row.image_url}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing images:', error);
    process.exit(1);
  }
}

fixProductImages();
