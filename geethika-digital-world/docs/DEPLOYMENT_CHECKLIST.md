# 🚀 Quick Deployment Checklist

Use this checklist to ensure smooth deployment of Geethika Digital World.

---

## 📋 Pre-Deployment

### Code Preparation
- [ ] All code is committed to Git
- [ ] Code is pushed to GitHub
- [ ] `.env` files are in `.gitignore`
- [ ] No sensitive data in code
- [ ] All dependencies are in `package.json`

### Accounts Setup
- [ ] GitHub account created
- [ ] Vercel account created (https://vercel.com)
- [ ] Render account created (https://render.com)
- [ ] Razorpay account with API keys
- [ ] Gmail App Password generated

---

## 🗄️ Database Setup (Render)

- [ ] PostgreSQL database created on Render
- [ ] Database name: `geethika_db`
- [ ] Internal Database URL copied
- [ ] External Database URL copied (for testing)
- [ ] Database is running (green status)

### Database Initialization
- [ ] Connected to database
- [ ] Admin user created (`node scripts/create-admin.js`)
- [ ] Services table created
- [ ] Categories added
- [ ] WhatsApp templates table created
- [ ] Gallery table created
- [ ] Sample data populated

---

## 🖥️ Backend Deployment (Render)

### Service Configuration
- [ ] Web Service created on Render
- [ ] Repository connected
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Region selected (Singapore recommended)

### Environment Variables Set
- [ ] `DATABASE_URL` (Internal URL from Render)
- [ ] `JWT_SECRET` (min 32 characters)
- [ ] `NODE_ENV=production`
- [ ] `PORT=10000`
- [ ] `RAZORPAY_KEY_ID`
- [ ] `RAZORPAY_KEY_SECRET`
- [ ] `EMAIL_USER`
- [ ] `EMAIL_PASSWORD`
- [ ] `EMAIL_FROM`
- [ ] `FRONTEND_URL` (will update after Vercel deployment)

### Deployment Status
- [ ] Backend deployed successfully
- [ ] Backend URL noted: `https://__________.onrender.com`
- [ ] Health check passes: `curl https://your-backend.onrender.com/`
- [ ] API test passes: `curl https://your-backend.onrender.com/api/products`
- [ ] Logs show no errors

---

## 🌐 Frontend Deployment (Vercel)

### Project Configuration
- [ ] Project imported from GitHub
- [ ] Framework preset: Vite
- [ ] Root directory: `client`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### Environment Variables Set
- [ ] `VITE_API_URL` (Backend URL from Render)

### Deployment Status
- [ ] Frontend deployed successfully
- [ ] Frontend URL noted: `https://__________.vercel.app`
- [ ] Website loads correctly
- [ ] No console errors in browser

---

## 🔄 Post-Deployment Configuration

### Update Backend CORS
- [ ] Go back to Render backend settings
- [ ] Update `FRONTEND_URL` with Vercel URL
- [ ] Backend redeployed/restarted
- [ ] CORS working (no errors in browser console)

### Verify Integration
- [ ] Frontend can connect to backend
- [ ] API calls working
- [ ] Images loading correctly
- [ ] No CORS errors

---

## ✅ Testing Checklist

### Customer Features
- [ ] Homepage loads
- [ ] Products page displays products
- [ ] Product details page works
- [ ] Add to cart works
- [ ] Cart page displays items
- [ ] User registration works
- [ ] User login works
- [ ] Checkout page loads
- [ ] Payment gateway initializes
- [ ] Test order placement (use test mode)
- [ ] Order confirmation received
- [ ] Email notifications sent

### Admin Features
- [ ] Admin login page accessible: `/admin/login`
- [ ] Admin can login with credentials
- [ ] Dashboard shows statistics
- [ ] Product management works
- [ ] Service management works
- [ ] Order management works
- [ ] Customer database loads
- [ ] Sales report displays
- [ ] Gallery management works
- [ ] Analytics page loads
- [ ] WhatsApp templates load
- [ ] WhatsApp campaigns work

### Security & Performance
- [ ] HTTPS enabled (automatic)
- [ ] Security headers present
- [ ] Rate limiting working
- [ ] File uploads work
- [ ] Images display correctly
- [ ] Page load time acceptable
- [ ] Mobile responsive
- [ ] No console errors
- [ ] No broken links

---

## 📊 Monitoring Setup

- [ ] Render dashboard bookmarked
- [ ] Vercel dashboard bookmarked
- [ ] Error monitoring configured
- [ ] Log retention understood
- [ ] Backup strategy planned

---

## 🔐 Security Final Checks

- [ ] Admin password is strong
- [ ] JWT secret is random and long
- [ ] Razorpay keys are for production (not test)
- [ ] Email credentials secure
- [ ] Database password strong
- [ ] No `.env` files in Git
- [ ] All secrets in environment variables
- [ ] HTTPS enforced
- [ ] CORS properly configured

---

## 📝 Documentation

- [ ] Admin credentials saved securely
- [ ] Backend URL documented
- [ ] Frontend URL documented
- [ ] Database credentials saved
- [ ] API keys documented
- [ ] Deployment guide reviewed
- [ ] Team members informed

---

## 🎯 Go-Live Checklist

### Final Verification
- [ ] All features tested end-to-end
- [ ] Payment gateway in live mode
- [ ] Email notifications working
- [ ] Admin panel accessible
- [ ] Customer can place orders
- [ ] Orders appear in admin panel
- [ ] Database backups configured
- [ ] Monitoring alerts set up

### Communication
- [ ] Team notified of deployment
- [ ] Admin credentials shared securely
- [ ] Support contacts documented
- [ ] Maintenance schedule planned

### Post-Launch
- [ ] Monitor logs for first 24 hours
- [ ] Check for errors
- [ ] Verify order flow
- [ ] Test payment processing
- [ ] Monitor performance
- [ ] Collect user feedback

---

## 🆘 Emergency Contacts

**Render Support**: https://render.com/docs/support
**Vercel Support**: https://vercel.com/support
**Razorpay Support**: https://razorpay.com/support

---

## 📞 Rollback Plan

If something goes wrong:

1. **Frontend Issues**:
   - Revert to previous deployment in Vercel
   - Check environment variables
   - Review build logs

2. **Backend Issues**:
   - Check Render logs
   - Verify environment variables
   - Restart service
   - Rollback to previous commit if needed

3. **Database Issues**:
   - Restore from backup
   - Check connection strings
   - Verify database is running

---

## ✨ Success Criteria

Your deployment is successful when:

- ✅ Website is accessible via HTTPS
- ✅ All pages load without errors
- ✅ Customers can browse and purchase
- ✅ Admin can manage the store
- ✅ Payments are processing
- ✅ Emails are being sent
- ✅ No critical errors in logs
- ✅ Performance is acceptable
- ✅ Mobile experience is good

---

## 🎉 Deployment Complete!

Congratulations! Your application is now live in production.

**Next Steps**:
1. Monitor for 24-48 hours
2. Gather user feedback
3. Plan regular maintenance
4. Keep dependencies updated
5. Regular database backups

---

**Deployment Date**: __________
**Deployed By**: __________
**Version**: 1.0.0
