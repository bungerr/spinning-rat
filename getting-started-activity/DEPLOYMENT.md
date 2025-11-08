# Quick Deployment Guide - Spinning Rat Discord Activity

This is a quick reference guide for deploying the Spinning Rat Discord Activity to Vercel.

## Prerequisites Checklist

- [ ] Discord Application created in [Developer Portal](https://discord.com/developers/applications)
- [ ] Discord Client ID and Client Secret saved
- [ ] Vercel account created at [vercel.com](https://vercel.com)
- [ ] Code pushed to GitHub/GitLab/Bitbucket (for Option B) OR Vercel CLI installed (for Option A)

## Quick Start: Deploy via Vercel CLI

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to the project directory
cd getting-started-activity

# 3. Login to Vercel
vercel login

# 4. Deploy to preview
vercel

# 5. Add environment variables
vercel env add VITE_DISCORD_CLIENT_ID
# Enter your Discord Client ID, select "All" environments

vercel env add DISCORD_CLIENT_SECRET
# Enter your Discord Client Secret, select "All" environments

# 6. Deploy to production
vercel --prod

# 7. Copy your production URL (e.g., https://your-app.vercel.app)
```

## Configure Discord

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Navigate to **Activities** → **URL Mappings**
4. Add URL Mapping:
   - Prefix: `/`
   - Target: `https://your-app.vercel.app` (your Vercel URL)
5. Save and enable the activity

## Test in Discord

1. Open Discord
2. Join a voice channel or DM
3. Click the App Launcher (rocket icon)
4. Find and launch your activity
5. Enjoy the spinning rat!

## Updating Your Deployment

Whenever you make changes to your code:

```bash
# For linked projects (after initial deployment)
vercel --prod

# Or if using GitHub integration, just push to your repo
git add .
git commit -m "Update activity"
git push origin main
# Vercel will automatically redeploy
```

## Common Issues

**Activity not loading?**
- Check Vercel deployment logs
- Verify environment variables are set
- Confirm Discord URL mapping matches your Vercel URL exactly

**Authentication failing?**
- Ensure `VITE_DISCORD_CLIENT_ID` has the `VITE_` prefix
- Check that `DISCORD_CLIENT_SECRET` is set
- Look at Vercel function logs for errors

**Assets not loading?**
- Make sure files are in `client/public/`
- Check they were included in the build (look at Vercel deployment files)

## Support

For more detailed information, see the main [README.md](README.md)
