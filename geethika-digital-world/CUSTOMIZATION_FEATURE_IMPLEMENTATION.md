# 🎨 Product Customization Feature Implementation Guide

## Overview
This feature allows customers to upload images when ordering customizable products (mugs, t-shirts, frames, etc.). Admins can view and download these images from the dashboard.

---

## 📋 Implementation Steps

### Step 1: Database Setup

Run these scripts in order:

```bash
# 1. Add customization support to database
cd backend
node scripts/add-customization-support.js

# 2. Add customizable products from customised-images folder
node scripts/add-customizable-products.js
```

This will:
- Add `customization_images` column to `order_items` table
- Add `is_customizable` and `customization_note` columns to `products` table
- Create 10 customizable products with images from the `customised-images` folder

---

### Step 2: Backend API Updates

#### A. Update Order Creation Endpoint

File: `backend/routes/orders.js`

Add support for handling customization images in the order creation:

```javascript
// In the POST /api/orders endpoint, update to handle customization_images

router.post('/', auth, async (req, res) => {
  const { items, shipping_info, payment_method } = req.body;
  
  try {
    // ... existing order creation code ...
    
    // When inserting order items, include customization_images
    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items (
          order_id, product_id, quantity, price, customization_images
        ) VALUES ($1, $2, $3, $4, $5)`,
        [
          orderId,
          item.product_id,
          item.quantity,
          item.price,
          item.customization_images || null  // Array of image URLs
        ]
      );
    }
    
    // ... rest of the code ...
  } catch (error) {
    // ... error handling ...
  }
});
```

#### B. Add Image Upload Endpoint

File: `backend/routes/orders.js`

```javascript
import multer from 'multer';
import path from 'path';

// Configure multer for customization images
const customStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/customizations/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'custom-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const customUpload = multer({
  storage: customStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG and PNG images are allowed'));
    }
  }
});

