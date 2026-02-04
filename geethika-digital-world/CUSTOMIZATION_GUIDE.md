# Customization Guide - Geethika Digital World

## 🎨 Theme Customization

### Change Color Scheme

Edit `src/index.css` to change the Valentine theme colors:

```css
@theme {
  --color-valentine-pink: #FF69B4;      /* Change to your brand color */
  --color-valentine-red: #DC143C;       /* Change to your primary color */
  --color-valentine-lightPink: #FFB6C1; /* Change to your light accent */
  --color-valentine-darkRed: #8B0000;   /* Change to your dark accent */
  --color-valentine-rose: #FF007F;      /* Change to your secondary color */
}
```

### Change Fonts

Update the Google Fonts import in `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap');

@theme {
  --font-family-display: 'YourFont', serif;
}
```

### Remove Valentine Theme

1. Change colors to neutral palette
2. Remove Valentine banner from `src/components/Navbar.jsx` (line 90-94)
3. Update hero section text in `src/pages/HomePage.jsx`
4. Remove heart icons and Valentine-specific content

## 📦 Product Management

### Add New Product

Edit `src/data/products.js`:

```javascript
{
  id: 19, // Increment ID
  name: 'Your Product Name',
  category: 'category-id', // Must match category in categories.js
  price: 999,
  image: 'https://your-image-url.com/image.jpg',
  description: 'Product description',
  customizable: true, // or false
  customizationOptions: {
    imageUpload: true,
    textInput: ['Field 1', 'Field 2'],
    sizes: [
      { name: 'Small', price: 999 },
      { name: 'Large', price: 1299 }
    ]
  },
  valentineSpecial: false,
  discount: 0 // Percentage discount
}
```

### Add New Category

Edit `src/data/categories.js`:

```javascript
{ 
  id: 'new-category', 
  name: 'New Category', 
  icon: '🎁' 
}
```

### Update Product Images

1. Upload images to Cloudinary or your image hosting service
2. Get the image URL
3. Replace the `image` field in products.js
4. Recommended image size: 800x800px
5. Format: WebP or JPEG

## 🛠️ Service Management

### Add New Service

Edit `src/data/services.js`:

```javascript
{
  id: 6,
  name: 'Your Service',
  icon: '🎯',
  description: 'Service description',
  image: 'https://your-image-url.com/service.jpg',
  packages: [
    {
      name: 'Basic Package',
      price: 5000,
      duration: '2 hours',
      deliverables: 'What customer gets',
      features: ['Feature 1', 'Feature 2', 'Feature 3']
    }
  ]
}
```

### Update Service Pricing

Simply change the `price` field in the package object.

## 📸 Gallery Management

### Add Gallery Images

Edit `src/pages/GalleryPage.jsx`:

```javascript
const galleryImages = [
  {
    id: 10, // Increment ID
    category: 'Your Category',
    image: 'https://your-image-url.com/gallery.jpg',
    title: 'Image Title',
  },
  // ... more images
];
```

### Add Gallery Categories

Update the `categories` array in `GalleryPage.jsx`:

```javascript
const categories = ['All', 'Category 1', 'Category 2', 'Your Category'];
```

## 📞 Contact Information

### Update Business Details

Edit `src/pages/ContactPage.jsx`:

```javascript
// Address (around line 30)
<p className="text-gray-600">
  Your Street Address<br />
  Your City, State - Pincode<br />
  Country
</p>

// Phone (around line 42)
<p className="text-gray-600">+91 Your Number</p>

// Email (around line 52)
<p className="text-gray-600">your@email.com</p>

// Business Hours (around line 62)
<p className="text-gray-600">
  Monday - Saturday: 10:00 AM - 8:00 PM<br />
  Sunday: Closed
</p>
```

### Update Google Maps

Replace the iframe src in `ContactPage.jsx` (around line 100):

1. Go to Google Maps
2. Search for your location
3. Click "Share" → "Embed a map"
4. Copy the iframe code
5. Replace the src attribute

## 💬 WhatsApp Integration

### Update WhatsApp Number

