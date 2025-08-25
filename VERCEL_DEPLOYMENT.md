# 🚀 Vercel Deployment Guide (Frontend)

## Prerequisites
- GitHub repository with your code
- Vercel account
- Backend deployed (Render or other platform)

## Step 1: Prepare Your Repository

Make sure your code is pushed to GitHub:

```bash
cd /Users/cajetan/Desktop/Oddys/book-scraper
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### 1. Go to Vercel Dashboard
- Visit [vercel.com](https://vercel.com)
- Sign up/login with GitHub

### 2. Create New Project
- Click "New Project"
- Import your GitHub repository
- Select the `book-scraper` repository

### 3. Configure Project

**Framework Preset:**
- **Framework**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

**Environment Variables:**
Add this in the Environment Variables section:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

**Replace `your-backend-url` with your actual Render backend URL**

### 4. Deploy
- Click "Deploy"
- Wait for deployment (1-3 minutes)

## Step 3: Configure Environment Variables

### Option 1: During Deployment
Add in the deployment wizard:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Option 2: After Deployment
1. Go to your project dashboard
2. Click "Settings" → "Environment Variables"
3. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
   - **Environment**: Production, Preview, Development

## Step 4: Test Your Deployment

Once deployed, test your application:

1. **Visit your Vercel URL**: `https://your-app-name.vercel.app`
2. **Test functionality**:
   - Search for books
   - Click on book cards
   - Try the scrape function
   - Test pagination and sorting

## Step 5: Custom Domain (Optional)

1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS settings

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Check for TypeScript errors

2. **API Connection Issues**
   - Verify VITE_API_URL is correct
   - Check CORS settings on backend
   - Ensure backend is deployed and running

3. **Environment Variables**
   - Make sure VITE_API_URL starts with `VITE_`
   - Redeploy after adding environment variables

4. **404 Errors**
   - Check if your app uses client-side routing
   - Configure redirects in vercel.json if needed

## Performance Optimization

### 1. Enable Edge Functions
- Vercel automatically optimizes your app
- Uses CDN for global performance

### 2. Image Optimization
- Vercel automatically optimizes images
- Use Next.js Image component for better performance

### 3. Caching
- Vercel provides automatic caching
- Configure cache headers if needed

## Vercel Configuration File

Create `vercel.json` in your frontend directory for custom settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Cost Considerations

- **Free Tier**: $0/month (generous limits)
- **Pro Plan**: $20/month (for teams)
- **Enterprise**: Custom pricing

## Next Steps

After successful deployment:
1. Test all functionality
2. Set up custom domain (optional)
3. Configure analytics (optional)
4. Set up monitoring and alerts

## Useful Commands

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from command line
vercel

# Deploy to production
vercel --prod

# Pull environment variables
vercel env pull
```

---

**Your frontend will be available at:**
`https://your-app-name.vercel.app`

**Features:**
- ✅ Automatic deployments on git push
- ✅ Global CDN
- ✅ Edge functions
- ✅ Image optimization
- ✅ Analytics (optional)
- ✅ Custom domains
