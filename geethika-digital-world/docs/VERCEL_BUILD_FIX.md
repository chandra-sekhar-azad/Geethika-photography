# 🔧 Vercel Build Error Fix

Fix for the Rollup module error during Vercel deployment.

---

## ❌ Error

```
Error: Cannot find module @rollup/rollup-linux-x64-gnu
```

This is a known npm bug with optional dependencies.

---

## ✅ Solution

### Option 1: Configure Vercel Settings (Recommended)

1. **Go to your Vercel project settings**
2. **Click "General" tab**
3. **Scroll to "Build & Development Settings"**
4. **Configure as follows**:

```
Framework Preset: Other
Root Directory: client
Build Command: npm ci && npm run build
Output Directory: dist
Install Command: npm ci
Node.js Version: 18.x
```

5. **Save and redeploy**

### Option 2: Use Root vercel.json

The root `vercel.json` file has been created with proper configuration.

**In Vercel Dashboard**:
1. Go to Project Settings
2. Set Root Directory to: `.` (root)
3. Vercel will use the `vercel.json` configuration

### Option 3: Delete package-lock.json

1. **In your local repository**:
```bash
cd client
rm package-lock.json
rm -rf node_modules
npm install
git add package-lock.json
git commit -m "fix: regenerate package-lock.json"
git push
```

2. **Redeploy on Vercel**

---

## 🎯 Recommended Vercel Configuration

### Project Settings

```
Framework Preset: Vite
Root Directory: client
Build Command: npm ci && npm run build
Output Directory: dist
Install Command: npm ci
Node.js Version: 18.x
```

### Environment Variables

```
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🔍 Why This Happens

The error occurs because:
1. npm has a bug with optional dependencies
2. Rollup's platform-specific binaries aren't installed correctly
3. The build environment (Linux x64) doesn't match local (Windows)

---

## ✅ Verification Steps

After applying the fix:

1. **Check build logs** - Should show successful build
2. **Visit your site** - Should load without errors
3. **Check console** - No module errors
4. **Test API calls** - Should connect to backend

---

## 🚀 Quick Fix Commands

If you want to try locally first:

```bash
# Navigate to client directory
cd client

# Clean install
rm -rf node_modules package-lock.json
npm install

# Test build
npm run build

# If successful, commit and push
git add .
git commit -m "fix: resolve rollup dependency issue"
git push
```

---

## 📝 Alternative: Use pnpm

If npm continues to have issues, switch to pnpm:

1. **In Vercel Project Settings**:
```
Install Command: pnpm install
Build Command: pnpm run build
```

2. **Add pnpm-lock.yaml to your repo**:
```bash
cd client
npm install -g pnpm
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: switch to pnpm"
git push
```

---

## 🆘 Still Having Issues?

### Check These:

1. **Node.js Version**
   - Use Node 18.x or 20.x
   - Avoid Node 24.x (too new, may have compatibility issues)

2. **Package.json**
   - Ensure all dependencies are listed
   - No missing peer dependencies

3. **Build Command**
   - Use `npm ci` instead of `npm install` (faster, more reliable)
   - Ensure it works locally first

4. **Vercel Logs**
   - Check full build logs for other errors
   - Look for dependency conflicts

---

## 📞 Support

If the issue persists:
1. Check Vercel Status: https://www.vercel-status.com
2. Vercel Support: https://vercel.com/support
3. GitHub Issue: https://github.com/npm/cli/issues/4828

---

## ✨ Success!

Once fixed, your deployment should complete successfully:
```
✅ Build completed
✅ Deployment ready
🎉 Visit: https://your-app.vercel.app
```

---

**Last Updated**: February 2026
