# ⚡ Vercel Quick Start - 5 Minutes

Deploy your frontend to Vercel in 5 simple steps.

---

## 🚀 Step 1: Sign Up (1 minute)

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

✅ **Done!** You're logged in.

---

## 📦 Step 2: Import Project (1 minute)

1. Click **"Add New..."** → **"Project"**
2. Find your repository: `geethika-digital-world`
3. Click **"Import"**

✅ **Done!** Project imported.

---

## ⚙️ Step 3: Configure (2 minutes)

### Set Root Directory
```
Root Directory: client
```
Click "Edit" and type `client`

### Add Environment Variable
```
Name: VITE_API_URL
Value: https://your-backend.onrender.com
```
(Replace with your actual backend URL)

### Verify Settings
```
Framework: Vite ✓
Build Command: npm run build ✓
Output Directory: dist ✓
```

✅ **Done!** Configuration complete.

---

## 🎯 Step 4: Deploy (1 minute)

1. Click **"Deploy"**
2. Wait for build (2-3 minutes)
3. Watch the logs

✅ **Done!** Deployment in progress.

---

## ✨ Step 5: Verify (30 seconds)

1. See confetti animation 🎉
2. Click **"Visit"** to see your site
3. Test a few pages

✅ **Done!** Your site is live!

---

## 🔗 Your URLs

After deployment:
```
Production: https://your-project.vercel.app
Admin Panel: https://your-project.vercel.app/admin/login
```

---

## 🔄 Update Backend CORS

**Important**: Update your backend environment variable:

```bash
FRONTEND_URL=https://your-project.vercel.app
```

Then redeploy your backend.

---

## 🎉 That's It!

Your frontend is live in 5 minutes!

**Need more details?** See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

---

## 🐛 Quick Troubleshooting

### Build Failed?
- Check build logs for errors
- Verify `package.json` scripts
- Try `npm run build` locally

### API Not Working?
- Check `VITE_API_URL` is set correctly
- Update backend CORS
- Check browser console for errors

### 404 on Refresh?
- Verify `vercel.json` exists in `client` folder
- Should have rewrites configuration

---

## 📞 Need Help?

- Full Guide: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support

---

**Total Time**: ~5 minutes
**Difficulty**: Easy ⭐
**Cost**: Free tier available
