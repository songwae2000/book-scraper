# 🚀 Render Deployment Guide

## Prerequisites
- GitHub repository with your code
- MongoDB Atlas database (already configured)
- Render account

## Step 1: Prepare Your Repository

Make sure your code is pushed to GitHub:

```bash
cd /Users/cajetan/Desktop/Oddys/book-scraper
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

## Step 2: Deploy to Render

### 1. Go to Render Dashboard
- Visit [render.com](https://render.com)
- Sign up/login with GitHub

### 2. Create New Web Service
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select the `book-scraper` repository

### 3. Configure Service

**Basic Settings:**
- **Name**: `book-scraper-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`

**Build & Deploy:**
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free

### 4. Environment Variables

Add these in the Environment tab:

```
MONGODB_URI=mongodb+srv://songwae2000:Myresult1%24@cluster0.dgyrgt5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
PORT=3001
```

### 5. Deploy
- Click "Create Web Service"
- Wait for deployment (2-5 minutes)

## Step 3: Test Your Deployment

Once deployed, test your API:

```bash
# Health check
curl https://your-app-name.onrender.com/health

# Get books
curl https://your-app-name.onrender.com/api/books

# Test scraping
curl -X POST https://your-app-name.onrender.com/api/books/scrape
```

## Step 4: Update Frontend

Update your frontend environment variables:

```bash
# In your frontend .env file
VITE_API_URL=https://your-app-name.onrender.com/api
```

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json

2. **MongoDB Connection Issues**
   - Verify MONGODB_URI is correct
   - Check MongoDB Atlas network access

3. **Port Issues**
   - Render automatically assigns ports
   - Use `process.env.PORT` in your code

4. **Puppeteer Issues**
   - Render free tier has limitations
   - Consider upgrading to paid plan for better performance

## Performance Tips

1. **Enable Auto-Deploy**: Deploy on every push to main
2. **Monitor Logs**: Check Render logs for errors
3. **Set Up Alerts**: Configure notifications for failures
4. **Optimize Build**: Minimize build time

## Cost Considerations

- **Free Tier**: $0/month (limited resources)
- **Paid Plans**: $7+/month (better performance)
- **MongoDB Atlas**: Free tier available

## Next Steps

After successful deployment:
1. Test all API endpoints
2. Deploy frontend to Vercel/Netlify
3. Update frontend API URL
4. Monitor performance and logs

---

**Your backend will be available at:**
`https://your-app-name.onrender.com`

**API Endpoints:**
- `GET /health` - Health check
- `GET /api/books` - Get all books
- `GET /api/books/search?q=query` - Search books
- `POST /api/books/scrape` - Trigger scraping
- `GET /api/books/stats` - Get statistics
