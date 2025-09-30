# 🚀 Deployment Guide - Estier

Complete guide to deploy Estier to production.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- MongoDB Atlas account (free tier works)

## Step 1: Set Up MongoDB Atlas

### 1.1 Create Account
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a new project (e.g., "Estier Production")

### 1.2 Create Cluster
1. Click "Build a Database"
2. Choose **FREE** M0 tier
3. Select a cloud provider and region (closest to your users)
4. Click "Create Cluster"

### 1.3 Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `estier-admin`
5. Password: Generate a secure password (save it!)
6. Database User Privileges: "Atlas Admin"
7. Click "Add User"

### 1.4 Whitelist IP Addresses
1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note:** For production, restrict to specific IPs
4. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `myFirstDatabase` with `estier`

Example:
```
mongodb+srv://estier-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/estier?retryWrites=true&w=majority
```

## Step 2: Push to GitHub

### 2.1 Initialize Git (if not done)
```bash
cd estier
git init
git add .
git commit -m "Initial commit - Estier MVP"
```

### 2.2 Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name: `estier-platform`
4. Description: "Desi Hip-Hop Fan Engagement Platform"
5. Choose Public or Private
6. Don't initialize with README (we have one)
7. Click "Create repository"

### 2.3 Push Code
```bash
git remote add origin https://github.com/YOUR_USERNAME/estier-platform.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Import Project
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login (use GitHub account)
3. Click "Add New" → "Project"
4. Import your `estier-platform` repository
5. Click "Import"

### 3.2 Configure Project
1. **Framework Preset:** Next.js (auto-detected)
2. **Root Directory:** `./` (default)
3. **Build Command:** `next build` (default)
4. **Output Directory:** `.next` (default)

### 3.3 Add Environment Variables

Click "Environment Variables" and add:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://estier-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/estier?retryWrites=true&w=majority

# JWT Secret (generate a random secure string)
JWT_SECRET=super-secret-jwt-key-change-this-to-random-string-2025

# API URL (will be your Vercel URL)
NEXT_PUBLIC_API_URL=https://your-project-name.vercel.app
```

**Generate a secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.4 Deploy
1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. You'll get a URL like: `https://estier-platform.vercel.app`

## Step 4: Seed Production Database

### 4.1 Update Environment Variables Locally
Create a new file `.env.production` with your Atlas URI:
```bash
MONGODB_URI=mongodb+srv://estier-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/estier?retryWrites=true&w=majority
```

### 4.2 Run Seed Script
```bash
# Load production env and seed
MONGODB_URI="your-atlas-uri" npm run seed
```

This will populate your production database with sample data.

## Step 5: Update API URL

### 5.1 Get Your Vercel URL
After deployment, copy your Vercel URL (e.g., `https://estier-platform.vercel.app`)

### 5.2 Update Environment Variable
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Find `NEXT_PUBLIC_API_URL`
4. Update to your actual Vercel URL
5. Click "Save"

### 5.3 Redeploy
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"

## Step 6: Test Production

### 6.1 Visit Your Site
Open: `https://your-project-name.vercel.app`

### 6.2 Test Features
- [ ] Sign up / Login works
- [ ] Feed loads and posts can be created
- [ ] Polls display and voting works
- [ ] News articles load
- [ ] Marketplace shows products
- [ ] Profile can be edited
- [ ] Cart and checkout work

### 6.3 Login with Sample Account
```
Email: asmit@estier.com
Password: password123
```

## Step 7: Custom Domain (Optional)

### 7.1 Purchase Domain
Buy a domain from:
- Namecheap
- GoDaddy
- Google Domains

Example: `estier.io`

### 7.2 Add to Vercel
1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `estier.io`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take 24-48 hours)

### 7.3 Update Environment Variables
Update `NEXT_PUBLIC_API_URL` to your custom domain

## Step 8: Monitoring & Maintenance

