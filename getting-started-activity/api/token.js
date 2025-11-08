// Vercel serverless function for Discord OAuth token exchange
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Missing authorization code' });
    }

    // Exchange the code for an access_token
    const response = await fetch(`https://discord.com/api/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.VITE_DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Discord API error:', error);
      return res.status(response.status).json({ error: 'Failed to exchange token' });
    }

    // Retrieve the access_token from the response
    const data = await response.json();
    const { access_token } = data;

    // Return the access_token to the client
    return res.status(200).json({ access_token });
  } catch (error) {
    console.error('Error in token exchange:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
