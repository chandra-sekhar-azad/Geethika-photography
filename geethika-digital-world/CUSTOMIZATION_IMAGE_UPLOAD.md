# Customization Image Upload Feature

## Overview

When a product is marked as "Customizable" by the admin, customers are **required** to upload an image when ordering that product. This is perfect for products like photo frames, custom t-shirts, mugs, etc.

## How It Works

### For Admin

1. **Go to Product Management** (`/admin/dashboard` → Products)

2. **Create or Edit a Product**

3. **Check "Customizable" checkbox**

4. **Enable Image Upload Option**
   - When "Customizable" is checked, a new section appears
   - Check "📸 Require Customer Image Upload"
   - This makes image upload mandatory for customers

5. **Save the Product**

### For Customers

1. **Browse to a Customizable Product**
   - Product detail page shows "Customize Your Product" section
   - Image upload field is marked with red asterisk (*)

2. **Upload Image (Required)**
   - Click on the upload area
   - Select an image from their device
   - Preview appears immediately
   - Can remove and re-upload if needed

3. **Add to Cart**
   - If image is not uploaded, they get an alert: "Please upload an image for customization"
   - Cannot proceed without uploading the image

4. **Complete Order**
   - Image is saved with the order
   - Admin can see the uploaded image in order details

## Admin Interface

### Product Form - Customization Options

```
☑️ Customizable

┌─────────────────────────────────────────────┐
│ Customization Options                       │
├─────────────────────────────────────────────┤
│ ☑️ 📸 Require Customer Image Upload         │
│    Customer must upload an image to         │
│    customize this product                   │
└─────────────────────────────────────────────┘
```

## Customer Interface

### Product Detail Page - Customization Section

```
Customize Your Product

┌─────────────────────────────────────────────┐
│ Upload Your Image *                         │
├─────────────────────────────────────────────┤
│                                             │
│           📤                                │
│    Click to upload your image               │
│    Required for customization               │
│                                             │
│ 💡 Upload the image you want printed/      │
│    customized on this product               │
└─────────────────────────────────────────────┘
```

### After Upload

```
┌─────────────────────────────────────────────┐
│ Upload Your Image *                         │
├─────────────────────────────────────────────┤
│                                             │
│      [Preview of uploaded image]            │
│                                             │
│         Remove Image                        │
└─────────────────────────────────────────────┘
```

## Validation

### Client-Side Validation

When customer clicks "Add to Cart":

1. **Check if product is customizable**
2. **Check if image upload is required**
3. **Verify image is uploaded**
4. **Show alert if missing**: "Please upload an image for customization"
5. **Prevent adding to cart** until image is uploaded

### Code Example

```javascript
if (product.customizable && product.customization_options) {
  if (product.customization_options.imageUpload && !customization.image) {
    alert('Please upload an image for customization');
    return;
  }
}
```

## Data Structure

### Product Schema

```javascript
{
  id: 1,
  name: "Custom Photo Frame",
  customizable: true,
  customization_options: {
    imageUpload: true,  // ✅ Image upload required
    textInput: [],      // Optional text inputs
    sizes: []           // Optional size options
  }
}
```

### Cart Item with Customization

```javascript
{
  id: 1,
  name: "Custom Photo Frame",
  price: 299,
  quantity: 1,
  customization: {
    image: "blob:http://localhost:5173/...",  // Preview URL
    imageFile: File,                           // Actual file object
    textInputs: {},
    size: null
  }
}
```

## Use Cases

### Perfect For:

1. **Photo Frames** - Customer uploads their photo
2. **Custom T-Shirts** - Customer uploads design/image
3. **Mugs** - Customer uploads photo for printing
4. **Cushions** - Customer uploads image for cushion cover
5. **Canvas Prints** - Customer uploads artwork
6. **Phone Cases** - Customer uploads design
7. **Keychains** - Customer uploads photo
8. **Notebooks** - Customer uploads cover design

## Features

### ✅ Implemented

- [x] Admin can enable image upload for products
- [x] Required field validation
- [x] Image preview before adding to cart
- [x] Remove and re-upload functionality
- [x] Visual indicators (red asterisk for required)
- [x] Helpful hints and instructions
- [x] Prevents cart addition without image
- [x] Image stored with cart item
- [x] Image included in order data

### 🔄 Future Enhancements

- [ ] Image size/format validation
- [ ] Image cropping/editing tools
- [ ] Multiple image uploads
- [ ] Image quality requirements
- [ ] Upload progress indicator
- [ ] Drag and drop upload

## Testing

### Test Scenario 1: Create Customizable Product

1. Login as admin
2. Go to Product Management
3. Click "Add Product"
4. Fill in product details
5. Check "Customizable"
6. Check "Require Customer Image Upload"
7. Save product
8. ✅ Product should be saved with customization options

### Test Scenario 2: Order Without Image

1. Go to customizable product page
2. Try to click "Add to Cart" without uploading image
3. ✅ Should show alert: "Please upload an image for customization"
4. ✅ Should NOT add to cart

### Test Scenario 3: Order With Image

1. Go to customizable product page
2. Click upload area
3. Select an image
4. ✅ Preview should appear
5. Click "Add to Cart"
6. ✅ Should add to cart successfully
7. ✅ Should navigate to cart page
8. ✅ Image should be visible in cart

### Test Scenario 4: Remove and Re-upload

1. Upload an image
2. Click "Remove Image"
3. ✅ Preview should disappear
4. Upload a different image
5. ✅ New preview should appear
6. ✅ Can add to cart with new image

## Troubleshooting

### Image Not Uploading?

- Check file size (should be < 5MB)
- Check file format (JPG, PNG, GIF supported)
- Check browser console for errors

### Validation Not Working?

- Ensure `customizable` is true
- Ensure `customization_options.imageUpload` is true
- Check browser console for JavaScript errors

### Image Not Showing in Cart?

- Check if image preview URL is valid
- Verify customization object is being passed
- Check CartContext implementation

## Files Modified

### Frontend

1. `client/src/pages/admin/ProductManagement.jsx`
   - Added customization_options to formData
   - Added UI for image upload checkbox
   - Send customization_options as JSON

2. `client/src/pages/ProductDetailPage.jsx`
   - Added validation for required image upload
   - Added required indicators (*)
   - Added helpful hints
   - Store imageFile in customization

### Backend

- No changes needed (already supports customization_options)

## Database Schema

The `products` table already has:

```sql
customizable BOOLEAN DEFAULT FALSE
customization_options JSONB
```

Example data:

```json
{
  "imageUpload": true,
  "textInput": [],
  "sizes": []
}
```

## API

### Create/Update Product

```http
POST /api/products
PUT /api/products/:id

Content-Type: multipart/form-data

{
  "name": "Custom Photo Frame",
  "customizable": true,
  "customization_options": "{\"imageUpload\":true,\"textInput\":[],\"sizes\":[]}"
}
```

## Summary

This feature ensures that when admin marks a product as customizable with image upload required, customers **must** upload an image before they can order the product. This is essential for personalized products where the customer's image is needed for production.
