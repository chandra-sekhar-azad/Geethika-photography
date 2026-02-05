# Categories & Products Setup Guide

## Overview
This guide helps you set up all the product categories mentioned in your requirements.

## Categories to Add

### 1. **Personalised Gifts** 🎁
Products to add:
- Custom Photo Frames
- Personalized Mugs
- Custom T-Shirts
- Engraved Keychains
- Personalized Notebooks
- Custom Cushions
- Photo Collages

### 2. **Couple Gifts** 💑
Products to add:
- Couple Mugs Set
- Matching T-Shirts
- Couple Photo Frames
- Couple Keychains
- Couple Cushions
- Anniversary Gifts
- Romantic Gift Hampers

### 3. **T-Shirts** 👕
Products to add:
- Custom Printed T-Shirts
- Couple T-Shirts
- Birthday T-Shirts
- Event T-Shirts
- Quote T-Shirts
- Photo T-Shirts

### 4. **Plants** 🌱
Products to add:
- Succulents
- Indoor Plants
- Lucky Bamboo
- Money Plant
- Cactus Collection
- Air Purifying Plants
- Decorative Planters

### 5. **Photo Frames** 🖼️
Products to add:
- Single Photo Frames
- Collage Frames
- Digital Photo Frames
- Wooden Frames
- Acrylic Frames
- Wall Hanging Frames
- Table Top Frames

### 6. **Printing Works** 🖨️
Products to add:
- Invitation Cards
- Business Cards
- Posters
- Banners
- Flex Printing
- Visiting Cards
- Brochures
- Flyers

### 7. **Interior Gifts & Decor Items** 🏠
Products to add:
- Wall Hangings
- Decorative Items
- Showpieces
- Wall Stickers
- LED Lights
- Candle Holders
- Vases
- Artificial Flowers

### 8. **Cakes** 🎂
Products to add:
- Birthday Cakes
- Anniversary Cakes
- Custom Photo Cakes
- Chocolate Cakes
- Fruit Cakes
- Designer Cakes
- Cupcakes

### 9. **Flower Bouquets** 💐
Products to add:
- Rose Bouquets
- Mixed Flower Bouquets
- Orchid Arrangements
- Lily Bouquets
- Carnation Bouquets
- Seasonal Flowers
- Exotic Flowers

### 10. **Chocolate Bouquets** 🍫
Products to add:
- Ferrero Rocher Bouquet
- Dairy Milk Bouquet
- Mixed Chocolate Bouquet
- Heart-Shaped Chocolate Bouquet
- Premium Chocolate Hamper

### 11. **Event Needs** 🎉
Products to add:
- Balloons
- Banners
- Decorative Items
- Party Supplies
- Ribbons
- Confetti
- Party Hats
- Streamers

## Services Already Added ✅

The following are services (not products) and have been added to the Services Management system:

1. **Photography** 📸
2. **Videography** 🎥
3. **Event Decor** 🎉
4. **Home Redecor** 🏠
5. **Shop Redecor** 🏪
6. **Return Gifts** 🎁

## How to Add Categories

### Method 1: Using Admin Panel (Recommended)
1. Login to admin panel at `http://localhost:5175/admin/login`
2. Go to Product Management
3. Click "Add Product"
4. Select or create category
5. Fill in product details
6. Upload product image
7. Save

### Method 2: Using Database Script

Create a script to add categories:

```javascript
// backend/scripts/add-all-categories.js
import pool from '../config/database.js';

async function addCategories() {
  const categories = [
    { name: 'Personalised Gifts', slug: 'personalised-gifts', description: 'Custom and personalized gifts for every occasion' },
    { name: 'Couple Gifts', slug: 'couple-gifts', description: 'Special gifts for couples and romantic occasions' },
    { name: 'T-Shirts', slug: 't-shirts', description: 'Custom printed t-shirts for all occasions' },
    { name: 'Plants', slug: 'plants', description: 'Indoor and decorative plants' },
    { name: 'Photo Frames', slug: 'photo-frames', description: 'Beautiful frames for your memories' },
    { name: 'Printing Works', slug: 'printing-works', description: 'Professional printing services' },
    { name: 'Interior Gifts & Decor', slug: 'interior-decor', description: 'Home decoration and interior items' },
    { name: 'Cakes', slug: 'cakes', description: 'Delicious cakes for all celebrations' },
    { name: 'Flower Bouquets', slug: 'flower-bouquets', description: 'Fresh flower arrangements' },
    { name: 'Chocolate Bouquets', slug: 'chocolate-bouquets', description: 'Sweet chocolate arrangements' },
    { name: 'Event Needs', slug: 'event-needs', description: 'Everything you need for your events' }
  ];

  for (const category of categories) {
    try {
      await pool.query(
        'INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3) ON CONFLICT (slug) DO NOTHING',
        [category.name, category.slug, category.description]
      );
      console.log(`✅ Added category: ${category.name}`);
    } catch (error) {
      console.error(`❌ Error adding ${category.name}:`, error.message);
    }
  }

  console.log('\n🎉 All categories added!');
  process.exit(0);
}

addCategories();
```