// Upload customization image endpoint
router.post('/upload-customization', customUpload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const imageUrl = `/uploads/customizations/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' });
  }
});
```

#### C. Update Order Details Endpoint

File: `backend/routes/orders.js`

```javascript
// GET /api/orders/:id - Include customization_images in response
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // ... existing order query ...
    
    // Get order items with customization images
    const itemsResult = await pool.query(
      `SELECT 
        oi.*,
        p.name as product_name,
        p.image_url as product_image,
        p.is_customizable,
        oi.customization_images
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1`,
      [id]
    );
    
    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
});
```

---

### Step 3: Frontend Updates

#### A. Update Cart Context

File: `client/src/context/CartContext.jsx`

Add customization images to cart items:

```javascript
const addToCart = (product, customizationImages = []) => {
  setCart(prevCart => {
    const existingItem = prevCart.find(item => item.id === product.id);
    
    if (existingItem) {
      return prevCart.map(item =>
        item.id === product.id
          ? { 
              ...item, 
              quantity: item.quantity + 1,
              customizationImages: [...(item.customizationImages || []), ...customizationImages]
            }
          : item
      );
    }
    
    return [...prevCart, { 
      ...product, 
      quantity: 1,
      customizationImages 
    }];
  });
};
```

#### B. Create Image Upload Component

File: `client/src/components/CustomizationUpload.jsx`

```javascript
import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

const CustomizationUpload = ({ onImagesUploaded, maxImages = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    
    if (uploadedImages.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_BASE_URL}/api/orders/upload-customization`, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        return data.imageUrl;
      });

      const imageUrls = await Promise.all(uploadPromises);
      const newImages = [...uploadedImages, ...imageUrls];
      setUploadedImages(newImages);
      onImagesUploaded(newImages);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    onImagesUploaded(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Upload Your Images</h3>
        <span className="text-sm text-gray-600">
          {uploadedImages.length}/{maxImages} images
        </span>
      </div>

      {/* Upload Button */}
      {uploadedImages.length < maxImages && (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-valentine-pink rounded-lg cursor-pointer hover:bg-valentine-lightPink hover:bg-opacity-10 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 text-valentine-red mb-2" />
            <p className="text-sm text-gray-600">
              {uploading ? 'Uploading...' : 'Click to upload images'}
            </p>
            <p className="text-xs text-gray-500">JPG or PNG (max 5MB each)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      )}

      {/* Preview Images */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {uploadedImages.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <img
                src={`${API_BASE_URL}${imageUrl}`}
                alt={`Upload ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomizationUpload;
```

#### C. Update Product Detail Page

File: `client/src/pages/ProductDetailPage.jsx`

Add customization upload for customizable products:

```javascript
import CustomizationUpload from '../components/CustomizationUpload';

// Inside the component:
const [customizationImages, setCustomizationImages] = useState([]);

// In the JSX, before the "Add to Cart" button:
{product.is_customizable && (
  <div className="mt-6 p-4 bg-valentine-lightPink bg-opacity-20 rounded-lg">
    <div className="flex items-center space-x-2 mb-3">
      <ImageIcon className="w-5 h-5 text-valentine-red" />
      <h3 className="font-semibold text-valentine-red">Customization Required</h3>
    </div>
    <p className="text-sm text-gray-600 mb-4">{product.customization_note}</p>
    <CustomizationUpload
      onImagesUploaded={setCustomizationImages}
      maxImages={5}
    />
  </div>
)}

// Update Add to Cart handler:
const handleAddToCart = () => {
  if (product.is_customizable && customizationImages.length === 0) {
    alert('Please upload at least one image for customization');
    return;
  }
  
  addToCart(product, customizationImages);
  // ... rest of the code ...
};
```

#### D. Update OrderManagement Page

File: `client/src/pages/admin/OrderManagement.jsx`

Import and use the new OrderDetailsModal:

```javascript
import OrderDetailsModal from '../../components/OrderDetailsModal';

// Replace the existing order details view with:
{selectedOrder && (
  <OrderDetailsModal
    order={selectedOrder}
    onClose={() => setSelectedOrder(null)}
    onUpdateStatus={updateOrderStatus}
  />
)}
```

---

### Step 4: Create Uploads Directory

```bash
# Create directory for customization uploads
mkdir -p backend/uploads/customizations
```

Update `.gitignore`:
```
uploads/customizations/*
!uploads/customizations/.gitkeep
```

---

### Step 5: Move Customized Images to Backend

```bash
# Copy images to backend uploads folder
cp -r customised-images/* backend/uploads/customised-images/
```

---

## 🎯 Features Implemented

### For Customers:
✅ Browse customizable products (mugs, t-shirts, frames, etc.)
✅ Upload images when ordering customizable products
✅ Preview uploaded images before checkout
✅ Multiple image upload support (up to 5 images per product)
✅ Image validation (JPG/PNG, max 5MB)

### For Admins:
✅ View all orders with customization details
✅ See customer-uploaded images in order details
✅ Download individual images
✅ Download all images for an order item at once
✅ Manage customizable products (add/edit/delete)
✅ View product customization notes

---

## 🔧 Testing

### Test Customization Flow:

1. **Add Customizable Products:**
   ```bash
   cd backend
   node scripts/add-customization-support.js
   node scripts/add-customizable-products.js
   ```

2. **Browse Products:**
   - Go to Shop page
   - Find "Customized Gifts" category
   - Click on any customizable product

3. **Upload Images:**
   - Click on product
   - Upload 1-5 images
   - Add to cart
   - Complete checkout

4. **Admin View:**
   - Login to admin dashboard
   - Go to Order Management
   - Click "View Details" on an order
   - See uploaded images
   - Download images

---

## 📱 UI/UX Features

- **Visual Indicators:** Products show "Customizable" badge
- **Upload Progress:** Loading state during image upload
- **Image Preview:** Customers see thumbnails of uploaded images
- **Download Options:** Admins can download individual or all images
- **Responsive Design:** Works on mobile and desktop
- **Error Handling:** Clear error messages for upload failures

---

## 🚀 Deployment Notes

### Production Considerations:

1. **Image Storage:**
   - For production, consider using Cloudinary or AWS S3
   - Current implementation uses local storage (not ideal for Render free tier)

2. **Image Optimization:**
   - Add image compression before upload
   - Generate thumbnails for faster loading

3. **Security:**
   - Validate file types on backend
   - Scan for malicious files
   - Implement rate limiting on upload endpoint

4. **Performance:**
   - Use CDN for serving images
   - Implement lazy loading for image galleries
   - Add pagination for orders with many images

---

## 📝 Next Steps

1. Run the database migration scripts
2. Test the upload functionality locally
3. Update the OrderManagement component
4. Test the complete flow
5. Deploy to production

---

**Happy Customizing! 🎨**