Replace `919876543210` with your number in:

1. `src/components/WhatsAppFloat.jsx`
2. `src/pages/ServicesPage.jsx`
3. `src/pages/CartPage.jsx`
4. `src/pages/ContactPage.jsx`

Format: Country code + number (no spaces or special characters)
Example: 919876543210 for +91 98765 43210

### Customize WhatsApp Messages

Edit the message templates in each file:

```javascript
const message = `Your custom message here`;
const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
```

## 🏠 Homepage Customization

### Update Hero Section

Edit `src/pages/HomePage.jsx` (around line 10-50):

```javascript
<h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
  Your Headline
</h1>
<p className="text-xl md:text-2xl mb-8">
  Your Subheadline
</p>
```

### Update Offers

Change the offer text and discount percentage:

```javascript
<div className="bg-valentine-red text-white px-6 py-3 rounded-full">
  Your Offer Text - XX% OFF
</div>
```

### Add/Remove Sections

The homepage has these sections:
1. Hero Banner
2. Featured Products
3. Services Showcase
4. Special Offers
5. Call to Action

You can comment out or remove any section you don't need.

## 🎯 Navigation Menu

### Update Menu Items

Edit `src/components/Navbar.jsx` (around line 10):

```javascript
const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/shop', label: 'Shop' },
  { path: '/services', label: 'Services' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/contact', label: 'Contact' },
  { path: '/your-page', label: 'Your Page' }, // Add new page
];
```

### Update Logo

Replace the heart icon with your logo:

```javascript
// Replace this:
<Heart className="w-8 h-8 text-valentine-red fill-valentine-red" />

// With this:
<img src="/your-logo.png" alt="Logo" className="w-12 h-12" />
```

## 📱 Footer Customization

### Update Footer Content

Edit `src/components/Footer.jsx`:

1. Company description (line 15-17)
2. Quick links (line 24-32)
3. Categories (line 37-45)
4. Contact info (line 50-70)
5. Social media links (line 73-83)

### Add Social Media Links

Replace `#` with your actual social media URLs:

```javascript
<a href="https://facebook.com/yourpage" className="...">
  <Facebook className="w-5 h-5" />
</a>
```

## 🔧 Advanced Customization

### Add New Page

1. Create new file in `src/pages/YourPage.jsx`
2. Add route in `src/App.jsx`:

```javascript
<Route path="/your-page" element={<YourPage />} />
```

3. Add link in navigation menu

### Modify Cart Behavior

Edit `src/context/CartContext.jsx` to change:
- How items are added to cart
- Quantity limits
- Price calculations
- Local storage behavior

### Add Animations

Install Framer Motion:

```bash
npm install framer-motion
```

Then use in components:

```javascript
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Your content
</motion.div>
```

## 📊 Analytics Integration

### Add Google Analytics

1. Get your GA tracking ID
2. Add to `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

## 🎨 Custom Components

### Create Reusable Component

Create file in `src/components/YourComponent.jsx`:

```javascript
const YourComponent = ({ prop1, prop2 }) => {
  return (
    <div className="your-classes">
      {/* Your component JSX */}
    </div>
  );
};

export default YourComponent;
```

Use in pages:

```javascript
import YourComponent from '../components/YourComponent';

<YourComponent prop1="value" prop2="value" />
```

## 💡 Tips

1. **Always test after changes**: Run `npm run dev` and check the website
2. **Keep backups**: Use Git to track changes
3. **Optimize images**: Use WebP format and compress images
4. **Mobile first**: Always check mobile view
5. **Consistent naming**: Use clear, descriptive names for files and variables
6. **Comment your code**: Add comments for complex logic
7. **Use version control**: Commit changes regularly

## 🆘 Common Issues

### Images not loading
- Check image URLs are accessible
- Use HTTPS URLs
- Check CORS settings

### Styles not applying
- Clear browser cache
- Check class names match Tailwind config
- Restart dev server

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Check for syntax errors
- Review error messages carefully

## 📚 Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [Lucide Icons](https://lucide.dev)

---

Need help? Contact: info@geethikadigitalworld.com
