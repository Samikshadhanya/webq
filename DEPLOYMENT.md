# Deployment Guide - Quiz Master

This guide will help you deploy Quiz Master to Vercel with a live database.

## Prerequisites

1. **GitHub Account** - Required for connecting to Vercel
2. **Vercel Account** - Free at vercel.com
3. **Neon Account** - Free PostgreSQL database at neon.tech

## Step 1: Create Neon Database

1. Visit [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy your connection string (looks like: `postgresql://user:password@db.neon.tech/dbname`)
4. Keep this safe - you'll need it next

## Step 2: Prepare Your Code

1. Make sure all code is committed to your GitHub repository
2. The repository should be public or you should have access
3. All `.env.local` files should NOT be committed (they're in .gitignore)

## Step 3: Deploy to Vercel

### Option A: Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Click "Import"
5. Under "Environment Variables", add:
   - **Key**: `POSTGRES_PRISMA_URL`
     **Value**: `postgresql://user:password@db.neon.tech/dbname` (from Neon)
   
   - **Key**: `POSTGRES_URL_NON_POOLING`
     **Value**: `postgresql://user:password@db.neon.tech/dbname` (same as above)
   
   - **Key**: `JWT_SECRET`
     **Value**: Generate a random 32+ character string (use https://generate-random.org/ or similar)

6. Click "Deploy"
7. Wait for deployment to complete (should take 2-3 minutes)

### Option B: Vercel CLI

```bash
npm i -g vercel
cd quiz-master
vercel
```

When prompted, add your Neon database URL and JWT secret.

## Step 4: Initialize Database

After deployment:

1. Visit your Vercel deployment URL
2. Go to `https://your-deployment-url/api/init`
3. Open browser console and make a POST request:

```javascript
fetch('/api/init', { method: 'POST' })
  .then(r => r.json())
  .then(data => console.log(data))
```

Or simply visit the URL and add `?init=true` and refresh a few times until you see success.

**Alternatively**, use cURL:
```bash
curl -X POST https://your-deployment-url/api/init
```

4. You should see:
```json
{
  "success": true,
  "message": "Database initialized successfully!",
  "credentials": {
    "email": "admin@quizmaster.com",
    "password": "admin123"
  }
}
```

## Step 5: Access Your App

1. Visit your Vercel deployment URL
2. Click "Sign Up" to create an account OR
3. Click "Login" and use:
   - Email: `admin@quizmaster.com`
   - Password: `admin123`

4. Start creating and taking quizzes!

## Post-Deployment

### Update JWT Secret (Recommended)

Your initial JWT secret was visible. In production, update it:

1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Update `JWT_SECRET` with a secure random value
5. Redeploy (click Deployments → latest → Redeploy)

### Monitor Your Database

1. Visit [neon.tech](https://neon.tech)
2. Go to your project
3. Check "Monitoring" tab for query performance
4. View "SQL Editor" to inspect your database

### Troubleshooting

#### Deployment Failed
- Check Vercel build logs (Deployments tab)
- Verify environment variables are set
- Ensure Neon database URL is correct

#### Database Connection Error
- Verify Neon URL format: `postgresql://user:password@db.neon.tech/dbname`
- Check network access in Neon console
- Try manually connecting with psql to test

#### Init endpoint not working
- Make sure you're accessing the right URL
- Check browser console for errors
- Try the cURL command instead

#### Can't login after init
- Check that the init returned success
- Verify credentials: `admin@quizmaster.com` / `admin123`
- Try creating a new account instead

## Maintenance

### Regular Backups

Neon provides automatic backups. To backup:
1. Go to Neon project settings
2. Download database dump if needed
3. Store securely

### Monitoring

Monitor your app with:
- **Vercel Analytics**: Dashboard → Analytics
- **Neon Monitoring**: Project → Monitoring
- **Error Tracking**: Vercel → Deployments → Errors

### Scaling

As your app grows:
- Upgrade Neon database tier if needed
- Monitor Vercel usage
- Consider adding caching with Redis
- Optimize database queries

## Security Checklist

- [ ] JWT_SECRET is a strong random string (32+ chars)
- [ ] Database URL is not exposed in code
- [ ] Passwords are hashed (bcryptjs)
- [ ] Environment variables set in Vercel
- [ ] Git repository doesn't contain .env files
- [ ] CORS is properly configured (if needed)
- [ ] Regular security updates

## Need Help?

### Resources
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Common Issues
- Database initialization failing → Check Neon URL and network access
- Login not working → Run init endpoint again
- Build failing → Check Node.js version, run `npm ci` locally first
- Slow queries → Add database indexes, check Neon monitoring

## Rollback

If deployment has issues:
1. Go to Vercel Dashboard
2. Deployments tab
3. Select previous working deployment
4. Click "Promote to Production"

---

**Congratulations! Your Quiz Master app is now live!** 🎉
