# Spinning Rat - Discord Activity

A Discord Activity port of the spinning-rat Three.js application. This interactive 3D experience features a rotating 3D model with spatial audio effects that can be shared with friends in Discord voice channels.

## Features

- Interactive 3D model with customizable rotation controls
- Spatial audio with directional filtering (audio gets muffled when the model faces away)
- X/Y/Z rotation speed controls
- Preset rotation modes (Horizontal/Vertical)
- Orbit camera controls
- Discord SDK integration for multi-user experiences

## Project Structure

```
getting-started-activity/
├── client/              # Frontend (Vite + Three.js) - Deploy this to Vercel
│   ├── api/            # Serverless API functions (Vercel)
│   │   └── token.js   # OAuth2 token exchange endpoint
│   ├── main.js         # Main application code with Three.js and Discord SDK
│   ├── style.css       # Styling
│   ├── index.html      # HTML structure
│   ├── public/         # Static assets (3D model, audio, images)
│   ├── package.json    # Dependencies
│   └── vite.config.js  # Vite configuration
├── server/              # Local development server (Express.js) - Not deployed
│   └── server.js       # Local OAuth2 endpoint for testing
└── example.env          # Environment variables template
```

## Prerequisites

- Node.js (v16 or higher recommended)
- A Discord application (created in the [Discord Developer Portal](https://discord.com/developers/applications))
- npm or yarn
- A [Vercel](https://vercel.com) account (free tier works perfectly)

## Setup Instructions

### 1. Create a Discord Application

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Navigate to the "OAuth2" section
4. Add a redirect URI: `https://127.0.0.1` (placeholder for now)
5. Copy your Client ID and Client Secret

### 2. Configure Environment Variables (For Local Development)

1. Copy `example.env` to `.env` in the root directory:
   ```bash
   cp example.env .env
   ```

2. Edit `.env` and add your Discord credentials:
   ```
   VITE_DISCORD_CLIENT_ID=your_client_id_here
   DISCORD_CLIENT_SECRET=your_client_secret_here
   ```

**Note:** For Vercel deployment, you'll add these as environment variables in Vercel later.

### 3. Install Dependencies

Install client dependencies:
```bash
cd client
npm install
```

Install server dependencies:
```bash
cd ../server
npm install
```

### 4. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New..." → "Project"
4. Import your Git repository
5. Configure project settings:
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `getting-started-activity/client`
   - **Build Command**: Leave as default (`vite build`)
   - **Output Directory**: Leave as default (`dist`)
6. Add Environment Variables before deploying:
   - Click "Environment Variables"
   - Add `VITE_DISCORD_CLIENT_ID` with your Discord Client ID
   - Add `DISCORD_CLIENT_SECRET` with your Discord Client Secret
   - Make sure both are set for **Production**, **Preview**, and **Development**
7. Click "Deploy"
8. Wait for deployment to complete and **copy your production URL** (e.g., `https://spinning-rat-activity.vercel.app`)

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Navigate to the client directory:
   ```bash
   cd getting-started-activity/client
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? `spinning-rat-activity` (or your choice)
   - In which directory is your code located? **./** (just press Enter)
   - Vercel should auto-detect Vite

6. Add environment variables:
   ```bash
   vercel env add VITE_DISCORD_CLIENT_ID
   # Enter your Discord Client ID, select "All" environments

   vercel env add DISCORD_CLIENT_SECRET
   # Enter your Discord Client Secret, select "All" environments
   ```

7. Redeploy with environment variables:
   ```bash
   vercel --prod
   ```

8. **Copy your deployment URL** from the output

### 5. Configure Discord to Use Your Vercel Deployment

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Navigate to **"Activities"** in the left sidebar
   - If you don't see "Activities", you may need to enable it first
4. Under **"URL Mappings"**, click "Add URL Mapping"
5. Configure the mapping:
   - **Prefix**: `/`
   - **Target**: Your Vercel URL (e.g., `https://spinning-rat-activity.vercel.app`)
6. Click "Save"
7. Make sure the activity is enabled

### 6. Launch Your Activity in Discord!

1. Open Discord (desktop, web, or mobile)
2. Go to any voice channel or DM
3. Click the **App Launcher** (rocket icon) or the **"+"** button in the voice channel
4. Find your activity by name in the list
5. Click to launch your Spinning Rat activity
6. Click on the screen to start the audio and enjoy!

### 7. Local Development (Optional)

For local testing during development, you can run both the client and server locally:

**Terminal 1 - Start the local server:**
```bash
cd server
npm run dev
```
The server will run on http://localhost:3001

**Terminal 2 - Start the client:**
```bash
cd client
npm run dev
```
The client will run on http://localhost:5173

The Vite dev server is configured to proxy `/api` requests to the local Express server.

## How to Use

1. Click on the screen to start the audio and remove the splash screen
2. Use the X/Y/Z sliders to control rotation speed on each axis
3. Click "Horizontal" or "Vertical" buttons to apply preset rotations
4. Drag with your mouse to orbit the camera around the model
5. Notice how the audio becomes muffled when the model faces away from the camera

## Development

### Client Development
The client is built with Vite and uses:
- Three.js for 3D rendering
- Discord Embedded App SDK for Discord integration
- GLTFLoader for 3D model loading
- PositionalAudio for spatial audio effects

### Server Development
The server is a minimal Express.js application that:
- Handles OAuth2 token exchange with Discord
- Provides the `/api/token` endpoint for authentication

### Building for Production

```bash
cd client
npm run build
```

The built files will be in `client/dist/` and can be deployed to any static hosting service.

## Troubleshooting

**Discord SDK errors:**
- Make sure your environment variables are set correctly in Vercel
- Check the Vercel deployment logs for any build or runtime errors
- Verify that `VITE_DISCORD_CLIENT_ID` is correctly prefixed with `VITE_`
- For local development, ensure your `.env` file has the correct credentials

**Activity not showing in Discord:**
- Make sure you've configured the URL mapping in the Discord Developer Portal
- Verify the URL mapping target matches your exact Vercel URL
- Check that the activity is enabled in the Discord Developer Portal
- Try refreshing Discord or restarting the client

**API/Token errors:**
- Check that `DISCORD_CLIENT_SECRET` is set in Vercel environment variables
- Look at the Vercel function logs (Vercel Dashboard → Your Project → Functions)
- Ensure the `/api/token` endpoint is responding (check Network tab in browser dev tools)

**Audio not playing:**
- Browsers require user interaction before playing audio
- Click on the screen when prompted
- Check browser console for errors
- Some browsers may block autoplay - user interaction is always required

**3D model not loading:**
- Ensure `sample.glb` is in `client/public/`
- Check the browser console for loading errors
- Verify the file was included in the Vercel deployment

**Vercel deployment issues:**
- Make sure you set the root directory to `getting-started-activity/client`
- Ensure all dependencies are listed in `client/package.json`
- Review build logs in the Vercel dashboard for specific errors
- Verify the `/api` folder exists inside `client/` directory
- Make sure Node.js version is compatible (v16+)

## Credits

Based on the Discord Activity starter template from the [Building An Activity](https://discord.com/developers/docs/activities/building-an-activity) tutorial.

Three.js examples and helpers from [three.js](https://threejs.org/).
