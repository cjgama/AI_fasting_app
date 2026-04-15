# Deployment Guide - Vercel

This guide will help you deploy the Fasting Tracker app to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free at https://vercel.com)
- Git installed locally

## Step-by-Step Deployment

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name it `fasting-tracker` (or your preferred name)
4. Add a description: "A simple web app to track fasting cycles"
5. Choose "Public" or "Private"
6. **Don't** initialize README, .gitignore, or license (we already have these)
7. Click "Create repository"

### 2. Push Your Code to GitHub

Copy the commands shown on your new GitHub repository page. They should look like this:

```bash
git remote add origin https://github.com/YOUR_USERNAME/fasting-tracker.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

Run these commands in your project directory to push your code to GitHub.

### 3. Deploy to Vercel

#### Option A: Connect via Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your `fasting-tracker` repository from GitHub
4. Vercel will auto-detect the settings (Vite project)
5. Click "Deploy"
6. Wait for deployment to complete (usually 1-2 minutes)
7. You'll get a URL like `https://fasting-tracker.vercel.app`

#### Option B: Install Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts to authenticate and deploy.

### 4. Custom Domain (Optional)

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS instructions provided

## Automatic Deployments

After connecting to Vercel, every push to your GitHub `main` branch will automatically trigger a new deployment!

## Environment Variables (if needed in future)

1. In Vercel dashboard, go to "Settings" → "Environment Variables"
2. Add any variables you need
3. Redeploy by pushing new code or manually triggering a deployment

## Viewing Deployment Logs

1. Go to your Vercel dashboard
2. Click on your project
3. Click on a deployment to see build logs and errors

## Rollback to Previous Deployment

1. In Vercel dashboard, click on "Deployments"
2. Find the previous working deployment
3. Click the "..." menu and select "Promote to Production"

## Troubleshooting

**Build failed?**
- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Run `npm run build` locally to test

**Site shows 404?**
- Vercel detected Vite correctly (check in deployment logs)
- Clear your browser cache
- Wait 30 seconds and refresh

**Need to rollback?**
- Use "Promote to Production" on a previous successful deployment
- Or push a fix to GitHub to trigger a new deployment

## What's Next?

After deploying, you can:
- Share your live URL with others
- Monitor deployments in Vercel dashboard
- Set up automatic email notifications for deployments
- Enable Preview Deployments for pull requests

Enjoy your live Fasting Tracker app! 🎉