### 8.1 Vercel Analytics
Enable analytics in Vercel dashboard to track:
- Page views
- Performance
- User engagement

### 8.2 MongoDB Atlas Monitoring
Monitor your database:
- Go to Atlas Dashboard → Metrics
- Track:
  - Connections
  - Operations
  - Storage

### 8.3 Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay

## Troubleshooting

### Build Fails on Vercel

**Check build logs:**
1. Vercel Dashboard → Deployments → Failed deployment
2. View "Building" logs
3. Fix errors and push to GitHub

**Common issues:**
- Missing dependencies: Update `package.json`
- Environment variables: Verify all are set
- Node version: Check Vercel uses Node 18+

### Database Connection Errors

**Check:**
1. MongoDB Atlas cluster is running
2. IP whitelist includes 0.0.0.0/0
3. Database user credentials are correct
4. Connection string is properly formatted

**Test connection:**
```bash
# Use mongosh to test
mongosh "your-connection-string"
```

### API Routes Not Working

**Verify:**
1. `NEXT_PUBLIC_API_URL` matches your Vercel URL
2. API routes are in `pages/api/` directory
3. Check Vercel function logs

### Socket.io Not Connecting

**Note:** Socket.io requires:
- Serverless functions support (Vercel has limits)
- Consider using Pusher or Ably for production WebSockets

**Alternative:**
Deploy Socket.io server separately on:
- Railway
- Render
- Heroku

## Production Best Practices

### Security

1. **Environment Variables:**
   - Never commit `.env.local` to Git
   - Use strong, random JWT secrets
   - Rotate secrets periodically

2. **Database:**
   - Restrict MongoDB IP whitelist
   - Use strong database passwords
   - Enable audit logs

3. **API Rate Limiting:**
   ```js
   // Add to API routes
   import rateLimit from 'express-rate-limit';
   ```

4. **CORS:**
   ```js
   // Restrict to your domain
   res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
   ```

### Performance

1. **Image Optimization:**
   - Use Next.js Image component
   - Optimize images before upload
   - Use CDN for static assets

2. **Caching:**
   - Enable Vercel Edge caching
   - Cache API responses
   - Use Redis for session storage

3. **Database Indexing:**
   ```js
   // Add indexes to frequently queried fields
   UserSchema.index({ email: 1 });
   PostSchema.index({ createdAt: -1 });
   ```

### Monitoring

1. **Set up alerts:**
   - MongoDB Atlas alerts
   - Vercel deployment notifications
   - Error tracking alerts

2. **Regular backups:**
   - Enable MongoDB automatic backups
   - Export data periodically

## Cost Estimates

### Free Tier (MVP)
- **Vercel:** Free (100GB bandwidth, unlimited deployments)
- **MongoDB Atlas:** Free (512MB storage, shared cluster)
- **Total:** $0/month

### Paid (Growing)
- **Vercel Pro:** $20/month (1TB bandwidth, advanced features)
- **MongoDB Atlas M10:** $57/month (2GB storage, dedicated cluster)
- **Total:** ~$77/month

## Going Live Checklist

- [ ] MongoDB Atlas cluster created and seeded
- [ ] GitHub repository created and pushed
- [ ] Vercel project deployed successfully
- [ ] All environment variables configured
- [ ] Production database seeded
- [ ] All features tested on production
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled
- [ ] Error tracking set up
- [ ] Backups configured
- [ ] Team members invited (if applicable)

## Next Steps

1. **Marketing:**
   - Share on social media
   - Post on Product Hunt
   - Reach out to Desi Hip-Hop communities

2. **Gather Feedback:**
   - Add feedback form
   - Monitor user behavior
   - Iterate based on feedback

3. **Scale:**
   - Upgrade infrastructure as needed
   - Add more features
   - Optimize performance

---

**Your Estier platform is now live! 🎉**

Share it with the Desi Hip-Hop community and watch it grow!
