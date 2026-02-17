# Setup Background Image - Quick Guide

## ✅ What's Been Done

The HomePage is now configured to use your bokeh background image from:
```
/images/bokeh-background.jpg
```

## 📋 Next Steps - Add Your Image

### Step 1: Create the images folder (if it doesn't exist)

Navigate to your project and run:
```bash
cd geethika-digital-world/client/public
mkdir images
```

Or on Windows:
```cmd
cd geethika-digital-world\client\public
mkdir images
```

### Step 2: Save your bokeh image

Save the bokeh photography image (the one with camera, mugs, and gifts) as:
```
geethika-digital-world/client/public/images/bokeh-background.jpg
```

**Important**: The file must be named exactly `bokeh-background.jpg`

### Step 3: Test it

1. Start your development server:
   ```bash
   cd geethika-digital-world/client
   npm run dev
   ```

2. Open your browser to `http://localhost:5173`

3. You should see your bokeh background on the homepage!

## 🎨 Current Settings

The background is configured with:
- **Fixed attachment**: Creates a parallax effect when scrolling
- **Dark overlay**: 60-75% opacity for text readability
- **Warm tint**: Subtle orange overlay to enhance the warm lighting
- **Full coverage**: Image covers entire viewport

## 🔧 Troubleshooting

**Image not showing?**
- Check the file path: `client/public/images/bokeh-background.jpg`
- Verify the filename is exactly `bokeh-background.jpg` (case-sensitive on some systems)
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check browser console for 404 errors

**Image too bright/dark?**
Edit `HomePage.jsx` line 20 to adjust overlay:
```javascript
// Lighter: from-black/50 via-black/40 to-black/60
// Darker: from-black/80 via-black/70 to-black/85
```

**Image quality issues?**
- Ensure image is at least 1920x1080px
- Compress using TinyPNG or similar tool
- Consider using WebP format for better compression

## 📁 File Structure

Your project should look like:
```
geethika-digital-world/
├── client/
│   ├── public/
│   │   ├── images/
│   │   │   └── bokeh-background.jpg  ← Your image goes here
│   │   └── ...
│   └── src/
│       └── pages/
│           └── HomePage.jsx  ← Already configured
```

## ✨ That's It!

Once you save the image in the correct location, your homepage will display the beautiful bokeh photography background!
