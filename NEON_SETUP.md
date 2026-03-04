# Neon PostgreSQL Setup Guide

## Step 1: Create a Neon Account (FREE)

1. Go to https://neon.tech
2. Click "Sign Up" button
3. Choose "Sign up with GitHub" (easiest)
4. Authorize Neon to access your GitHub account
5. Complete the signup process

## Step 2: Create Your First Project

1. After login, click "Create a project"
2. Give it a name: `quiz-master`
3. Choose region closest to you
4. Click "Create project"

**Wait for the project to be created (usually 30 seconds)**

## Step 3: Get Your Connection String

1. In your new project, go to the "Connection" tab
2. Select "Pooled connection" from the dropdown
3. Copy the full connection string that looks like:
   ```
   postgresql://user:password@ep-xxxxx.region.neon.tech/database?sslmode=require&connection_limit=1
   ```

## Step 4: Add to Vercel Environment Variables

1. Go to your Vercel project settings
2. Click "Environment Variables"
3. Add these variables:

   **Name:** `POSTGRES_PRISMA_URL`
   **Value:** [Paste the connection string from Step 3]
   **Environments:** Select all (Production, Preview, Development)

   **Name:** `POSTGRES_URL_NON_POOLING`
   **Value:** [Same connection string]
   **Environments:** Select all

   **Name:** `JWT_SECRET`
   **Value:** `your-super-secret-jwt-key-change-this-in-production-12345`
   **Environments:** Select all

4. Click "Save"

## Step 5: Deploy to Vercel

1. Click the "Publish" button in the top right of v0
2. Or go to your Vercel dashboard
3. Your app will automatically:
   - Initialize the database
   - Create all tables
   - Seed sample quizzes
   - Deploy to production

## What Happens Next

- Vercel will build and deploy your app
- The `/api/init` endpoint will automatically create all tables
- Sample quizzes will be added to the database
- Your app will be live at `https://[your-project].vercel.app`

## Testing Your Setup

1. Wait 2-3 minutes for deployment to complete
2. Visit your deployed URL
3. Click "Sign Up" to create an account
4. Take a quiz!

## Database Structure

Your Neon database will have these tables:

- **users** - User accounts and profiles
- **quizzes** - Quiz metadata
- **questions** - Individual quiz questions
- **options** - Multiple choice options for each question
- **responses** - User quiz attempt responses
- **results** - Quiz completion results

## Troubleshooting

**"Connection refused"**
- Check your connection string is correct
- Verify Neon project is active
- Wait a few minutes for database to fully initialize

**"Database does not exist"**
- The `/api/init` endpoint creates tables automatically
- Visit your app URL to trigger initialization

**"Password authentication failed"**
- Double-check the connection string from Neon console
- Make sure you copied the pooled connection string

## Next Steps

After deployment:
1. Share the live URL with others
2. Users can sign up and take quizzes
3. View leaderboards and analytics
4. Create new quizzes

---

**Need help?** Check the README.md file for complete documentation.
