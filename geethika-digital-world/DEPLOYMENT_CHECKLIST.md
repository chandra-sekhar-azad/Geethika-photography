# Deployment Checklist - Geethika Digital World

## ✅ Pre-Deployment Checklist

### 1. Business Information
- [ ] Update WhatsApp business number in all files
  - [ ] `src/components/WhatsAppFloat.jsx`
  - [ ] `src/pages/ServicesPage.jsx`
  - [ ] `src/pages/CartPage.jsx`
  - [ ] `src/pages/ContactPage.jsx`
- [ ] Update business address in `src/pages/ContactPage.jsx`
- [ ] Update email address in footer and contact page
- [ ] Update business hours in contact page
- [ ] Update Google Maps embed URL

### 2. Products & Services
- [ ] Replace placeholder product images with actual images
- [ ] Update product prices
- [ ] Add/remove products as needed
- [ ] Update service packages and pricing
- [ ] Add actual service images

### 3. Branding
- [ ] Add company logo to `public/` folder
- [ ] Update favicon in `index.html`
- [ ] Update meta tags for SEO
- [ ] Add Open Graph tags for social sharing
- [ ] Update company description in footer

### 4. Images
- [ ] Upload all product images to Cloudinary
- [ ] Replace Unsplash URLs with Cloudinary URLs
- [ ] Optimize images for web (WebP format recommended)
- [ ] Add alt text to all images for SEO

### 5. Testing
- [ ] Test all navigation links
- [ ] Test product customization flow
- [ ] Test add to cart functionality
- [ ] Test service booking form
- [ ] Test WhatsApp integration
- [ ] Test on mobile devices
- [ ] Test on different browsers (Chrome, Firefox, Safari, Edge)
- [ ] Check responsive design on all screen sizes

### 6. Performance
- [ ] Run `npm run build` successfully
- [ ] Check bundle size (should be under 500KB)
- [ ] Test page load speed
- [ ] Optimize images if needed
- [ ] Enable compression on server

### 7. SEO
- [ ] Add meta description to `index.html`
- [ ] Add keywords meta tag
- [ ] Create `robots.txt` file
- [ ] Create `sitemap.xml` file
- [ ] Add structured data (JSON-LD) for products
- [ ] Set up Google Analytics (optional)

### 8. Security
- [ ] Remove any console.log statements
- [ ] Check for exposed API keys
- [ ] Set up HTTPS (Vercel provides this automatically)
- [ ] Add security headers

## 🚀 Deployment Steps

### Deploy to Vercel

#### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Method 2: GitHub Integration
1. Push code to GitHub repository
2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite configuration
6. Click "Deploy"

### Environment Variables (if needed)
Add these in Vercel dashboard:
- `VITE_WHATSAPP_NUMBER` - Your WhatsApp business number
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key (if using)
- `VITE_RAZORPAY_KEY` - Razorpay key (for Phase 2)

## 📱 Post-Deployment

### 1. Verify Deployment
- [ ] Visit deployed URL
- [ ] Test all pages
- [ ] Test all forms
- [ ] Test WhatsApp integration
- [ ] Check mobile responsiveness
- [ ] Test on different devices

### 2. Domain Setup (Optional)
- [ ] Purchase custom domain
- [ ] Add domain to Vercel
- [ ] Update DNS settings
- [ ] Wait for SSL certificate

### 3. Marketing
- [ ] Share website link on social media
- [ ] Add website to Google Business Profile
- [ ] Create social media posts
- [ ] Send announcement to existing customers

### 4. Monitoring
- [ ] Set up Vercel Analytics
- [ ] Monitor error logs
- [ ] Track page views
- [ ] Monitor performance metrics

## 🔄 Phase 2 Preparation

### Backend Development
- [ ] Set up Node.js + Express server
- [ ] Set up PostgreSQL database
- [ ] Create API endpoints
- [ ] Implement authentication
- [ ] Set up Cloudinary for image uploads
- [ ] Integrate Razorpay payment gateway

### Admin Dashboard
- [ ] Create admin login
- [ ] Build product management interface
- [ ] Build order management system
- [ ] Create customer database view
- [ ] Add sales reporting

### Deployment
- [ ] Deploy backend to Render
- [ ] Connect frontend to backend API
- [ ] Test end-to-end flow
- [ ] Set up database backups

## 📞 Support Contacts

- **Technical Issues**: Check GitHub issues or contact developer
- **Business Queries**: info@geethikadigitalworld.com
- **WhatsApp**: +91 98765 43210

## 🎉 Launch Day Checklist

- [ ] Final testing complete
- [ ] All content updated
- [ ] Social media posts scheduled
- [ ] Customer announcement sent
- [ ] Team briefed on new website
- [ ] Monitor website for first few hours
- [ ] Respond to customer feedback

---

**Note**: This is Phase 1 (Frontend Only). Backend integration and admin dashboard will be developed in Phase 2.

**Estimated Timeline**:
- Pre-deployment setup: 2-3 hours
- Deployment: 30 minutes
- Testing: 1-2 hours
- Total: 4-6 hours

Good luck with your launch! 🚀
