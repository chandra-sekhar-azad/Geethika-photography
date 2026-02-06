# 🚨 Fix Vercel Deployment NOW

Quick fixes for common Vercel deployment issues.

---

## ⚡ Issue 1: Build Failed

### Error Message
```
Error: Build failed with exit code 1
```

### Quick Fix

**Step 1**: Check your `client/package.json` has these scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Step 2**: In Vercel settings, set:
```
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Step 3**: Redeploy

---

## ⚡ Issue 2: Environment Variable Not Working

### Error Message
```
API calls failing, VITE_API_URL is undefined
```

### Quick Fix

**Step 1**: Go to Vercel Project Settings → Environment Variables

**Step 2**: Add variable:
```
Name: VITE_API_URL
Value: https://your-backend.onrender.com
Environment: Production ✓ Preview ✓ Development ✓
```

**Step 3**: Redeploy (important!)

**Step 4**: Verify in browser console:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

---

## ⚡ Issue 3: 404 on Page Refresh

### Error Message
```
404 - Page Not Found (when refreshing /shop or /admin)
```

### Quick Fix

**Step 1**: Ensure `client/vercel.json` exists with:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Step 2**: Commit and push to GitHub

**Step 3**: Vercel will auto-redeploy

---

## ⚡ Issue 4: CORS Error

### Error Message
```
Access to fetch at 'https://backend.onrender.com' has been blocked by CORS policy
```

### Quick Fix

**Step 1**: Get your Vercel URL (e.g., `https://your-app.vercel.app`)

**Step 2**: Go to Render → Your Backend → Environment

**Step 3**: Update or add:
```
FRONTEND_URL=https://your-app.vercel.app
```
(No trailing slash!)

**Step 4**: Render will auto-redeploy

**Step 5**: Wait 2 minutes, then test

---

## ⚡ Issue 5: Images Not Loading

### Error Message
```
Failed to load resource: 404 (Not Found)
```

### Quick Fix

**Option A**: Images in `public` folder
```
client/public/images/logo.png
→ Access as: /images/logo.png
```

**Option B**: Images imported
```javascript
import logo from './assets/logo.png'
<img src={logo} alt="Logo" />
```

**Option C**: Backend images
```javascript
// Ensure full URL
<img src={`${import.meta.env.VITE_API_URL}/uploads/image.jpg`} />
```

---

## ⚡ Issue 6: Root Directory Wrong

### Error Message
```
No package.json found
```

### Quick Fix

**Step 1**: Go to Vercel Project Settings → General

**Step 2**: Set Root Directory:
```
Root Directory: client
```

**Step 3**: Save and redeploy

---

## ⚡ Issue 7: Node Version Error

### Error Message
```
Error: The engine "node" is incompatible with this module
```

### Quick Fix

**Step 1**: Go to Vercel Project Settings → General

**Step 2**: Set Node.js Version:
```
Node.js Version: 18.x
```

**Step 3**: Redeploy

---

## ⚡ Issue 8: Build Timeout

### Error Message
```
Error: Build exceeded maximum duration
```

### Quick Fix

**Step 1**: Check for large dependencies

**Step 2**: Optimize `package.json`:
```bash
# Remove unused dependencies
npm uninstall <unused-package>

# Update package.json
```

**Step 3**: Use `npm ci` instead of `npm install`:
```
Install Command: npm ci
```

---

## ⚡ Issue 9: Deployment Stuck

### Symptom
Deployment shows "Building..." for more than 10 minutes

### Quick Fix

**Step 1**: Cancel deployment (click X)

**Step 2**: Go to Deployments tab

**Step 3**: Click "Redeploy" on last successful deployment

**Step 4**: If still stuck, contact Vercel support

---

## ⚡ Issue 10: Wrong Framework Detected

### Error Message
```
Framework Preset: Next.js (but you're using Vite)
```

### Quick Fix

**Step 1**: Go to Project Settings → General

**Step 2**: Change Framework Preset:
```
Framework Preset: Vite
```

**Step 3**: Verify settings:
```
Build Command: npm run build
Output Directory: dist
```

**Step 4**: Redeploy

---

## 🔧 Emergency Checklist

If deployment is failing, check these in order:

1. **Root Directory**
   - [ ] Set to `client`

2. **Environment Variables**
   - [ ] `VITE_API_URL` is set
   - [ ] All environments selected (Production, Preview, Development)

3. **Build Settings**
   - [ ] Framework: Vite
   - [ ] Build Command: `npm run build`
   - [ ] Output Directory: `dist`
   - [ ] Install Command: `npm install`

4. **Files**
   - [ ] `client/vercel.json` exists
   - [ ] `client/package.json` has build script
   - [ ] No syntax errors in code

5. **Backend**
   - [ ] Backend is running
   - [ ] CORS is configured
   - [ ] `FRONTEND_URL` is set

---

## 🆘 Still Not Working?

### Check Build Logs

1. Go to Vercel Dashboard
2. Click on failed deployment
3. Read the error message carefully
4. Look for the first error (not the last)

### Common Log Errors

**"Module not found"**
```bash
# Install missing dependency
npm install <package-name>
```

**"Unexpected token"**
```bash
# Syntax error in your code
# Check the file mentioned in error
```

**"Cannot find module"**
```bash
# Check import paths
# Ensure file exists
```

---

## 🔄 Force Fresh Deploy

If nothing works, try a fresh deploy:

**Step 1**: Delete `.vercel` folder (if exists locally)

**Step 2**: Clear Vercel cache:
```bash
# In Vercel Dashboard
Settings → General → Clear Cache
```

**Step 3**: Redeploy from GitHub:
```bash
# Push a small change
git commit --allow-empty -m "Trigger rebuild"
git push
```

---

## 📞 Get Help

### Vercel Support
- Dashboard: https://vercel.com/support
- Discord: https://vercel.com/discord
- Docs: https://vercel.com/docs

### Check Status
- https://www.vercel-status.com

---

## ✅ Verification Steps

After fixing, verify:

1. **Build Succeeds**
   ```
   ✓ Build completed successfully
   ```

2. **Site Loads**
   ```
   Visit: https://your-app.vercel.app
   ```

3. **No Console Errors**
   ```
   Open browser DevTools → Console
   Should be clean
   ```

4. **API Works**
   ```
   Test a page that calls API
   Check Network tab
   ```

5. **All Routes Work**
   ```
   Test: /, /shop, /admin/login
   No 404 errors
   ```

---

## 🎯 Quick Test Commands

Test locally before deploying:

```bash
# Navigate to client
cd client

# Install dependencies
npm install

# Build
npm run build

# Preview build
npm run preview

# Should open at http://localhost:4173
```

If local build works, Vercel should work too!

---

## 💡 Pro Tips

1. **Always test locally first**
   ```bash
   npm run build && npm run preview
   ```

2. **Check environment variables**
   ```javascript
   console.log('Env:', import.meta.env)
   ```

3. **Use Vercel CLI for debugging**
   ```bash
   vercel dev
   ```

4. **Monitor build logs in real-time**
   - Watch the deployment logs as it builds

5. **Keep dependencies updated**
   ```bash
   npm update
   ```

---

## 🚀 Success!

Once fixed, you should see:
- ✅ Green checkmark in Vercel
- ✅ Site loads at your URL
- ✅ No console errors
- ✅ API calls working
- ✅ All pages accessible

---

**Need more help?** See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed guide.

**Last Updated**: February 2026
