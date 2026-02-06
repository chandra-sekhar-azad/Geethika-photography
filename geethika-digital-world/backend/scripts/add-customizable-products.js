import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const customizableProducts = [
  {
    name: 'Custom Photo Mug',
    description: 'Personalized ceramic mug with your photo. Perfect for gifts!',
    price: 299,
    category: 'Customized Gifts',
    image: 'mug-printing-500x500.jpg',
    customization_note: 'Upload your photo (JPG/PNG, max 5MB). We will print it on a high-quality ceramic mug.'
  },
  {
    name: 'Custom T-Shirt Printing',
    description: 'Get your favorite design or photo printed on premium quality t-shirt',
    price: 499,
    category: 'Customized Gifts',
    image: 't-shirt-printing-500x500-500x500.jpg',
    customization_note: 'Upload your design or photo. Available in all sizes (S, M, L, XL, XXL).'
  },
  {
    name: 'Heart Shape Crystal',
    description: 'Beautiful heart-shaped crystal with your photo engraved',
    price: 799,
    category: 'Customized Gifts',
    image: 'big-heart-wide-crystal-500x500.png',
    customization_note: 'Upload a clear photo. We will laser engrave it on premium crystal.'
  },
  {
    name: 'Custom Cushion',
    description: 'Soft cushion with your photo printed using sublimation',
    price: 399,
    category: 'Customized Gifts',
    image: 'heart-sublimation-cushion-500x500.jpg',
    customization_note: 'Upload your photo. Size: 12x12 inches. Includes cushion with cover.'
  },
  {
    name: 'Wooden UV Heart Frame',
    description: 'Wooden heart-shaped photo frame with UV printing',
    price: 599,
    category: 'Customized Gifts',
    image: 'Wooden-UV-Heart-Shape_173.jpg',
    customization_note: 'Upload your photo. High-quality UV printing on premium wood.'
  },
  {
    name: 'Corporate ID Card',
    description: 'Professional ID cards for your organization',
    price: 99,
    category: 'Customized Gifts',
    image: 'corporate-id-card-500x500.jpg',
    customization_note: 'Upload employee photo and details. Bulk orders available.'
  },
  {
    name: 'Heart Stone Printing',
    description: 'Your photo printed on heart-shaped stone',
    price: 349,
    category: 'Customized Gifts',
    image: 'heart-stone-printing-service-500x500.jpg',
    customization_note: 'Upload your photo. Durable stone with glossy finish.'
  },
  {
    name: 'Anniversary Special Frame',
    description: 'Beautiful anniversary photo frame with custom message',
    price: 699,
    category: 'Customized Gifts',
    image: 'Happy-Anniversary-16x16.jpeg',
    customization_note: 'Upload your photo and anniversary message.'
  },
  {
    name: 'Custom Photo Collage',
    description: 'Multiple photos arranged in a beautiful collage',
    price: 899,
    category: 'Customized Gifts',
    image: 'GME-IG-051-800x800.jpg',
    customization_note: 'Upload 4-9 photos. We will create a beautiful collage.'
  },
  {
    name: 'Couple Heart Handle Mug',
    description: 'Romantic heart-handle mug with couple photo',
    price: 449,
    category: 'Customized Gifts',
    image: 'mtm-you-are-my-life-duel-heart-symbol-red-heart-handle-three-original-imafzshgkzzem8mz.jpeg',
    customization_note: 'Upload couple photo. Perfect for Valentine\'s Day!'
  }
];

async function addCustomizableProducts() {
  try {
    console.log('Adding customizable products...');

    // Get or create "Customized Gifts" category
    let categoryResult = await pool.query(
      'SELECT id FROM categories WHERE name = $1',
      ['Customized Gifts']
    );

    let categoryId;
    if (categoryResult.rows.length === 0) {
      const newCategory = await pool.query(
        'INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id',
        ['Customized Gifts', 'customized-gifts']
      );
      categoryId = newCategory.rows[0].id;
      console.log('✅ Created "Customized Gifts" category');
    } else {
      categoryId = categoryResult.rows[0].id;
      console.log('✅ Using existing "Customized Gifts" category');
    }

    // Add each product
    for (const product of customizableProducts) {
      const existing = await pool.query(
        'SELECT id FROM products WHERE name = $1',
        [product.name]
      );

      if (existing.rows.length === 0) {
        const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        await pool.query(
          `INSERT INTO products (
            name, slug, description, price, category_id, image_url, 
            stock_quantity, is_customizable, customization_note
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            product.name,
            slug,
            product.description,
            product.price,
            categoryId,
            `/customised-images/${product.image}`,
            100, // stock
            true, // is_customizable
            product.customization_note
          ]
        );
        console.log(`✅ Added: ${product.name}`);
      } else {
        console.log(`⏭️  Skipped (already exists): ${product.name}`);
      }
    }

    console.log('\n🎉 All customizable products added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  }
}

addCustomizableProducts();
