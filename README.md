# Social Post Generator

Drop an image URL, add some context about your brand, and get ready-to-use posts for Twitter, Reddit, Instagram, and Facebook. Each one is optimized for that platform's vibe — short tweets, Reddit-style discussions, Instagram captions with hashtags, Facebook-friendly updates.

Built because copying the same caption across platforms never works well.

## Running locally

```bash
npm install
cp .env.example .env
# fill in your API keys
npm run dev
```

Starts frontend on `:5173` and a tiny dev server on `:3001` (only for file uploads to ImageKit).

## Deploy on Vercel

Push to GitHub and import on Vercel. Add these env vars in Vercel project settings:

| Variable | Description |
|----------|-------------|
| `VITE_IMAGE_AGENT_API_KEY` | API key for the image agent |
| `VITE_IMAGE_AGENT_URL` | Image agent endpoint URL |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint |

No build commands needed — Vercel auto-configures. The app is fully serverless:
- Image Agent called directly from the browser
- File uploads go through a fast serverless function to ImageKit
- Post history stored in localStorage

**Note:** The API key is exposed to the browser since the Image Agent is called client-side. This is a demo app.
