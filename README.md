# Social Post Generator

Drop an image URL, add some context about your brand, and get ready-to-use posts for Twitter, Reddit, Instagram, and Facebook. Each one is optimized for that platform's vibe — short tweets, Reddit-style discussions, Instagram captions with hashtags, Facebook-friendly updates. Also shows you realistic mockups so you can see how they'll actually look before posting.

Built because copying the same caption across platforms never works well.

## What's inside

- React frontend with Vite and Tailwind
- Express backend that talks to an AI image agent
- SQLite database for keeping your post history around
- ImageKit for storing uploaded images (so they don't disappear)

## Running it

```bash
npm install
cp .env.example .env
# fill in your API keys
npm run dev
```

This starts both the backend (port 3001) and frontend (port 5173) at the same time.

## Environment Variables

You'll need these in your `.env`:

| Variable | What it is |
|----------|------------|
| `VITE_IMAGE_AGENT_API_KEY` | API key for the image agent service |
| `VITE_IMAGE_AGENT_URL` | URL of the image agent endpoint |
| `IMAGEKIT_PUBLIC_KEY` | Your ImageKit public key |
| `IMAGEKIT_PRIVATE_KEY` | Your ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | Your ImageKit URL endpoint (looks like `https://ik.imagekit.io/your-id`) |

## What it does

You paste an image URL (or upload a file), tell it about your brand, and it generates four posts. They get saved automatically so you don't lose them. If the API fails on the first try (cold starts), it retries once after a few seconds.

Images get uploaded to ImageKit with dedup — same URL won't upload twice. You can also browse past posts from the history section and delete ones you don't need anymore.