Run the script:
```bash
node backend/scripts/add-all-categories.js
```

## Product Image Guidelines

### Image Requirements
- **Format**: JPG, PNG, JPEG
- **Size**: 800x600px minimum
- **Aspect Ratio**: 4:3 or 1:1 (square)
- **File Size**: Under 5MB
- **Quality**: High resolution, clear, well-lit

### Image Naming Convention
```
category-product-name.jpg
Examples:
- personalised-gifts-photo-frame.jpg
- couple-gifts-mug-set.jpg
- plants-succulent.jpg
- cakes-birthday-cake.jpg
```

### Where to Store Images
1. **Local Development**: `backend/uploads/products/`
2. **Production**: Cloudinary (automatic upload via admin panel)

## Adding Products via Admin Panel

### Step-by-Step Process

1. **Login as Admin**
   - URL: `http://localhost:5175/admin/login`
   - Use admin credentials

2. **Navigate to Product Management**
   - Click "Product Management" from dashboard
   - Or go to: `http://localhost:5175/admin/products`

3. **Add New Product**
   - Click "Add Product" button
   - Fill in the form:
     - **Product Name**: Clear, descriptive name
     - **Category**: Select from dropdown (or create new)
     - **Description**: Detailed product description
     - **Price**: Product price in ₹
     - **Stock**: Available quantity
     - **Image**: Upload product image
     - **Customizable**: Check if product can be customized
     - **Active**: Check to make visible to customers

4. **Save Product**
   - Click "Add Product" button
   - Product will be added to database
   - Image will be uploaded to Cloudinary

## Bulk Product Upload

For adding multiple products at once, create a script:

```javascript
// backend/scripts/bulk-add-products.js
import pool from '../config/database.js';

const products = [
  {
    name: 'Custom Photo Frame',
    category_id: 1, // Personalised Gifts
    description: 'Beautiful custom photo frame with your favorite picture',
    price: 499,
    stock: 50,
    is_customizable: true
  },
  // Add more products...
];

async function bulkAddProducts() {
  for (const product of products) {
    try {
      await pool.query(
        `INSERT INTO products (name, category_id, description, price, stock, is_customizable)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [product.name, product.category_id, product.description, product.price, product.stock, product.is_customizable]
      );
      console.log(`✅ Added: ${product.name}`);
    } catch (error) {
      console.error(`❌ Error adding ${product.name}:`, error.message);
    }
  }
  process.exit(0);
}

bulkAddProducts();
```

## Price Ranges by Category

Suggested price ranges:

| Category | Price Range |
|----------|-------------|
| Personalised Gifts | ₹299 - ₹1,999 |
| Couple Gifts | ₹499 - ₹2,499 |
| T-Shirts | ₹299 - ₹799 |
| Plants | ₹199 - ₹1,499 |
| Photo Frames | ₹199 - ₹1,999 |
| Printing Works | ₹99 - ₹999 |
| Interior Decor | ₹299 - ₹4,999 |
| Cakes | ₹499 - ₹2,999 |
| Flower Bouquets | ₹399 - ₹2,499 |
| Chocolate Bouquets | ₹599 - ₹2,999 |
| Event Needs | ₹99 - ₹999 |

## Next Steps

1. ✅ Services are already set up and ready
2. ⏳ Add categories using the script or admin panel
3. ⏳ Prepare product images
4. ⏳ Add products through admin panel
5. ⏳ Test product display on shop page
6. ⏳ Configure customization options
7. ⏳ Set up inventory management

## Tips for Success

1. **Start Small**: Add 2-3 products per category first
2. **Test Thoroughly**: Check each product on the shop page
3. **Use Quality Images**: Good images increase sales
4. **Write Clear Descriptions**: Help customers understand the product
5. **Set Realistic Prices**: Research market prices
6. **Enable Customization**: For products that can be personalized
7. **Monitor Stock**: Keep inventory updated

## Support

If you need help:
- Check the admin dashboard for guidance
- Review error messages in browser console
- Verify database connection
- Ensure all images are properly formatted

---

**Last Updated**: February 6, 2026
**Version**: 1.0.0
