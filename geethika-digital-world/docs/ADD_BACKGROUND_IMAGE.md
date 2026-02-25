# How to Add Your Bokeh Background Image

## Quick Setup

Your homepage is now configured to use the bokeh photography background. To use your actual image:

### Option 1: Save Image Locally (Recommended)

1. **Save the image** you provided to this exact location:
   ```
   geethika-digital-world/client/public/images/bokeh-background.jpg
   ```

2. **Update HomePage.jsx** (line 11) to use the local image:
   ```javascript
   backgroundImage: 'url(/images/bokeh-background.jpg)',
   ```

### Option 2: Use Image from URL

If you've uploaded the image to a hosting service:

1. Upload your bokeh image to:
   - Imgur: https://imgur.com/upload
   - Cloudinary: https://cloudinary.com
   - Or any image hosting service

2. Copy the direct image URL

3. Update `HomePage.jsx` line 11 with your URL:
   ```javascript
   backgroundImage: 'url(YOUR_IMAGE_URL_HERE)',
   ```

## Current Setup

The homepage currently uses a similar bokeh effect image from Unsplash as a placeholder. The styling includes:

✅ Fixed background (parallax effect)
✅ Warm overlay to match the bokeh lighting
✅ Optimized for readability with dark gradient
✅ Responsive design

## Image Specifications

For best results:
- **Format**: JPG or WebP
- **Size**: 1920x1080px or larger
- **File size**: Under 500KB (compress if needed)
- **Aspect ratio**: 16:9 or wider

## Testing

After adding your image:
1. Run `npm run dev` in the client folder
2. Open http://localhost:5173
3. You should see your bokeh background with the warm lighting effect

## Need Help?

If the image doesn't show:
- Check the file path is correct
- Verify the image file exists
- Check browser console for errors
- Try clearing browser cache
