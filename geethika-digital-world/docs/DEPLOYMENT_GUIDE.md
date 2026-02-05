# Complete Deployment Guide - Geethika Digital World

## Admin Access After Deployment

### Development (Current):
```
http://localhost:5173/admin/login
```

### Production (After Deployment):
```
https://yourdomain.com/admin/login
OR
https://www.geethikadigitalworld.com/admin/login
```

**The route `/admin/login` remains the same!** Only the domain changes.

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)
**Best for:** Frontend + Backend together or separate deployments

#### Frontend Deployment (Vercel)

1. **Prepare Frontend:**
```bash
cd client
npm run build
```

2. **Install Vercel CLI:**
```bash
npm install -g vercel
```

3. **Deploy:**
```bash
vercel
```

4. **Configure Environment Variables in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.com
     VITE_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
     ```

5. **Your Admin URL will be:**
```
https://your-project.vercel.app/admin/login
```

#### Backend Deployment (Vercel)

1. **Create `vercel.json` in backend folder:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

2. **Deploy Backend:**
```bash
cd backend
vercel
```

3. **Add Environment Variables in Vercel:**
   - DATABASE_URL
   - JWT_SECRET
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET
   - EMAIL_USER
   - EMAIL_PASS
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET

---

### Option 2: Netlify (Frontend) + Render (Backend)

#### Frontend on Netlify

1. **Build Command:**
```bash
npm run build
```

2. **Publish Directory:**
```
dist
```

3. **Environment Variables:**
```
VITE_API_URL=https://your-backend.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
```

4. **Create `_redirects` file in `client/public`:**
```
/*    /index.html   200
```

5. **Admin URL:**
```
https://your-site.netlify.app/admin/login
```

#### Backend on Render

1. **Create `render.yaml` in backend:**
```yaml
services:
  - type: web
    name: geethika-backend
    env: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: RAZORPAY_KEY_ID
        sync: false
      - key: RAZORPAY_KEY_SECRET
        sync: false
```

2. **Connect GitHub and Deploy**

---

### Option 3: Railway (Full Stack)

1. **Install Railway CLI:**
```bash
npm install -g @railway/cli
```

2. **Login:**
```bash
railway login
```

3. **Deploy Backend:**
```bash
cd backend
railway init
railway up
```

4. **Deploy Frontend:**
```bash
cd client
railway init
railway up
```

5. **Add Environment Variables in Railway Dashboard**

---

### Option 4: DigitalOcean / AWS / VPS

#### Using PM2 for Process Management

1. **Install PM2:**
```bash
npm install -g pm2
```

2. **Backend Setup:**
```bash
cd backend
npm install
pm2 start server.js --name geethika-backend
pm2 save
pm2 startup
```

3. **Frontend Build:**
```bash
cd client
npm run build
```

4. **Serve with Nginx:**

Create `/etc/nginx/sites-available/geethika`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/geethika/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Enable Site:**
```bash
sudo ln -s /etc/nginx/sites-available/geethika /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

6. **SSL Certificate (Let's Encrypt):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

7. **Admin URL:**
```
https://yourdomain.com/admin/login
```

---

## Environment Variables Setup

### Frontend (.env)
```env
# Production
VITE_API_URL=https://api.yourdomain.com
VITE_RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX

# Development (keep for local testing)
# VITE_API_URL=http://localhost:5000
# VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
```

### Backend (.env)
```env
# Server
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Razorpay
RAZORPAY_KEY_ID=rzp_live_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
FRONTEND_URL=https://yourdomain.com
```

---

## Database Setup (Production)

### Option 1: Neon (PostgreSQL - Free Tier)
1. Go to https://neon.tech
2. Create account and database
3. Copy connection string
4. Add to backend environment variables

### Option 2: Supabase (PostgreSQL - Free Tier)
1. Go to https://supabase.com
2. Create project
3. Get connection string from Settings → Database
4. Add to backend environment variables

### Option 3: Railway PostgreSQL
1. Add PostgreSQL plugin in Railway
2. Connection string auto-generated
3. Use in backend

### Option 4: DigitalOcean Managed Database
1. Create managed PostgreSQL database
2. Get connection details
3. Configure firewall rules
4. Add connection string to backend

---

## Pre-Deployment Checklist

### Code Changes Required:

1. **Update API URLs in Frontend:**
   - All `http://localhost:5000` should use `VITE_API_URL` from env
   - Check all files for hardcoded URLs

2. **Update CORS in Backend:**
```javascript
// backend/server.js
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};
app.use(cors(corsOptions));
```

3. **Update Razorpay Keys:**
   - Switch from test keys to live keys
   - Update in both frontend and backend .env

4. **Update Email Configuration:**
   - Use production email credentials
   - Test email sending

5. **Update Business Information:**
   - Replace placeholder addresses in policy pages
   - Update contact information
   - Update Google Maps location

### Security Checklist:

- [ ] Change JWT_SECRET to strong random string
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS/SSL certificate
- [ ] Set secure cookie flags
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Sanitize user inputs
- [ ] Use prepared statements (already done)
- [ ] Enable database SSL connection
- [ ] Set up database backups

### Testing Checklist:

- [ ] Test admin login at `/admin/login`
- [ ] Test all admin features
- [ ] Test customer registration/login
- [ ] Test product browsing
- [ ] Test cart functionality
- [ ] Test checkout process
- [ ] Test Razorpay payment (small amount)
- [ ] Test order creation
- [ ] Test email notifications
- [ ] Test image uploads
- [ ] Test all policy pages
- [ ] Test mobile responsiveness
- [ ] Test on different browsers

---

## Admin Access After Deployment

### How to Access Admin Panel:

1. **Navigate to:**
```
https://yourdomain.com/admin/login
```

2. **Login with admin credentials:**
   - Email: admin@geethikadigitalworld.com (or your admin email)
   - Password: (set during admin creation)

3. **If you forgot admin credentials, create new admin:**
```bash
# SSH into your server or use database client
node backend/scripts/create-admin.js
```

### Securing Admin Access:

1. **Use Strong Password:**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, symbols

2. **Consider IP Whitelisting (Optional):**
```nginx
# In Nginx config
location /admin {
    allow YOUR_IP_ADDRESS;
    deny all;
    # ... rest of config
}
```

3. **Enable 2FA (Future Enhancement):**
   - Consider adding two-factor authentication
   - Use authenticator apps

4. **Monitor Admin Access:**
   - Log all admin logins
   - Set up alerts for suspicious activity

---

## Post-Deployment Steps

1. **Test Everything:**
   - Go through entire user flow
   - Test admin panel thoroughly
   - Make a test purchase

2. **Set Up Monitoring:**
   - Use services like UptimeRobot
   - Set up error tracking (Sentry)
   - Monitor server resources

3. **Configure Backups:**
   - Database backups (daily)
   - File backups (weekly)
   - Store backups off-site

4. **Set Up Analytics:**
   - Google Analytics
   - Track conversions
   - Monitor user behavior

5. **SEO Setup:**
   - Submit sitemap to Google
   - Set up Google Search Console
   - Add meta tags
   - Configure robots.txt

6. **Performance Optimization:**
   - Enable CDN (Cloudflare)
   - Optimize images
   - Enable caching
   - Minify assets

---

## Common Deployment Issues & Solutions

### Issue 1: Admin Login Not Working
**Solution:**
- Check if admin user exists in production database
- Run create-admin script on production
- Verify JWT_SECRET is set correctly
- Check CORS configuration

### Issue 2: API Calls Failing
**Solution:**
- Verify VITE_API_URL is set correctly
- Check CORS settings in backend
- Ensure backend is running
- Check network tab in browser DevTools

### Issue 3: Images Not Loading
**Solution:**
- Verify Cloudinary credentials
- Check image upload permissions
- Ensure HTTPS for image URLs
- Check CORS for image domains

### Issue 4: Payment Gateway Not Working
**Solution:**
- Use live Razorpay keys (not test keys)
- Verify webhook URL is set
- Check HTTPS is enabled
- Test with small amount first

### Issue 5: Database Connection Failed
**Solution:**
- Verify DATABASE_URL is correct
- Check database is running
- Verify SSL settings
- Check firewall rules

---

## Maintenance

### Regular Tasks:

**Daily:**
- Monitor error logs
- Check order processing
- Verify payment gateway

**Weekly:**
- Review analytics
- Check server resources
- Update products/content

**Monthly:**
- Database backup verification
- Security updates
- Performance review
- Update dependencies

### Update Process:

1. **Test locally first**
2. **Create backup**
3. **Deploy to staging (if available)**
4. **Test on staging**
5. **Deploy to production**
6. **Monitor for issues**
7. **Rollback if needed**

---

## Support & Resources

### Documentation:
- Vercel: https://vercel.com/docs
- Netlify: https://docs.netlify.com
- Railway: https://docs.railway.app
- Render: https://render.com/docs

### Payment Gateway:
- Razorpay Docs: https://razorpay.com/docs
- Razorpay Support: support@razorpay.com

### Database:
- PostgreSQL Docs: https://www.postgresql.org/docs
- Neon Docs: https://neon.tech/docs
- Supabase Docs: https://supabase.com/docs

---

## Quick Deployment Commands

### Vercel (Fastest):
```bash
# Frontend
cd client
vercel --prod

# Backend
cd backend
vercel --prod
```

### Railway:
```bash
# Frontend
cd client
railway up

# Backend
cd backend
railway up
```

### Manual VPS:
```bash
# Pull latest code
git pull origin main

# Backend
cd backend
npm install
pm2 restart geethika-backend

# Frontend
cd client
npm install
npm run build
sudo cp -r dist/* /var/www/geethika/
```

---

## Final Notes

1. **Admin URL never changes** - it's always `/admin/login`, just the domain changes
2. **Test with small amounts** before going fully live
3. **Keep backups** of database and files
4. **Monitor regularly** for issues
5. **Update dependencies** for security
6. **Use HTTPS** always in production
7. **Document your deployment** process

**Your admin panel will be accessible at:**
```
https://yourdomain.com/admin/login
```

Good luck with your deployment! 🚀
