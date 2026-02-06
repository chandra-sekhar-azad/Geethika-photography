# Frontend Deployment Commands

## Quick Reference

### Install Command
```bash
npm install
```

### Build Command
```bash
npm run build
```

### Output Directory
```
dist/
```

---

## Complete Deployment Guide

### 1. Local Development

```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Access at: http://localhost:5173
```

### 2. Production Build

```bash
# Navigate to client folder
cd client

# Install dependencies (if not already installed)
npm install

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Platform-Specific Deployment

### Vercel Deployment

**Option 1: Vercel CLI**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to client folder
cd client

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Option 2: Vercel Dashboard**
1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

**Environment Variables (Vercel):**
```
VITE_API_URL=https://your-backend-url.com
```

### Netlify Deployment

**Option 1: Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to client folder
cd client

# Build
npm run build

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

**Option 2: Netlify Dashboard**
1. Go to https://netlify.com
2. Import your repository
3. Configure:
   - **Base Directory:** `client`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `client/dist`
   - **Install Command:** `npm install`

**netlify.toml** (create in client folder):
```toml
[build]
  base = "client"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Render Deployment

1. Go to https://render.com
2. Create new Static Site
3. Configure:
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `client/dist`

**Environment Variables:**
```
VITE_API_URL=https://your-backend-url.onrender.com
```

### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Navigate to client folder
cd client

# Initialize
railway init

# Deploy
railway up
```

**railway.json** (create in client folder):
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run preview",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### GitHub Pages Deployment

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

**vite.config.js** (update for GitHub Pages):
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

---

## Docker Deployment

**Dockerfile** (create in client folder):
```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf** (create in client folder):
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Build and Run:**
```bash
# Build Docker image
docker build -t geethika-frontend .

# Run container
docker run -p 80:80 geethika-frontend
```

---

## Environment Variables

### Development (.env)
```env
VITE_API_URL=http://localhost:5000
```

### Production (.env.production)
```env
VITE_API_URL=https://api.yourdomain.com
```

### Setting Environment Variables

**Vercel:**
- Dashboard → Settings → Environment Variables
- Add: `VITE_API_URL` = `https://your-backend-url.com`

**Netlify:**
- Site Settings → Build & Deploy → Environment
- Add: `VITE_API_URL` = `https://your-backend-url.com`

**Render:**
- Environment → Add Environment Variable
- Key: `VITE_API_URL`, Value: `https://your-backend-url.com`

---

## Build Optimization

### 1. Update vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'react-icons']
        }
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
```

### 2. Add .env.production

```env
VITE_API_URL=https://your-production-backend.com
```

---

## Troubleshooting

### Issue: Build fails with memory error

**Solution:**
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Issue: Routes not working after deployment

**Solution:** Add redirect rules

**Vercel** - Create `vercel.json` in client folder:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**Netlify** - Create `_redirects` in client/public:
```
/*    /index.html   200
```

### Issue: Environment variables not working

**Solution:** 
- Ensure variables start with `VITE_`
- Rebuild after changing env vars
- Check platform-specific env var settings

### Issue: Assets not loading

**Solution:** Check base path in vite.config.js:
```javascript
export default defineConfig({
  base: '/', // or '/your-subdirectory/'
})
```

---

## CI/CD Pipeline Examples

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      working-directory: ./client
      run: npm install
      
    - name: Build
      working-directory: ./client
      run: npm run build
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
        
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./client
```

---

## Performance Checklist

- [ ] Enable gzip compression
- [ ] Optimize images (use WebP)
- [ ] Lazy load routes
- [ ] Code splitting configured
- [ ] Remove console.logs
- [ ] Minification enabled
- [ ] Source maps disabled in production
- [ ] CDN configured (optional)
- [ ] Cache headers set
- [ ] Bundle size analyzed

---

## Quick Deploy Commands Summary

| Platform | Command |
|----------|---------|
| **Vercel** | `vercel --prod` |
| **Netlify** | `netlify deploy --prod` |
| **Railway** | `railway up` |
| **Docker** | `docker build -t app . && docker run -p 80:80 app` |
| **GitHub Pages** | `npm run deploy` |

---

## Post-Deployment Checklist

- [ ] Frontend accessible at production URL
- [ ] All routes working (test navigation)
- [ ] API calls working (check Network tab)
- [ ] Environment variables loaded
- [ ] Images loading correctly
- [ ] Forms submitting properly
- [ ] Authentication working
- [ ] Admin panel accessible
- [ ] Mobile responsive
- [ ] No console errors

---

## Support

For deployment issues:
1. Check build logs
2. Verify environment variables
3. Test production build locally: `npm run preview`
4. Check platform-specific documentation
5. Review error messages in browser console

---

**Quick Start:**
```bash
cd client
npm install
npm run build
```

**Output:** `dist/` folder ready for deployment!
