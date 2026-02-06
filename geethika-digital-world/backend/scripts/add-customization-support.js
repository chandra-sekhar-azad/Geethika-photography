import pool from '../config/database.js';

async function addCustomizationSupport() {
  try {
    console.log('Adding customization support to orders...');

    // Add customization_images column to order_items table
    await pool.query(`
      ALTER TABLE order_items 
      ADD COLUMN IF NOT EXISTS customization_images TEXT[];
    `);

    // Add is_customizable column to products table
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS is_customizable BOOLEAN DEFAULT false;
    `);

    // Add customization_note column to products table
    await pool.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS customization_note TEXT;
    `);

    console.log('✅ Customization support added successfully!');
    console.log('- order_items.customization_images: Array of uploaded image URLs');
    console.log('- products.is_customizable: Boolean flag for customizable products');
    console.log('- products.customization_note: Instructions for customization');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding customization support:', error);
    process.exit(1);
  }
}

addCustomizationSupport();
