# Background Image Setup Guide

## How to Add the Bokeh Background Image

The homepage is now configured to use a beautiful bokeh photography background. Follow these steps to add your image:

### Option 1: Local Image (Recommended)

1. Save the bokeh background image you provided to:
   ```
   geethika-digital-world/client/public/images/bokeh-background.jpg
   ```

2. The image is already configured in `HomePage.jsx` to use this path:
   ```javascript
   backgroundImage: 'url(/images/bokeh-background.jpg)'
   ```

3. Make sure the `public/images/` directory exists. If not, create it:
   ```bash
   mkdir -p geethika-digital-world/client/public/images
   ```

4. Copy your image file there and name it `bokeh-background.jpg`

### Option 2: Use a CDN/External URL

If you prefer to host the image externally:

1. Upload your image to a service like:
   - Imgur
   - Cloudinary
   - Your own CDN
   - Unsplash (if using a similar stock photo)

2. Update the `HomePage.jsx` file, line with `backgroundImage`:
   ```javascript
   backgroundImage: 'url(https://your-cdn-url.com/bokeh-background.jpg)'
   ```

### Current Implementation Features

The homepage now includes:

✅ **Fixed Background**: The bokeh image stays in place while content scrolls
✅ **Dark Overlay**: 75-85% black gradient for text readability
✅ **Animated Bokeh Lights**: Orange glowing orbs that float across the screen
✅ **Responsive**: Works on all screen sizes
✅ **Performance**: Uses CSS background-attachment for smooth scrolling

### Image Specifications

For best results, your background image should be:
- **Format**: JPG or WebP
- **Dimensions**: At least 1920x1080px (Full HD)
- **File Size**: Optimized to under 500KB for fast loading
- **Quality**: High quality but compressed

### Testing

After adding the image:
1. Start your development server: `npm run dev`
2. Navigate to the homepage
3. You should see the warm bokeh background with floating orange lights
4. Scroll to verify the fixed background effect works

### Troubleshooting

**Image not showing?**
- Check the file path is correct
- Verify the image file exists in `public/images/`
- Check browser console for 404 errors
- Clear browser cache and refresh

**Image too bright/dark?**
- Adjust the overlay opacity in `HomePage.jsx`
- Change `from-black/85 via-black/75 to-black/85` values
- Higher numbers = darker overlay

**Performance issues?**
- Compress the image using tools like TinyPNG
- Consider using WebP format
- Reduce image dimensions if too large
