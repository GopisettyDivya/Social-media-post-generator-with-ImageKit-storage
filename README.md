# Social Post Generator

Drop an image URL, add some context about your brand, and get ready-to-use posts for Twitter, Reddit, Instagram, and Facebook. Each one is optimized for that platform's vibe.

## Running locally

```bash
npm install
cp .env.example .env
# fill in your API keys
npm run dev
```

Starts frontend on `:5173` and a tiny dev server on `:3001` (only for ImageKit auth).

## Deploy on Vercel

Push to GitHub and import on Vercel. The app uses:
- **Vercel serverless function** for the Image Agent proxy + ImageKit auth
- **Browser localStorage** for post history
- **Client-side upload** to ImageKit (no backend needed)

No Express server, no database — fully serverless.

### Environment Variables

Set these in Vercel project settings:

| Variable | Description |
|----------|-------------|
| `VITE_IMAGE_AGENT_API_KEY` | API key for the image agent |
| `VITE_IMAGE_AGENT_URL` | Image agent endpoint URL |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint |
