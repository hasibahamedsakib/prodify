# 🚀 Deployment Guide

## Quick Deployment to Vercel

### Step 1: Prepare Your Repository

1. **Initialize Git (if not already done)**

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Prodify Product Management App"
   ```

2. **Create a GitHub Repository**

   - Go to [github.com/new](https://github.com/new)
   - Name it `prodify` or your preferred name
   - Don't initialize with README (you already have one)

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. **Sign in to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub

2. **Import Project**

   - Click "Add New..." → "Project"
   - Select your GitHub repository
   - Vercel will automatically detect Next.js

3. **Configure (Default settings work!)**

   - Framework Preset: Next.js
   - Build Command: `pnpm build` or `npm run build`
   - Output Directory: `.next`
   - Install Command: `pnpm install` or `npm install`
   - Node Version: 18.x or higher

4. **Deploy**

   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live! 🎉

5. **Get Your Live URL**
   - Example: `https://prodify.vercel.app`
   - Custom domain available in project settings

### Step 3: Test Your Deployment

1. Visit your live URL
2. Login with your email
3. Test all features:
   - ✅ Product listing
   - ✅ Search
   - ✅ Create product
   - ✅ Edit product
   - ✅ Delete product
   - ✅ View details

## Alternative: Deploy to Netlify

### Quick Deploy

1. **Build the project locally**

   ```bash
   pnpm build
   ```

2. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Via GitHub

1. **Push to GitHub** (same as Vercel step 1)

2. **Import to Netlify**

   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub and select your repository

3. **Build Settings**

   - Build command: `pnpm build`
   - Publish directory: `.next`

4. **Deploy!**

## Troubleshooting

### Build Fails

- Ensure all dependencies are listed in `package.json`
- Check Node version (18+ required)
- Run `pnpm install` to verify dependencies

### API Not Working

- The API is external: `https://api.bitechx.com`
- Ensure CORS is handled (it is by the API)
- Check network tab for API calls

### Images Not Loading

- Next.js Image requires domain configuration
- External images are already configured in `next.config.ts`

## Submission Checklist

For your job application, provide:

- ✅ **GitHub Repository URL**: `https://github.com/YOUR_USERNAME/prodify`
- ✅ **Live Deployment URL**: `https://your-app.vercel.app`
- ✅ **README with instructions**: Already included
- ✅ **All features implemented**: Check the README feature list
- ✅ **Responsive design**: Tested on mobile, tablet, desktop
- ✅ **Clean code**: TypeScript, organized structure

## Post-Deployment

### Custom Domain (Optional)

1. Go to Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Environment Variables (If Needed Later)

1. Go to Vercel project settings
2. Navigate to "Environment Variables"
3. Add variables
4. Redeploy

### Monitoring

- Check Vercel dashboard for:
  - Build logs
  - Runtime logs
  - Performance analytics
  - Error tracking

## Support

If you encounter issues:

- Check Vercel/Netlify documentation
- Review build logs
- Contact: connect@bitechx.com

---

**Good luck with your deployment! 🚀**
